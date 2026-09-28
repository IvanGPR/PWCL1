const tamano = 3;

const tablero = document.getElementById("tablero");

// Indicamos el tamaño al CSS
tablero.style.setProperty("--tamano", tamano);

// Creamos las casillas
for (let i = 0; i < tamano * tamano; i++) {

    const casilla = document.createElement("cas");

    casilla.classList.add("casilla");

    tablero.appendChild(casilla);
}
