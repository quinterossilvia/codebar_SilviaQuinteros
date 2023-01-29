/****************************VARIABLES ***************************************/
const datosCliente = document.querySelector("#datos_cliente")
const inputNombre = document.querySelector("#input_nombre");
const inputEmail = document.querySelector("#input_email");
const inputMesa = document.querySelector("#input_mesa");
const inputEdad = document.querySelector("#input_edad");
const enviar = document.querySelector("#enviar");
let nombreUsuario = "";
let emailUsuario = "";
let mesaUsuario = "";  

let carrito = JSON.parse(localStorage.getItem('carrito')) || [] 
const listado = document.querySelector("#listado") 
const contenedorCarrito = document.querySelector("#contenedorCarrito") 
const contadorCarrito = document.querySelector("#contadorCarrito") 
const totalCarrito = document.querySelector("#totalCarrito") 
const linkCarrito = document.querySelector("#linkCarrito") 
linkCarrito.addEventListener('click',() => {
    agregarElmentoCarrito (carrito)
    
})

let inputBuscar = document.querySelector("#inputBuscar") 
inputBuscar.addEventListener('keyup', (e)=>{ 
    if (e.key === "Escape") e.target.value = ""
    if(e.target.matches("#inputBuscar")){
        document.querySelectorAll(".card_producto").forEach(producto => {
            producto.textContent.toLowerCase().includes(e.target.value.toLowerCase())
            ?producto.classList.remove("filtro")
            :producto.classList.add("filtro")
        })
    }
    e.preventDefault()
    
})
 

//********************************filtrar por tragos **********************************************
const btnFiltroTragos = document.querySelector("#btnFiltroTragos")
btnFiltroTragos.addEventListener('click',() => {
    filtroTragos()
})

//*****************************Quitar filtros seleccionados*******************************
const btnLimpiarFiltros = document.querySelector("#btnLimpiarFiltros")
btnLimpiarFiltros.addEventListener('click',() => {
    fetch("./datos.json")
    .then(res => res.json())
    .then(data => mostrarElementos(data)) 
})

//*********************ordenar de mayor a menor precio************************************
const mayorPrecio = document.querySelector("#mayorPrecio")
mayorPrecio.addEventListener('click',() => {
    fetch("./datos.json")
    .then(res => res.json())
    .then(data => mostrarElementos(data.sort(((a, b) => b.precio - a.precio))))
})

//****************************ordenar de menor a mayor precio**************************
const menorPrecio = document.querySelector("#menorPrecio")
menorPrecio.addEventListener('click',() => {
    fetch("./datos.json")
    .then(res => res.json())
    .then(data => mostrarElementos(data.sort(((a, b) => a.precio - b.precio)))) 
})


contadorCarrito.innerText = `${carrito.length}` 
fetch("./datos.json")
.then(res => res.json())
.then(data => mostrarElementos(data)) 

//****************************FUNCIONES ***************************************
function mostrarElementos (array){
    listado.innerHTML = ""
    array.forEach(producto =>{
        let div = document.createElement("div")
        div.className = "card card_producto"
        div.innerHTML = `
                        <div "card ">
                        <div class="d-flex flex-column justify-content-between align-items">    
                            <img class="card-img-top" src="./imagenes/${producto.imagen}" alt="img_${producto.titulo}">
                            <p class=" fw-bold text-primary text-center">${producto.descripcion}</p>
                            <p class="fw-bold text-center fst-italic fs-5"> $ ${producto.precio} </p>
                            <div class="d-flex justify-content-center"> 
                                <button id="${producto.id}" class="btnAgregarCarrito btn btn-dark" type="submit">Agregar al carrito</button>
                            </div>
                        </div>
                        `
        listado.append(div)
    })
    let btnAgregarCarrito = document.querySelectorAll('.btnAgregarCarrito') 
    
    btnAgregarCarrito.forEach(el => {
        el.addEventListener('click',(e) => {
            agregarProductoCarrito (parseInt(e.target.id), array)
        })
    })
}

//****************************************agregar productos al carrito************************************************* 
function agregarProductoCarrito (id, data) {
  const existe = carrito.some( (prod) => prod.id === id)
  const index = carrito.indexOf(carrito.find( (elemento) => elemento.id === id ))
  if(existe){   
      carrito[index].cantidad++
      localStorage.setItem('carrito',JSON.stringify(carrito))
  } else{
      
      const productoSelecionado = data.find(elemento => elemento.id === id) 
      carrito.push(productoSelecionado) // lo pusheo al carrito
      localStorage.setItem('carrito',JSON.stringify(carrito))
      contadorCarrito.innerText = `${carrito.length}`
  }
  
}

function agregarElmentoCarrito (dato){ 
    if(carrito.length >= 1){
        contenedorCarrito.innerText = "" 
        dato.forEach((elemento)=>{
            let div = document.createElement("div")
            div.className = "card mb-2 position-relative"
            div.innerHTML = `
                            <div class="row w-100 align-items-center ms-1">
                                <div class="col-md-4 ms-auto d-flex justify-content-center">
                                    <img src="./imagenes/${elemento.imagen}" class="img-fluid rounded-start px-1 ">
                                </div>
                                <div class="col-md-8">
                                    <div class="card-body p-0 px-1 position-relative">
                                        <p class="card-text m-0 fs-6 pe-3">${elemento.descripcion}</p>
                                        <div class="d-flex flex-row py-2 justify-content-between">
                                            <div class="btn-group btn-group-sm container-num">
                                                <button type="button" class="btn btn-dark btnWidth btnMenos" id="btnMenos${elemento.id}">-</button>
                                                <input type="number" class="btn-outline-dark num-input inputCantidad" id="inputCantidad${elemento.id}" min="1" value="${elemento.cantidad}">
                                                <button type="button" class="btn btn-dark btnWidth btnMas" id="btnMas${elemento.id}">+</button>
                                            </div>
                                            <p class="fw-bold fst-italic fs-5 m-0"> $ ${elemento.precio} </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button id="eliminar${elemento.id}" type="button" class="position-absolute top-0 end-0 btn btn-outline-dark btn-sm me-1 mt-1 btnEliminarProd d-flex justify-content-center align-items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                                </svg>
                            </button>
                            `
            contenedorCarrito.append(div)
            
            let btnEliminarProd = document.querySelector(`#eliminar${elemento.id}`) 
            btnEliminarProd.addEventListener('click',() => {
                eliminarDelCarrito(elemento.id)
            })

            //*********boton restar cantidad*********************************
            let btnMenos = document.querySelector(`#btnMenos${elemento.id}`)
            btnMenos.addEventListener('click',() => {
                decrementarCantidad(elemento.id)
            })

            //********boton sumar cantidad***********************************
            let btnMas = document.querySelector(`#btnMas${elemento.id}`)
            btnMas.addEventListener('click',() => {
                incrementarCantidad(elemento.id)
            })

            
            let inputCantidad = document.querySelector(`#inputCantidad${elemento.id}`)
            inputCantidad.addEventListener('input',() => {
                setearCantidad(elemento.id, parseInt(inputCantidad.value))
            })

        })
    }
    sumarTotal() 

    
    if (carrito.length === 0){
        limpiarPantallaCarrito()
    }
}


function sumarTotal (){
  let auxiliar = carrito.map((el) => el.precio*el.cantidad) 
  let total = auxiliar.reduce((acumulador, elemento) => acumulador + elemento,0)
  mostrarTotal(total)
}


function mostrarTotal (valor){
  let div = document.createElement("div")
  totalCarrito.innerHTML = ""
  div.className = "d-flex justify-content-around p-2"
  div.innerHTML = `
                  <div class="d-flex justify-content-center align-items-center">
                  <a class="btn btn-dark" role="button" id="btnComprar">Comprar</a>
                  </div>
                  <div class="d-flex justify-content-center align-items-center fs-4 fw-bold">
                      <p class="m-0">Total: $ ${valor} </p>
                  </div>
                  `
                  
  totalCarrito.append(div)
  const btnComprar = document.querySelector("#btnComprar")
  btnComprar.addEventListener('click',() => {
      limpiarPantallaCarrito()
      limpiarCarrito()
      Swal.fire({
          title: `Está segur@ que desea confirmar la compra ${nombreUsuario}?`,
          icon: `warning`,
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire(
              (`Compra confirmada !`),
              `Los tragos seleccionados se enviaran a la mesa  ${mesaUsuario} y el ticket de compra a ${emailUsuario}`,
              `success`
            )
          }
        })
      })
}

//****************************eliminar productos carrito************************************
function eliminarDelCarrito (id){
    const productoSelecionado = carrito.indexOf(carrito.find( (elemento) => elemento.id === id ))
    carrito[productoSelecionado].cantidad = 1 
    carrito.splice(productoSelecionado,1) 
    localStorage.setItem('carrito',JSON.stringify(carrito))
    contadorCarrito.innerText = `${carrito.length}`
    agregarElmentoCarrito (carrito)
}


function decrementarCantidad (id){
    let productoSelecionado = carrito.indexOf(carrito.find( (elemento) => elemento.id === id ))
    carrito[productoSelecionado].cantidad--
    carrito[productoSelecionado].cantidad <= 1 ? carrito[productoSelecionado].cantidad = 1 : carrito[productoSelecionado].cantidad 
    
    localStorage.setItem('carrito',JSON.stringify(carrito))
    agregarElmentoCarrito (carrito)
}


function incrementarCantidad (id){
    const productoSelecionado = carrito.indexOf(carrito.find( (elemento) => elemento.id === id ))
    carrito[productoSelecionado].cantidad++

    localStorage.setItem('carrito',JSON.stringify(carrito))
    agregarElmentoCarrito (carrito)
}


function setearCantidad(id, valor){
    const productoSelecionado = carrito.indexOf(carrito.find( (elemento) => elemento.id === id ))
    carrito[productoSelecionado].cantidad = valor
    localStorage.setItem('carrito',JSON.stringify(carrito))
    sumarTotal ()
}



//*************************funcion filtrar Trago***********************************
function filtroTragos (){
    const filtroTrago = document.querySelectorAll(".filtro_trago")
    filtroTrago.forEach((e)=>{
        if (e.checked == true){
            fetch("./datos.json")
            .then(res => res.json())
            .then(data => {
                const productosFiltrados = data.filter(elemento => elemento.trago.includes(e.value.toUpperCase())) 
                mostrarElementos(productosFiltrados)
            })
        }
    })
}

//**************************borrar elementos del carrito***************************
function limpiarPantallaCarrito (){
    contenedorCarrito.innerHTML = ""
    contenedorCarrito.innerText = "Agregue su trago favorito"
    totalCarrito.innerText = ""
}

//****************************resetear carrito************************************
function limpiarCarrito(){
    contadorCarrito.innerText = "0"
    carrito.forEach((num)=>{
        num.cantidad = 1 //reseteo cantidad
    })
    carrito = []
    localStorage.setItem('carrito',JSON.stringify(carrito))
}



  // *************PARA ACCEDER DATOS DEL CLIENTE****************************************
  function Cliente(nombre, telefono, mesa) {
    this.nombre = nombre;
    this.telefono = telefono;
    this.mesa = mesa;
    
  }

datosCliente.addEventListener ("submit", (e) => {
  e.preventDefault();
  let nombreUsuario = inputNombre.value;
  let emailUsuario = inputEmail.value;
  let mesaUsuario = inputMesa.value;

  localStorage.setItem("nombre", JSON.stringify(nombreUsuario));
  localStorage.setItem("email", JSON.stringify(emailUsuario));
  localStorage.setItem("mesa", JSON.stringify(mesaUsuario));

  Swal.fire(
    `Perfecto ${nombreUsuario} `,
    `El pedido que realices se enviara a la mesa ${mesaUsuario}`,
    `success`
  )

});

nombreUsuario = JSON.parse(localStorage.getItem("nombre"));
emailUsuario = JSON.parse(localStorage.getItem("email"));
mesaUsuario = JSON.parse(localStorage.getItem("mesa"));

/************ PARA CONFIRMAR COMPRA **************************/

const confirmarCompra = document.querySelector("#confirmarCompra");

confirmarCompra.addEventListener("click", () => {
  Swal.fire({
    title: `Está segur@ que desea confirmar la compra ${nombreUsuario}?`,
    icon: `warning`,
    showCancelButton: true,
    confirmButtonColor: '',
    cancelButtonColor: '',
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        (`Compra confirmada !`),
        `Los productos seleccionados se enviaran  ${direccionUsuario} y el ticket de compra a ${emailUsuario}`,
        `success`
      )
    }
  })
})

//********************* BORRAR DATOS USUARIO**************

const resetForm = document.querySelector("#resetForm");

resetForm.addEventListener("click", () => {
  
  let nombreUsuario = "";
  let emailUsuario = "";
  let mesaUsuario = "";


  localStorage.removeItem("nombre");
  localStorage.removeItem("email");
  localStorage.removeItem("mesa");

  
})


