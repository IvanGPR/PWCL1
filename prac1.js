
let tamano = 3;
let partidaActiva = false;

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

const cantidadSueldo = document.getElementById("cantidadSueldo");
const cantidadObtener = document.getElementById("cantidadObtener");
const textoBoton = document.getElementById("textoBoton");

let sueldo = 1000;
let apuestaActual = 0;


// CREAR TABLERO
function crearTablero() {

    tablero.innerHTML = "";

    // Indicamos el tamaño al CSS
    tablero.style.setProperty("--tamano", tamano);

    const cantidadMinas = Number(numMinas.value);
    const posiciones = [];

    for (let i = 0; i < tamano * tamano; i++) {
        posiciones.push(i);
    }

    posiciones.sort(() => Math.random() - 0.5);
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

        contenido.appendChild(frente);
        contenido.appendChild(reverso);

        casilla.appendChild(contenido);
        tablero.appendChild(casilla);

        casilla.addEventListener("click", clickCasilla);
    }
}



// CLICK EN UNA CASILLA
function clickCasilla(event) {

    const casilla = event.currentTarget;


    if (!partidaActiva) {
        return;
    }

    if (casilla.classList.contains("volteada")) {
        return;
    }

    const reverso = casilla.querySelector(".reverso");
    const esMina = reverso.classList.contains("reversoMina");

    casilla.classList.add("volteada");

    // NO es una mina
    if (!esMina) {

        casillasSegurasDestapadas++;

        actualizarMultiplicadores();
        actualizarCantidadObtener();

    }
     // Si es una mina
    else {
        partidaActiva = false;
        setTimeout(() => {
            reiniciarPartida();
            alert("Te exploto una mina");
        }, 1000);

    }
}

// ACTUALIZAR SELECTOR DE TAMAÑO

function actualizarSelectorTam() {

    valorTam.textContent = `${tamano}x${tamano}`;
    const porcentaje = (tamano - 3) / (9 - 3);
    puntoContTam.style.left = `${porcentaje * 100}%`;
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



// EVENTOS DEL SELECTOR DE TAMAÑO
// Comenzar a arrastrar el punto
function manejarPointerDownPunto(event) {

    moviendo = true;

    puntoContTam.setPointerCapture(event.pointerId);

    event.preventDefault();
}


// Mover el punto
function manejarPointerMovePunto(event) {

    if (!moviendo) {
        return;
    }

    cambiarTam(event);
}


// Soltar el punto
function manejarPointerUpPunto() {

    moviendo = false;
}


// Cancelar el movimiento
function manejarPointerCancelPunto() {

    moviendo = false;
}


// Hacer clic directamente sobre la línea
function manejarPointerDownLinea(event) {

    // Si se ha pulsado sobre el punto, no hacemos nada
    if (event.target === puntoContTam) {
        return;
    }

    cambiarTam(event);
}



// ACTUALIZAR NÚMERO MÁXIMO DE MINAS
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



// CAMBIO DEL NÚMERO DE MINAS
function manejarCambioMinas() {

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
}



// BOTON APOSTAR / OBTENER
function manejarClickApuesta() {

    // APOSTAR

    if (!partidaActiva) {

        // No se ha introducido ningún dato
        if (numMinas.value === "" && cantApuesta.value === "") {

            alert(
                "Debes introducir el número de minas y una cantidad para la apuesta"
            );

            return;
        }

        // No se ha introducido el número de minas
        if (numMinas.value === "") {

            alert("Debes introducir el número de minas");

            return;
        }

        // No se ha introducido la cantidad de apuesta
        if (cantApuesta.value === "") {

            alert("Debes introducir una cantidad para la apuesta");

            return;
        }

        const cantidad = Number(cantApuesta.value);

        // Comprobamos que haya suficiente sueldo
        if (cantidad > sueldo) {

            alert(
                "No tienes suficiente sueldo para realizar esta apuesta"
            );

            return;
        }


        apuestaActual = cantidad;
        sueldo = sueldo - apuestaActual;

        actualizarSueldo();

        // Comenzamos la partida
        partidaActiva = true;

        // Bloqueamos los controles
        numMinas.disabled = true;
        cantApuesta.disabled = true;

        puntoContTam.style.pointerEvents = "none";
        lineaContTam.style.pointerEvents = "none";

        textoBoton.textContent = "OBTENER";

        actualizarCantidadObtener();

        return;
    }


    // APARTADO OBTENER

    const multiplicador = obtenerMultiplicadorActual();
    const cantidadObtenerValor = apuestaActual * multiplicador;
    sueldo = sueldo + cantidadObtenerValor;

    actualizarSueldo();
    reiniciarPartida();
}


// CAMBIO DE LA APUESTA

function manejarCambioApuesta() {

    const maxApuesta = sueldo;

    let apuesta = Number(cantApuesta.value);

    if (apuesta > maxApuesta) {
        cantApuesta.value = maxApuesta;
    }
}


// CALCULAR MULTIPLICADORES

function calcularMultiplicadores() {

    listaMultiplicadores = [];

    const totalCasillas = tamano * tamano;
    const minas = Number(numMinas.value);
    const casillasSeguras = totalCasillas - minas;

    let probabilidadAcumulada = 1;

    for (let i = 0; i < casillasSeguras; i++) {

        const casillasRestantes = totalCasillas - i;
        const segurasRestantes = casillasSeguras - i;
        const probabilidad = segurasRestantes / casillasRestantes;

        probabilidadAcumulada = probabilidadAcumulada * probabilidad;

        const multiplicador = 1 / probabilidadAcumulada;

        listaMultiplicadores.push(multiplicador);
    }
}


// ACTUALIZAR MULTIPLICADORES

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



// OBTENER MULTIPLICADOR ACTUAL

function obtenerMultiplicadorActual() {

    if (casillasSegurasDestapadas === 0) {
        return 1;
    }

    return listaMultiplicadores[casillasSegurasDestapadas - 1];
}


// ACTUALIZAR CANTIDAD A OBTENER

function actualizarCantidadObtener() {

    if (!partidaActiva) {
        cantidadObtener.textContent = "";
        return;
    }

    const multiplicador =obtenerMultiplicadorActual();
    const cantidad =apuestaActual * multiplicador;
    cantidadObtener.textContent =`${cantidad.toFixed(2)} €`;
}



// ACTUALIZAR SUELDO

function actualizarSueldo() {

    cantidadSueldo.textContent =`${sueldo.toFixed(2)} €`;
}



// REINICIAR PARTIDA

function reiniciarPartida() {

    partidaActiva = false;
    casillasSegurasDestapadas = 0;
    apuestaActual = 0;

    cantidadObtener.textContent = "";

    // Volvemos a habilitar los controles
    numMinas.disabled = false;
    cantApuesta.disabled = false;

    puntoContTam.style.pointerEvents = "auto";
    lineaContTam.style.pointerEvents = "auto";

    textoBoton.textContent = "APOSTAR";


    crearTablero();
    calcularMultiplicadores();
    actualizarMultiplicadores();
}

// MODO OSCURO
function manejarTecladoModoOscuro(event) {

    // Comprobamos si el usuario está escribiendo para evitar errores
    const elementoActivo = document.activeElement;
    const esInput = elementoActivo.tagName === "INPUT" || elementoActivo.tagName === "TEXTAREA" || elementoActivo.isContentEditable;

    if (esInput) {
        return;
    }

    if (event.key === "i" || event.key === "I") {
        document.body.classList.toggle("dark-mode");
    }
}

// REGISTRO DE TODOS LOS EVENTOS

// Selector de tamaño
puntoContTam.addEventListener("pointerdown",manejarPointerDownPunto);

puntoContTam.addEventListener("pointermove",manejarPointerMovePunto);

puntoContTam.addEventListener("pointerup",manejarPointerUpPunto);

puntoContTam.addEventListener("pointercancel",manejarPointerCancelPunto);

lineaContTam.addEventListener("pointerdown",manejarPointerDownLinea);


// Número de minas
numMinas.addEventListener("input", manejarCambioMinas);

// Botón apostar / obtener
apostar.addEventListener("click",manejarClickApuesta);


// Cantidad de apuesta
cantApuesta.addEventListener("input",manejarCambioApuesta);

//Modo Oscuro
document.addEventListener("keydown", manejarTecladoModoOscuro);

// INICIALIZACIÓN
crearTablero();
actualizarSelectorTam();
calcularMultiplicadores();
actualizarMultiplicadores();
