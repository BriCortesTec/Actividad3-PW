const Toast = (function () {
    const ICONOS = { exito: "✔", error: "✖", aviso: "!", info: "i" };
    const POSICIONES = ["arriba-derecha", "arriba-izquierda", "abajo-derecha", "abajo-izquierda"];
    const contenedores = {}; // un contenedor por posición, creado la primera vez que se usa

    function obtenerContenedor(posicion) {
        if (!contenedores[posicion]) {
            const c = document.createElement("div");
            c.className = "toast-contenedor toast-" + posicion;
            document.body.appendChild(c);
            contenedores[posicion] = c;
        }
        return contenedores[posicion];
    }

    function cerrar(el) {
        if (el.dataset.cerrando) return;
            el.dataset.cerrando = "1";
            el.classList.add("toast-saliendo");
            setTimeout(() => el.remove(), 250); // espera a que termine la animación de salida
    }

    function mostrar(opciones) {
        const o = Object.assign(
            { titulo: "", mensaje: "", tipo: "info", duracion: 4000, posicion: "arriba-derecha" },
            opciones
        );
        if (!ICONOS[o.tipo]) o.tipo = "info";
        if (!POSICIONES.includes(o.posicion)) o.posicion = "arriba-derecha";

        const el = document.createElement("div");
        el.className = "toast toast-" + o.tipo;
        el.setAttribute("role", o.tipo === "error" ? "alert" : "status");

        const icono = document.createElement("span");
        icono.className = "toast-icono";
        icono.textContent = ICONOS[o.tipo];

        const cuerpo = document.createElement("div");
        cuerpo.className = "toast-cuerpo";
        if (o.titulo) {
            const t = document.createElement("strong");
            t.className = "toast-titulo";
            t.textContent = o.titulo; // textContent evita inyectar HTML
            cuerpo.appendChild(t);
        }

        const m = document.createElement("p");
        m.className = "toast-mensaje";
        m.textContent = o.mensaje;
        cuerpo.appendChild(m);

        const btn = document.createElement("button");
        btn.className = "toast-cerrar";
        btn.type = "button";
        btn.setAttribute("aria-label", "Cerrar aviso");
        btn.textContent = "×";
        btn.addEventListener("click", () => cerrar(el));

        el.append(icono, cuerpo, btn);

        // Barra de tiempo: al terminar su animación CSS se cierra el aviso.
        // Al pasar el mouse encima, el CSS pausa la animación (y con ella el cierre).
        if (o.duracion > 0) {
            const barra = document.createElement("div");
            barra.className = "toast-barra";
            barra.style.animationDuration = o.duracion + "ms";
            barra.addEventListener("animationend", () => cerrar(el));
            el.appendChild(barra);
        }

        obtenerContenedor(o.posicion).appendChild(el);
        return el;
    }

    // Atajos: Toast.exito("Guardado"), Toast.error("Falló", { posicion: "abajo-derecha" })
    const atajo = tipo => (mensaje, extra) => mostrar(Object.assign({}, extra, { mensaje, tipo }));

    return {
        mostrar,
        exito: atajo("exito"),
        error: atajo("error"),
        aviso: atajo("aviso"),
        info: atajo("info"),
        limpiar() { document.querySelectorAll(".toast").forEach(cerrar); }
    };
})();

const Modal = (function () {
    let abierto = null;

    function cerrar() {
        if (!abierto) return;
        const fondo = abierto;
        abierto = null;
        document.removeEventListener("keydown", teclas);
        fondo.classList.add("modal-saliendo");
        setTimeout(() => fondo.remove(), 200);
    }

    function teclas(e) { if (e.key === "Escape") cerrar(); }

    function abrir(opciones) {
        const o = Object.assign({ icono: "", titulo: "", contenido: "", botones: [] }, opciones);
        cerrar();

        const fondo = document.createElement("div");
        fondo.className = "modal-fondo";
        fondo.addEventListener("click", e => { if (e.target === fondo) cerrar(); });

        const caja = document.createElement("div");
        caja.className = "modal-caja";
        caja.setAttribute("role", "dialog");
        caja.setAttribute("aria-modal", "true");

        const x = document.createElement("button");
        x.className = "modal-x"; x.type = "button"; x.textContent = "×";
        x.setAttribute("aria-label", "Cerrar ventana");
        x.addEventListener("click", cerrar);
        caja.appendChild(x);

        if (o.icono) {
            const i = document.createElement("div");
            i.className = "modal-icono"; i.textContent = o.icono;
            caja.appendChild(i);
        }

        const h = document.createElement("h2");
        h.className = "modal-titulo"; h.textContent = o.titulo;
        caja.appendChild(h);

        const cuerpo = document.createElement("div");
        cuerpo.className = "modal-contenido";
        if (o.contenido instanceof Node) cuerpo.appendChild(o.contenido);
        else { const p = document.createElement("p"); p.textContent = o.contenido; cuerpo.appendChild(p); }
        caja.appendChild(cuerpo);

        const pie = document.createElement("div");
        pie.className = "modal-pie";
        const botones = o.botones.length ? o.botones : [{ texto: "Cerrar", principal: true }];

        botones.forEach(b => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "modal-boton" + (b.principal ? " modal-boton-principal" : "");
            btn.textContent = b.texto;
            btn.addEventListener("click", () => { cerrar(); if (b.alHacerClic) b.alHacerClic(); });
            pie.appendChild(btn);
        });

        caja.appendChild(pie);

        fondo.appendChild(caja);
        document.body.appendChild(fondo);
        abierto = fondo;
        document.addEventListener("keydown", teclas);
        pie.lastElementChild.focus();
        return fondo;
    }

    return { abrir, cerrar };
})();

class Carrusel {
    constructor(contenedor, opciones) {
        const o = Object.assign({ diapositivas: [], alCambiar: null }, opciones);
        this.raiz = typeof contenedor === "string" ? document.querySelector(contenedor) : contenedor;
        this.diapositivas = o.diapositivas;
        this.alCambiar = o.alCambiar;
        this.indice = 0;

        this.raiz.classList.add("carrusel");
        this.raiz.setAttribute("tabindex", "0");
        this.raiz.setAttribute("aria-roledescription", "carrusel");

        this.pista = document.createElement("div");
        this.pista.className = "carrusel-pista";
        this.slides = this.diapositivas.map(d => {
            const s = document.createElement("div");

            s.className = "carrusel-slide";
            s.style.setProperty("--c1", d.color1 || "#345");
            s.style.setProperty("--c2", d.color2 || "#123");
            if (d.imagen) {
                const img = document.createElement("img");
                img.src = d.imagen; img.alt = d.titulo || ""; s.appendChild(img);
            } else if (d.glifo) {
                const g = document.createElement("div");
                g.className = "carrusel-glifo"; g.textContent = d.glifo; s.appendChild(g);
            }

            const pie = document.createElement("div");
            pie.className = "carrusel-texto";
            const t = document.createElement("h3"); t.textContent = d.titulo || "";
            const p = document.createElement("p"); p.textContent = d.subtitulo || "";
            pie.append(t, p); s.appendChild(pie);
            this.pista.appendChild(s);
            return s;
        });

        this.raiz.appendChild(this.pista);

        const boton = (clase, texto, etiqueta, accion) => {
            const b = document.createElement("button");
            b.type = "button"; b.className = "carrusel-flecha " + clase;
            b.textContent = texto; b.setAttribute("aria-label", etiqueta);
            b.addEventListener("click", accion); this.raiz.appendChild(b);
        };

        boton("carrusel-anterior", "‹", "Anterior", () => this.anterior());
        boton("carrusel-siguiente", "›", "Siguiente", () => this.siguiente());

        this.puntos = document.createElement("div");
        this.puntos.className = "carrusel-puntos";
        this.botonesPunto = this.diapositivas.map((d, i) => {
            const b = document.createElement("button");
            b.type = "button"; b.setAttribute("aria-label", "Ir a " + d.titulo);
            b.addEventListener("click", () => this.ir(i));
            this.puntos.appendChild(b); return b;
        });
        this.raiz.appendChild(this.puntos);

        this.raiz.addEventListener("keydown", e => {
            if (e.key === "ArrowLeft") this.anterior();
            if (e.key === "ArrowRight") this.siguiente();
        });
        this.ir(0);
    }

    ir(n) {
        const total = this.diapositivas.length;
        this.indice = (n + total) % total;
        this.pista.style.transform = "translateX(-" + this.indice * 100 + "%)";
        this.slides.forEach((s, i) => s.setAttribute("aria-hidden", i !== this.indice));
        this.botonesPunto.forEach((b, i) => b.setAttribute("aria-current", i === this.indice));
        if (this.alCambiar) this.alCambiar(this.indice, this.diapositivas[this.indice]);
    }
    siguiente() { this.ir(this.indice + 1); }
    anterior() { this.ir(this.indice - 1); }
    diapositivaActual() { return this.diapositivas[this.indice]; }
}