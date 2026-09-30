
let tamano = 3;

const tablero = document.getElementById("tablero");

const lineaContTam = document.getElementById("lineaContTam");
const puntoContTam = document.getElementById("puntoContTam");
const valorTam = document.getElementById("valorTam");

let moviendo = false;


// CREADOR TABLERO
function crearTablero() {

    // Borramos las casillas anteriores
    tablero.innerHTML = "";

    // Indicamos el tamaño al CSS
    tablero.style.setProperty("--tamano", tamano);

    // Creamos las casillas
    for (let i = 0; i < tamano * tamano; i++) {

        const casilla = document.createElement("div");
        casilla.classList.add("casilla");
        tablero.appendChild(casilla);
    }
}


// ACTUALIZAR SELECTOR

function actualizarSelectorTam() {

    valorTam.textContent = `${tamano}x${tamano}`;

    // Posición del punto
    const porcentaje = (tamano - 3) / (9 - 3);
    puntoContTam.style.left = `${porcentaje * 100}%`;
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

    crearTablero();
    actualizarSelectorTam();
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


// INICIALIZAR
crearTablero();
actualizarSelectorTam();