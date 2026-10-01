
let tamano = 3;

const tablero = document.getElementById("tablero");

const lineaContTam = document.getElementById("lineaContTam");
const puntoContTam = document.getElementById("puntoContTam");
const valorTam = document.getElementById("valorTam");

let moviendo = false;

const numMinas = document.getElementById("numMinas");
const apostar = document.querySelector("#apostar");
const cantApuesta = document.getElementById("cantApuesta");

const multiplicadores = document.getElementById("multiplicadores");
let casillasSegurasDestapadas = 0;
let listaMultiplicadores = [];

// CREADOR TABLERO
function crearTablero() {

    // Borramos las casillas anteriores
    tablero.innerHTML = "";

    // Indicamos el tamaño al CSS
    tablero.style.setProperty("--tamano", tamano);

    // Número de minas seleccionadas
    const cantidadMinas = Number(numMinas.value);

    // Creamos una lista con todas las posiciones posibles
    const posiciones = [];

    for (let i = 0; i < tamano * tamano; i++) {
        posiciones.push(i);
    }

    // Mezclamos aleatoriamente las posiciones
    posiciones.sort(() => Math.random() - 0.5);

    // Las primeras posiciones serán minas
    const posicionesMinas = posiciones.slice(0, cantidadMinas);

    // Creamos las casillas
    for (let i = 0; i < tamano * tamano; i++) {

        const casilla = document.createElement("div");
        casilla.classList.add("casilla");

        // Contenido que realizará el giro
        const contenido = document.createElement("div");
        contenido.classList.add("contenidoCasilla");

        // Cara delantera
        const frente = document.createElement("div");
        frente.classList.add("frente");

        // Cara trasera
        const reverso = document.createElement("div");
        reverso.classList.add("reverso");

        // Comprobamos si esta casilla es una mina
        if (posicionesMinas.includes(i)) {
            reverso.classList.add("reversoMina");
        }

        // Montar las dos caras
        contenido.appendChild(frente);
        contenido.appendChild(reverso);

        casilla.appendChild(contenido);
        tablero.appendChild(casilla);

        // GIRAR CASILLA
        casilla.addEventListener("click", function() {

            // No se pueden pulsar casillas antes de apostar
            if (apostar.textContent === "APOSTAR") {
                return;
            }

            // Una casilla solo puede pulsarse una vez
            if (casilla.classList.contains("volteada")) {
                return;
            }

            // Comprobamos si esta casilla es una mina
            const esMina = reverso.classList.contains("reversoMina");

            // Volteamos la casilla
            casilla.classList.add("volteada");

            // Si NO es una mina
            if (!esMina) {

                casillasSegurasDestapadas++;
                // Actualizamos los multiplicadores
                actualizarMultiplicadores();
            }

            // Si es una mina
            else {
                // De momento solamente mostramos un mensaje
                alert("¡Has encontrado una mina!");
            }
        });
    }
}


// ACTUALIZAR SELECTOR

function actualizarSelectorTam() {

    valorTam.textContent = `${tamano}x${tamano}`;

    // Posición del punto
    const porcentaje = (tamano - 3) / (9 - 3);
    puntoContTam.style.left = `${porcentaje * 100}%`;

    // Actualizar cantidad máxima de minas
    actualizarMaxMinas();
}



// CAMBIAR TAMAÑO SEGÚN POSICIÓN DEL RATÓN

function cambiarTam(event) {

    const rect = lineaContTam.getBoundingClientRect();

    let x = event.clientX - rect.left;

    // Evitar que el punto salga de la línea
    x = Math.max(0, Math.min(x, rect.width));

    // Convertimos la posición en un valor entre 3 y 9
    const porcentaje = x / rect.width;

    tamano = 3 + Math.round(porcentaje * 6);

    casillasSegurasDestapadas = 0;

    crearTablero(); 
    actualizarSelectorTam(); 
    calcularMultiplicadores();
    actualizarMultiplicadores();
}



// ARRASTRAR PUNTO

puntoContTam.addEventListener("pointerdown", function(event) {
    moviendo = true;
    puntoContTam.setPointerCapture(event.pointerId);
    event.preventDefault();
});


puntoContTam.addEventListener("pointermove", function(event) {
    if (!moviendo) {
        return;
    }
    cambiarTam(event);
});


puntoContTam.addEventListener("pointerup", function() {
    moviendo = false;
});


puntoContTam.addEventListener("pointercancel", function() {
    moviendo = false;
});


// HACER CLIC DIRECTAMENTE EN LA LÍNEA
lineaContTam.addEventListener("pointerdown", function(event) {

    if (event.target === puntoContTam) {
        return;
    }
    cambiarTam(event);
});


// ACTUALIZADOR NUMERO DE MINAS
function actualizarMaxMinas() {

    const numeroCasillas = tamano * tamano;
    const maxMinas = numeroCasillas - 1;

    numMinas.max = maxMinas;

    // Si el valor actual supera el máximo,
    // lo reducimos automáticamente
    if (Number(numMinas.value) > maxMinas) {
        numMinas.value = maxMinas;
    }
}

numMinas.addEventListener("input", function() {
    const maxMinas = tamano * tamano - 1;
    let minas = Number(numMinas.value);

    if (minas < 1) {
        numMinas.value = 1;
    }

    if (minas > maxMinas) {
        numMinas.value = maxMinas;
    }
    casillasSegurasDestapadas = 0;

    crearTablero();
    calcularMultiplicadores();
    actualizarMultiplicadores();
});

apostar.addEventListener("click", function() {

    if (numMinas.value === "" && cantApuesta.value === ""){
        alert("Debes introducir el número de minas y  una cantidad para la apuesta");
        return;
    }
    // Comprobamos si se ha introducido el número de minas
    if (numMinas.value === "") {
        alert("Debes introducir el número de minas");
        return;
    }

    // Comprobamos si se ha introducido la cantidad de apuesta
    if (cantApuesta.value === "") {
        alert("Debes introducir una cantidad para la apuesta");
        return;
    }

    // Si todo está rellenado, cambiamos el botón
    apostar.textContent = "OBTENER";

});

cantApuesta.addEventListener("input", function(){
    const maxApuesta=1000;
    let apuesta = Number(cantApuesta.value)
    
    if(apuesta>maxApuesta){
        cantApuesta.value = maxApuesta;
    }

});

function calcularMultiplicadores() {

    listaMultiplicadores = [];

    const totalCasillas = tamano * tamano;
    const minas = Number(numMinas.value);
    const casillasSeguras = totalCasillas - minas;

    let probabilidadAcumulada = 1;

    for (let i = 0; i < casillasSeguras; i++) {

        const casillasRestantes = totalCasillas - i;
        const segurasRestantes = casillasSeguras - i;

        const probabilidad =segurasRestantes / casillasRestantes;

        probabilidadAcumulada =probabilidadAcumulada * probabilidad;

        const multiplicador = 1 / probabilidadAcumulada;

        listaMultiplicadores.push(multiplicador);
    }
}


function actualizarMultiplicadores() {

    multiplicadores.innerHTML = "";

    const inicio = casillasSegurasDestapadas;

    const fin = Math.min(inicio + 6,listaMultiplicadores.length);

    for (let i = inicio; i < fin; i++) {
        const elemento = document.createElement("div");
        elemento.classList.add("multiplicador");
        elemento.textContent =`x${listaMultiplicadores[i].toFixed(2)}`;
        multiplicadores.appendChild(elemento);
    }
}

// INICIALIZAR 
crearTablero(); 
actualizarSelectorTam();
calcularMultiplicadores();
actualizarMultiplicadores();