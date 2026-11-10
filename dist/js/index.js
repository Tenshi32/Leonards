
$("#playBtn").on("click", function () {
    const seleccion = $("#difficultySelect").val();
    const categoria = seleccion.replace('.html', '');
    const idioma = $("input[name='langOptions']:checked").val(); // Captura el idioma

    localStorage.setItem("seeker_categoria", categoria);
    localStorage.setItem("seeker_lang", idioma); // Lo guardamos para la sopa
    window.location.href = "SeekerMind/sopa.html";
});


$(document).ready(function () {
    // 1. Cargar estadísticas iniciales
    const stats = {
        record: localStorage.getItem("mathrush_record") || 0,
        nivel: localStorage.getItem("mathrush_nivel") || 1,
        total: localStorage.getItem("mathrush_total_acumulado") || 0,
    };

    $("#valTotal").text(stats.total);
    $("#valRecord").text(stats.record);
    $("#valNivel").text(stats.nivel);

    // 2. Persistencia de dificultad
    const storedDiff = localStorage.getItem("mathrush_selected");
    if (storedDiff) $("#difficultySelect").val(storedDiff);

    const iniciarJuego = () => {
        const url = $("#difficultySelect").val();
        localStorage.setItem("mathrush_selected", url);
        window.location.href = "MathRush/"+url;
    };

    $("#playBtnMR").on("click", iniciarJuego);
    $("#startFromModal").on("click", () => {
        $("#tutorialModal").modal("hide");
        iniciarJuego();
    });

    // 3. Medallas (Usando el objeto LOGROS si es posible, o el array actual)
    // 3. Medallas
    const medallasColores = {
        1: "#28a745", // Verde
        2: "#9155f1", // Púrpura
        3: "#fd9845", // Naranja
        4: "#007bff", // Azul
        5: "#eec448", // Dorado
    };

    Object.keys(medallasColores).forEach((id) => {
        if (localStorage.getItem(`medal_${id}`) === "true") {
            const slot = $(`#slot_${id}`);
            const icon = slot.find(".medal-icon");

            if (icon.length) {
                // 1. Quitamos locked y ponemos unlocked
                icon.removeClass("locked").addClass("unlocked");

                // 2. Aplicamos el color dinámico al icono
                icon.css("color", medallasColores[id]);

                // 3. Añadimos una clase al padre para iluminar el texto vía CSS
                slot.addClass("active-medal");

                console.log(`Medalla ${id} iluminada correctamente`);
            }
        }

        $("#helpBtn").on("click", function () {
            introJs()
                .setOptions({
                    nextLabel: "Siguiente",
                    prevLabel: "Atrás",
                    doneLabel: "¡Entendido!",
                    exitOnOverlayClick: false,
                    showStepNumbers: true,
                    steps: [
                        {
                            intro: "¡Bienvenido a MathRush! Déjanos enseñarte lo básico.",
                        },
                        {
                            element: "#themeContainer",
                            intro: "Aquí puedes cambiar entre modo claro y oscuro.",
                        },
                        {
                            element: ".responsive-logo",
                            intro: "Este es el corazón del juego, ¡prepárate para calcular!",
                        },
                        {
                            element: "#helpBtn",
                            intro:
                                "Si alguna vez te pierdes, pulsa este botón para ver esta guía otra vez.",
                        },
                    ],
                })
                .oncomplete(function () {
                    localStorage.setItem("tour_visto", "true");
                })
                .onexit(function () {
                    localStorage.setItem("tour_visto", "true");
                })
                .start();
        });
    });

    // 4. Tema (Refactorizado a una línea)
    const applyTheme = (t) => {
        $("body").toggleClass("dark-mode", t === "dark");
        $("#themeToggle i").attr(
            "class",
            t === "dark" ? "bi bi-sun" : "bi bi-moon",
        );
        localStorage.setItem("theme", t);
    };

    applyTheme(localStorage.getItem("theme") || "light");

    $("#themeContainer").on("click", "#themeToggle", () => {
        applyTheme($("body").hasClass("dark-mode") ? "light" : "dark");
    });

});


const WORD_BANK = {
    animales: [
        { es: "ELEFANTE", en: "ELEPHANT" },
        { es: "TIGRE", en: "TIGER" },
        { es: "JIRAFA", en: "GIRAFFE" },
        { es: "CEBRA", en: "ZEBRA" },
        { es: "LEON", en: "LION" }
    ],
    mascotas: [
        { es: "PERRO", en: "DOG" },
        { es: "GATO", en: "CAT" },
        { es: "CONEJO", en: "RABBIT" },
        { es: "LORO", en: "PARROT" },
        { es: "HAMSTER", en: "HAMSTER" }
    ],
    frutas: [
        { es: "MANZANA", en: "APPLE" },
        { es: "PERA", en: "PEAR" },
        { es: "BANANA", en: "BANANA" },
        { es: "UVA", en: "GRAPE" },
        { es: "NARANJA", en: "ORANGE" }
    ],
    colores: [
        { es: "ROJO", en: "RED" },
        { es: "AZUL", en: "BLUE" },
        { es: "VERDE", en: "GREEN" },
        { es: "AMARILLO", en: "YELLOW" },
        { es: "BLANCO", en: "WHITE" }
    ],
    familia: [
        { es: "MADRE", en: "MOTHER" },
        { es: "PADRE", en: "FATHER" },
        { es: "HERMANO", en: "BROTHER" },
        { es: "ABUELA", en: "GRANDMA" },
        { es: "PRIMO", en: "COUSIN" }
    ],
    profesiones: [
        { es: "DOCTOR", en: "DOCTOR" },
        { es: "PILOTO", en: "PILOT" },
        { es: "MAESTRO", en: "TEACHER" },
        { es: "PINTOR", en: "PAINTER" },
        { es: "CHEF", en: "CHEF" }
    ]
};