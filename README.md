# Mision 1
La práctica se trata del juego de apuestas mines diseñado a mi manera y con las probabilidades
reales evitando que el casino se lleve ningun porcentaje de ganacias

## Como probarlo
El primer paso se trata de abrir el archivo prac1.html como web en el navegador.
A partir de ahi con el dinero que tienes de sueldo que se puede ver en la parte superior izquierda
vas a poder apostar y empezar a jugar, pero antes de poder apostar tienes que completar todos los apartados necesarios
para que el programa te permita jugar ya sea de poner un tamaño de tablero, una cantidad de minas o una apuesta, donde ademas el programa está hecho para que solo te permitas poner valores validos, como puede ser una cantidad de minas correspondientes a filas*columnas-1 o que la apuesta no sea mayor que el sueldo que tienes.

Apartir de cuando hayas completado todos los areas para poder realizar la apuesta se te permite pulsar el boton de apuesta y se te permite pinchar en los cuadrados del tablero y empezar a jugar. Segun vayas pinchando casillas se iran destapando en el caso de que estas se han bombas perderas el juego y tendras que apostar otra vez, pero si tienes suerte y es un diamante, podras seguir destapando casillas hasta que decidas pinchar en el boton que ahora pone obtener y el dinero de la apuesta que has realizado se te multiplicara por el multiplicador correspondiente a la cantidad de diamantes que has levantado y se te sumara a tu sueldo.

Por último en caso de querer poner el modo oscuro este se activa con la tecla i

## Uso de IA
Para esta practica se ha utilizado la IA (chatGPT) tanto para recordar conocimiento pasados como para distintos momentos en el transcurso de la practica

Prompts:

1. Como se puede hacer que un tablero sea dinamico dando asi que cambie su cantidad de cuadriculas pero no su tamaño en html, css y javascript

Este prompt me dio la capacidad de poder hacer que mi programa pasase de tener una variable para crear cada tabla y crearlas todas como tablas distintas a crear una unica tabla que permite variar sus medida teniendo en cuenta:
CSS
grid-template-columns: repeat(var(--tamano), 1fr);
grid-template-rows: repeat(var(--tamano), 1fr);
JavaScript
tablero.style.setProperty("--tamano", tamano);


2. Como se puede puede crear un recta interactiva, en la cual tengas un punto y este se pueda ir moviendo y cambie sus valores


3. Como se puede hacer un cuadrado en el cual se le puedan escribir valores
Me dio la capacidad de recordar codigo, debido a que se trata de una utilidad anteriormente utilizada en web 1 pero de la cual no me acordaba de como se componia


4. Como puedo bloquer la pulsacion de botones o la escritura en los cuadrados de escritura
Me dio la solucion para no permitir que en mitad de una partida esta se pudiese reiniciar cambiando valores de los parametros necesarios para apostar

    // Bloqueamos los controles
    numMinas.disabled = true;
    cantApuesta.disabled = true;
    puntoContTam.style.pointerEvents = "none";
    lineaContTam.style.pointerEvents = "none";

    // Volvemos a habilitar los controles
    numMinas.disabled = false;
    cantApuesta.disabled = false;
    puntoContTam.style.pointerEvents = "auto";
    lineaContTam.style.pointerEvents = "auto";


## Autopsia

Aunque se trate de un proyecto basado en un juego los problemas y las dudas siguen surguiendo igual:

1. Una decision que hubo que tomar era la forma en que se montaba el programa, debido a que este es un programa en el que todo tiene conexiones entre si y aunque pueda quedar más limpio al hacer todo de una, es un sin sentido debido a que la capacidad de equivocacion y la complicacion al arreglar las cosas al tener tanto codigo añadido a la vez. Por lo cual tome la decision de ir construyen el programa poco a poco, construyendo cosas y luego enlazandolas entre si, a si sucesivamente

2. Durante gran parte de la construccion del programa estuvo el problema de que los botones o los inputs no se bloqueban al iniciar el juego dando la oportunidad así de modificar valores de la apuesta en mitad del juego. Por lo cual tome la decision de bloquer la modificacion de caracteristicas en mitad del juego