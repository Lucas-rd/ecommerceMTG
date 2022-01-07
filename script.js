//Creo una web app para que utilicen los empleados de mi tienda de cartas Magic (Es un juego de cartas coleccionables e intercambiables)

//Primero defino mi clase Producto que sera mi molde para todas las cartas que tendre en el stock de mi tienda
class Carta{
    constructor(nombre, edicion, stock, precio, img){
        this.nombre = nombre;
        this.edicion = edicion;
        this.stock = stock;
        this.precio = precio;
        this.img = img;
    }
    
    aumentarStock(cantidad){
        this.stock += cantidad;
    }
    disminuirStock(cantidad){
        this.stock -= cantidad;
    }
    precioConIva(){
        let precioFnial = this.precio * (1+(21/100));
        return precioFnial
    }
};


let stockTienda = [];

//capturamos elementos del DOM en variables:
let formularioCarta = document.getElementById("formularioCarta")
let divCartas = document.getElementById("divCartas");
let botonMostrarStock = document.getElementById("mostrarStock");

//Evento para guardar la info del formulario en el array Y en el localStorage
formularioCarta.addEventListener('submit',(e) =>{
    e.preventDefault();

    let nombreCarta = document.getElementById("nombre").value;
    // let edicionCarta = document.getElementById("edicion").value;
    // let stockCarta = document.getElementById("stock").value;
    // let precioCarta = document.getElementById("stock").value;

    //fetcheo la api de Scryfall
    fetch(`https://api.scryfall.com/cards/named?fuzzy=${nombreCarta}`)
    .then(response => response.json())
    .then(data =>{
        imgCarta = `${data.image_uris.normal}`
        
        let nombreCarta = document.getElementById("nombre").value;
        let edicionCarta = document.getElementById("edicion").value;
        let stockCarta = document.getElementById("stock").value;
        let precioCarta = document.getElementById("stock").value;
        
        let cartaACargar = new Carta(nombreCarta, edicionCarta, stockCarta, precioCarta,imgCarta);
        stockTienda.push(cartaACargar);
    
    
        //Guardo el array en el localStorage en formato JSON:
        localStorage.setItem("cartas", JSON.stringify(stockTienda));
    
        //Por ultimo, limpio el formulario para no tener que recargar la pagina:
        formularioCarta.reset();
    
        Toastify({
            text: "Carta añadida al stock!",
            className: "info",
            style: {
              background: "green",
            }
          }).showToast();
    })
});


//Ahora muestro la informacion del LStorage mediante el boton de mostrar stock
botonMostrarStock.addEventListener('click',() =>{
    let cartasEnLocalStorage = JSON.parse(localStorage.getItem("cartas"));

    //En caso que el length de divCarta no sea 0, lo borro y vuelvo a pintar en el DOM todas las cartas del stock. Esto sera util cuando agregue una nueva al stock.
    divCartas.innerHTML = ""
    cartasEnLocalStorage.forEach((cartaEnArray, indice) => {
        divCartas.innerHTML += `
        <div class="card" id="carta${indice}" style="width: 18rem;">
            <img src="${cartaEnArray.img}" class="card-img-top" alt="">
                <div class="card-body">
                    <h5 class="card-title">${cartaEnArray.nombre}</h5>
                    <p class="card-text">${cartaEnArray.edicion}</p>
                    <p class="card-text">${cartaEnArray.stock} unidades</p>
                    <p class="card-text">USD ${cartaEnArray.precio}</p>
                    <button id="aumentar${indice}" class="btn btn-success">Aumentar Stock</buttton>
                    <button id="disminuir${indice}" class="btn btn-warning">Disminuir Stock</buttton>
                    <button id="boton${indice}" class="btn btn-danger">Eliminar</buttton>
                    </div>
                    </div>
            `
    })
    cartasEnLocalStorage.forEach((cartaEnArray,indice) =>{
        document.getElementById(`boton${indice}`).addEventListener('click', () =>{
            document.getElementById(`carta${indice}`).remove()
            stockTienda.splice(indice, 1)
                    //Vuelvo a "setear" en el localstorage el nuevo array stock sin el elemento que elimine
            localStorage.setItem("cartas", JSON.stringify(stockTienda))
            Toastify({
                text: "Carta eliminada del stock!",
                className: "info",
                style: {
                    background: "red",
                }
            }).showToast();         
        })
    })

});


//Selectores y eventos con Jquery usando modales. Insertados desde codigo.
$(() =>{
    $('#botonModal').click(() =>{
        $('#ventanaModal').html("")
        $('#ventanaModal').append(`
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Envianos tu consulta!</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="botonCerrarModal"></button>
                </div>
            <div class="modal-body">
                <form>
                    <div class="mb-3">
                        <label for="recipient-name" class="col-form-label">Mail de contacto:</label>
                        <input type="text" class="form-control" id="recipient-name">
                    </div>
                    <div class="mb-3">
                        <label for="message-text" class="col-form-label">Indicanos que carta y de que edicion estas buscando:</label>
                        <textarea class="form-control" id="message-text"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary">Send message</button>
            </div>
            </div>
        </div>
        `)
        $('#ventanaModal').show()

        $('#botonCerrarModal').click(() =>{
            $('#ventanaModal').hide()
        })
    })

    //Concatenacion de animaciones para mostrar un parrafo con informacion y luego esconderlo nuevamente.
    $('#botonAnimacion').click(() =>{
        $('#quienesSomos').slideDown(1000, function(){
            $(this).css({
                "padding-top": "5px",
                "padding-left": "5px",
                "margin-left": "auto",
                "margin-right": "auto",
                "color": "olive",
                "border": "2px solid",
                "border-radius": "15px 0px 15px 0px"
            })
            $(this).slideUp(1000)
        }).delay(8000);
    })

})


