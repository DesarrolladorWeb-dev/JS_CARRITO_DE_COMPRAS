//variables
const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
const listaCursos = document.querySelector("#lista-cursos");
let articulosCarrito = [];

cargarEventListeners();

function cargarEventListeners() {
// Cuando agregas un curso presionando "Agregar al Carrito"
  listaCursos.addEventListener("click", agregarCurso);
// Elimina curso del carrito
  carrito.addEventListener('click', eliminarCurso);
// Vaciar el carrito - recomendacion: cuando es poca linea de codigo hacer esto
  vaciarCarritoBtn.addEventListener('click', () => {
    articulosCarrito = []; //reseteamos el arreglo
    limpiarHTML();//Eliminamos todo el HTML
  })
  // muestra los cursos del localstorage
  document.addEventListener("DOMContentLoaded", () => {
    articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [] ;
    carritoHTML();
  })
}

// Funciones
function agregarCurso(e) {
  // se utiliza por ejemplo href = # del enlace
  // prevenimos la accion por default
  e.preventDefault();
  if (e.target.classList.contains("agregar-carrito")) {
    const cursoSeleccionado = e.target.parentElement.parentElement;
    console.log("agregando al carrito");
    // asi se retrocede
    leerDatosCurso(cursoSeleccionado);
  }
  // se recomienda funciones cortas
}
// Eliminar un curso del carrito
function eliminarCurso(e){
  // si la clase es borrar-curso
  if (e.target.classList.contains('borrar-curso')) {
    const cursoId = e.target.getAttribute('data-id');
    // Elimina del arreglo de articulosCarrito por el data-id
    articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);
  }
  carritoHTML(); // Iterar sobre el carrito y mostrar su HTML
}



// lee contenido html al que le dimos click y extrae la informacion de del curso
function leerDatosCurso(curso) {
  console.log(curso);

  // crear un objeto con el contenido del curso actual
  const infoCurso = {
    imagen: curso.querySelector("img").src, //enlace
    titulo: curso.querySelector("h4").textContent, // texto
    precio: curso.querySelector(".precio span").textContent,
    id: curso.querySelector("a").getAttribute("data-id"), //obtener atributo
    cantidad: 1,
  };
  // Revisa si un elemento ya existe en el carrito
  const existe = articulosCarrito.some((curso) => curso.id === infoCurso.id);
  // existe solo tendra un true o false
  if (existe) {
    // Actualizamos la cantidad
    const cursos = articulosCarrito.map((curso) => {
      if (curso.id === infoCurso.id) {
        curso.cantidad++;
        return curso; // retorna objetos actualizados
      } else {
        return curso; // retorna los objetos que no son los duplicados
      }
    });
    articulosCarrito = [...cursos];
  } else {
    // agrega elementos a arreglo de carrito, es como el i de for
    articulosCarrito = [...articulosCarrito, infoCurso];
  }

  console.log(articulosCarrito);
  carritoHTML();
}

//Muestra el carrito de compras en el html

function carritoHTML() {
  // creara el html basado en el carrito de compras
  //* Limpiar el HTML
  limpiarHTML();
  //Recorre el carrito y genera el HTML
  articulosCarrito.forEach((curso) => {
    // Ahora aplicaremos DESTRUXION para que ya nos sea cursos.imagen, curso.precio
    const { imagen, titulo, precio, cantidad, id } = curso;
    console.log(curso);
    const row = document.createElement("tr"); // creas una etiqueta tr
    //Ingresas esto dentro del tr
    row.innerHTML = `
                <td><img src="${imagen}" width="100" alt=""></td>
                <td>${titulo}</td>
                <td>${precio}</td>
                <td>${cantidad}</td>
                <td>
                      <a href="#" class="borrar-curso" data-id="${id}"> X </a>
                </td> 
                

            `;
    //Agregar el HTML del carrito en el tbody, agregamos cada row por cada iteracion
    contenedorCarrito.appendChild(row);

    //* AHORA FALTA ELIMNAR LOS CURSOS PREVIOS AL MOMENTO DE AGREGAR AL CARRITO
  });
  // Agregar el carrito de compras al storage
  sincronizarStorage();
}

function sincronizarStorage(){
  localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

// Elimina los cursos del tbody
function limpiarHTML() {
  // forma lenta
  // contenedorCarrito.innerHTML = '';

  //si tiene un almenos un elemento dentro
  //este codigo se sigue ejecutando
  //una ves el limpiado ya no se ejecuta
  while (contenedorCarrito.firstChild) {
    contenedorCarrito.removeChild(contenedorCarrito.firstChild);
  }
}
