// celda inicial de la selección (r,c)

// Configuración de Sonidos (Asegúrate de tener estos archivos en dist/audio/)
const sndSuccess = new Audio("../dist/audio/success.mp3");
const sndError = new Audio("../dist/audio/error.mp3");

$(document).ready(function () {

  document.getElementById("backBtn").onclick = () => (window.location.href = "index.html");

  const tema = localStorage.getItem("theme") || "light";
  document.documentElement.classList.toggle("dark-mode", tema === "dark");
  document.body.classList.toggle("dark-mode", tema === "dark");

  const categoriaGuardada =
    localStorage.getItem("seeker_categoria") || "animales";
  generarSopa(categoriaGuardada);

  // Lógica para el botón de cambiar idioma
  $("#btnChangeLang").on("click", function () {
    selectedLanguage = selectedLanguage === "es" ? "en" : "es";
    localStorage.setItem("seeker_lang", selectedLanguage);
    $(this).text(
      selectedLanguage === "es" ? "Cambiar a Inglés" : "Change to Spanish",
    );
    generarSopa(categoriaGuardada); // Regenera la sopa
  });

  startTimer();
});

$("#helpBtn").on("click", function () {
  introJs()
    .setOptions({
      nextLabel: "Siguiente",
      prevLabel: "Atrás",
      doneLabel: "¡Entendido!",
      exitOnOverlayClick: false,
      showStepNumbers: true,
    })
    .oncomplete(function () {
      localStorage.setItem("tour_visto", "true");
    })
    .onexit(function () {
      localStorage.setItem("tour_visto", "true");
    })
    .start();
});

let totalSeconds = 0; 
let timerInterval = null;
let isRunning = false;

const display = document.getElementById("timerDisplay");

// Función para actualizar el formato en pantalla (MM:SS)
function startTimer() {
    if (isRunning) return;
    
    isRunning = true;

    timerInterval = setInterval(() => {
        totalSeconds++; // Incrementa en lugar de decrementar
        updateDisplay();
    }, 1000);
}

function updateDisplay() {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Añade un cero a la izquierda si es menor a 10
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    display.textContent = `${formattedMinutes}:${formattedSeconds}`;
}