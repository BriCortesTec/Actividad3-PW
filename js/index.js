//aqui hacemos referncia a las imagenes del carrusel
const aquelarres = [
    { 
        titulo: "Curación", imagen: "img/curación.jpg",
        subtitulo: "Sanan heridas y males con magia. (No se curan maldiciones)",
        detalle: "Quienes se unen aprenden a curar cuerpos y espíritus. Es el aquelarre de quienes prefieren cuidar antes que pelear." 
    },
    { 
        titulo: "Bardos", imagen: "img/bardos.jpg",
        subtitulo: "Su magia nace de la música y el arte.",
        detalle: "Entre canciones, poesía y espectáculo, los bardos convierten la expresión artística en hechizos." 
    },
    { 
        titulo: "Construcción", imagen: "img/construcción.jpg",
        subtitulo: "Levantan estructuras con magia.",
        detalle: "Este aquelarre diseña y erige edificios y mecanismos. Es ideal para mentes ingeniosas que aman crear cosas grandes." 
    },
    { 
        titulo: "Plantas", imagen: "img/plantas.jpg",
        subtitulo: "Cultivan, dirigen la vida vegetal pero tambíen pueden usar ramas como defensa.",
        detalle: "Sus miembros entienden el lenguaje de raíces y hojas, y lo usan para crecer, proteger y transformar." 
    },
    { 
        titulo: "Tenencia de bestias", imagen: "img/tenencia-de-bestias.jpg",
        subtitulo: "Cuidan y entrenan criaturas.",
        detalle: "Aquí se aprende a convivir con las criaturas de las islas, ganándose su confianza en lugar de dominarlas." 
    },
    { 
        titulo: "Abominables", imagen: "img/Abominables.jpg",
        subtitulo: "Dan vida a extrañas creaciones.",
        detalle: "Los abominables experimentan con magia para crear seres únicos. Su trabajo es raro, atrevido y fascinante." 
    },
    { 
        titulo: "Oráculo", imagen: "img/Oráculo.jpg",
        subtitulo: "Miran señales del futuro.",
        detalle: "Interpretan visiones y presagios. Es para quienes disfrutan los misterios y las preguntas sin respuesta fácil." 
    },
    { 
        titulo: "Pociones", imagen: "img/Pociones.jpg",
        subtitulo: "Mezclan brebajes con efectos mágicos.",
        detalle: "Entre calderos y frascos, los pocioneros aprenden a preparar mezclas con propiedades sorprendentes." 
    }
];

const carrusel = new Carrusel ("#aquelarres", { 
    diapositivas: aquelarres
});

//modal de info del aquerrale que este en el carrusel
document.getElementById("info").addEventListener("click", () =>{
    const a = carrusel.diapositivaActual();
    Modal.abrir({
        titulo: "Aquelarre de " +a.titulo,
        contenido: a.detalle,
        botones: [
            { texto: "Cerrar"},
            { texto: "Unirme a este aquelarre", principal: true, alHacerClic: unirse}
        ]
    });
});

//toast de confirmación y luego toast sin temporizador
function unirse() {
    const a = carrusel.diapositivaActual();
    Modal.abrir({
        titulo: "¡Bienvenida al aquelarre de " + a.titulo + "!",
        contenido: "Tu solicitud fue aceptada. Desde hoy formas parte de este aquelarre.",
        botones: [{
            texto: "Aceptar", principal: true,
            alHacerClic: () => Toast.mostrar({
                titulo: "Aquelarre de " + a.titulo,
                mensaje: "Ya eres miembro.",
                tipo: "exito", posicion: "abajo-derecha", duracion: 5000
            })
        }]
    });
}   
