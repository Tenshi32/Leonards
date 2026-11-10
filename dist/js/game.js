let gridSize = 12;
let wordsToFind = [];
let foundWords = 0;
let grid = [];
let selectedCells = []; // Para rastrear las letras que vas tocando
let isDragging = false;
let selectionStart = null; // celda inicial de la selección (r,c)

// Configuración de Sonidos (Asegúrate de tener estos archivos en dist/audio/)
const sndSuccess = new Audio("dist/audio/success.mp3");
const sndError = new Audio("dist/audio/error.mp3");

$(document).ready(function () {

  document.getElementById("backBtn").onclick = () => window.location.href = "index.html";

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
});

function generarSopa(categoria) {
  grid = Array(gridSize)
    .fill()
    .map(() => Array(gridSize).fill(""));
  const baseWords = WORD_BANK[categoria].map((w) =>
    w[selectedLanguage].toUpperCase(),
  );
  wordsToFind = baseWords.slice(0, 8);
  foundWords = 0;

  wordsToFind.forEach((word) => {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 150) {
      // Aumentamos intentos porque diagonal es más restrictivo
      const rand = Math.random();
      let direction = "H";
      if (rand > 0.33 && rand < 0.66) direction = "V";
      if (rand >= 0.66) direction = "D"; // 'D' de Diagonal

      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);

      if (canPlace(word, row, col, direction)) {
        placeWord(word, row, col, direction);
        placed = true;
      }
      attempts++;
    }
  });

  fillEmptySlots();
  renderGrid();
  renderWordList();
}

// --- LÓGICA DE SELECCIÓN ---

function handleCellClick(r, c) {
  const cellElement = $(`.letter-cell[data-row='${r}'][data-col='${c}']`);

  if (cellElement.hasClass("found")) return; // Si ya se encontró, ignorar

  if (cellElement.hasClass("selected")) {
    cellElement.removeClass("selected");
    selectedCells = selectedCells.filter(
      (cell) => !(cell.r === r && cell.c === c),
    );
  } else {
    cellElement.addClass("selected");
    selectedCells.push({ r, c, letter: grid[r][c] });
  }

  verificarPalabra();
}

function startSelection(r, c) {
  limpiarSeleccionActual();
  selectionStart = { r, c };
  selectRange(selectionStart.r, selectionStart.c, r, c);
}

function continueSelection(r, c) {
  if (!selectionStart) return;
  // Selección restringida a línea recta: horizontal, vertical o diagonal
  selectRange(selectionStart.r, selectionStart.c, r, c);
}

// Selecciona todos los celdas entre start y end sólo si forman una línea recta
function selectRange(sr, sc, er, ec) {
  limpiarSeleccionActual();

  const dr = er - sr;
  const dc = ec - sc;

  // Determinar paso
  let stepR = 0;
  let stepC = 0;

  if (sr === er) {
    // horizontal
    stepR = 0;
    stepC = dc > 0 ? 1 : -1;
  } else if (sc === ec) {
    // vertical
    stepR = dr > 0 ? 1 : -1;
    stepC = 0;
  } else if (Math.abs(dr) === Math.abs(dc)) {
    // diagonal
    stepR = dr > 0 ? 1 : -1;
    stepC = dc > 0 ? 1 : -1;
  } else {
    // No está en línea recta: sólo selecciona la celda inicial
    const cellElement = $(`.letter-cell[data-row='${sr}'][data-col='${sc}']`);
    if (!cellElement.hasClass('found')) {
      cellElement.addClass('selected');
      selectedCells.push({ r: sr, c: sc, letter: grid[sr][sc] });
    }
    return;
  }

  // Recorre desde start hasta end
  let r = sr;
  let c = sc;
  while (true) {
    const cellElement = $(`.letter-cell[data-row='${r}'][data-col='${c}']`);
    if (cellElement.hasClass('found')) break; // no selecciona celdas ya encontradas
    cellElement.addClass('selected');
    selectedCells.push({ r, c, letter: grid[r][c] });

    if (r === er && c === ec) break;
    r += stepR;
    c += stepC;
  }
}

function limpiarSeleccionActual() {
  $(".letter-cell").removeClass("selected");
  selectedCells = [];
}

// --- FUNCIONES DE SOPORTE ---

function canPlace(word, row, col, dir) {
  if (dir === "H" && col + word.length > gridSize) return false;
  if (dir === "V" && row + word.length > gridSize) return false;
  // Para diagonal: debe caber tanto en ancho como en alto
  if (
    dir === "D" &&
    (col + word.length > gridSize || row + word.length > gridSize)
  )
    return false;

  for (let i = 0; i < word.length; i++) {
    let r = row;
    let c = col;

    if (dir === "H") c = col + i;
    else if (dir === "V") r = row + i;
    else if (dir === "D") {
      r = row + i;
      c = col + i;
    } // Incrementa ambos

    const char = grid[r][c];
    if (char !== "" && char !== word[i]) return false;
  }
  return true;
}

function placeWord(word, row, col, dir) {
  for (let i = 0; i < word.length; i++) {
    if (dir === "H") grid[row][col + i] = word[i];
    else if (dir === "V") grid[row + i][col] = word[i];
    else if (dir === "D") grid[row + i][col + i] = word[i];
  }
}

function fillEmptySlots() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c] === "") {
        grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }
}

function renderGrid() {
  const container = document.getElementById("wordSearchGrid");
  container.innerHTML = "";
  container.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

  grid.forEach((row, rIdx) => {
    row.forEach((letter, cIdx) => {
      const cell = document.createElement("div");
      cell.classList.add("letter-cell");
      cell.textContent = letter;
      cell.dataset.row = rIdx;
      cell.dataset.col = cIdx;

      // --- NUEVOS EVENTOS DE ARRASTRE ---

      // Cuando presionas el mouse o tocas la pantalla
      cell.addEventListener("pointerdown", (e) => {
        isDragging = true;
        e.target.releasePointerCapture(e.pointerId); // Permite rastrear el movimiento fuera de la celda inicial
        startSelection(rIdx, cIdx);
      });

      // Cuando pasas por encima (mientras arrastras)
      cell.addEventListener("pointerenter", () => {
        if (isDragging) {
          continueSelection(rIdx, cIdx);
        }
      });

      // Cuando sueltas el clic o levantas el dedo
      cell.addEventListener("pointerup", () => {
        if (isDragging) {
          isDragging = false;
          // Verificamos y dejamos que verificarPalabra limpie selectedCells
          verificarPalabra();
          selectionStart = null;
        }
      });

      container.appendChild(cell);
    });
  });

  // Seguridad: si sueltas el mouse fuera de la cuadrícula, detiene el arrastre
  document.addEventListener("pointerup", () => {
    if (isDragging) {
      isDragging = false;
      verificarPalabra();
      selectionStart = null;
    }
  });
}

let selectedLanguage = localStorage.getItem("seeker_lang") || "es";

const pastelColors = ["#FFB7B2", "#FFDAC1", "#E2F0CB", "#B5EAD7", "#C7CEEA"];

function decirPalabra(palabra) {
  // Verificar si el navegador soporta la API
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(palabra);
    utterance.lang = 'es-ES'; // Idioma (español)
    utterance.rate = 1.0;   // Velocidad de reproducción

    window.speechSynthesis.speak(utterance);
  } else {
    console.error("Tu navegador no soporta síntesis de voz.");
  }
}

// Ejemplo de llamada:

function renderWordList() {
  const listContainer = document.getElementById("wordList");
  listContainer.innerHTML = "";

  wordsToFind.forEach((word) => {
    const li = document.createElement("li");
    li.classList.add(
      "list-group-item",
      "bg-transparent",
      "text-white",
      "border-secondary",
    );
    li.id = `list-${word}`;
    // Añadimos el texto y el contenedor del check
    li.innerHTML = `
            <span>${word}</span>
            <button class="bi bi-check-circle-fill word-check" onclick="decirPalabra('${word}')">Escuchar</button>
        `;
    listContainer.appendChild(li);
  });
}

function verificarPalabra() {
  const palabraFormada = selectedCells.map(c => c.letter).join("");
  const palabraInversa = palabraFormada.split("").reverse().join("");

  if (wordsToFind.includes(palabraFormada) || wordsToFind.includes(palabraInversa)) {
    const palabraFinal = wordsToFind.includes(palabraFormada) ? palabraFormada : palabraInversa;

    // Elegir un color pastel aleatorio para esta palabra específica
    const colorAleatorio = pastelColors[Math.floor(Math.random() * pastelColors.length)];

    selectedCells.forEach(cell => {
      $(`.letter-cell[data-row='${cell.r}'][data-col='${cell.c}']`)
        .removeClass("selected")
        .addClass("found")
        .css("background-color", "#C1E1C1"); // Forzamos el verde pastel al acertar
    });

    // Marcamos la lista y mostramos el check
    const listItem = $(`#list-${palabraFinal}`);
    if (!listItem.hasClass("found")) {
      listItem.addClass("found");
      sndSuccess.play().catch(() => { });
      foundWords++;
    }
  } else {
    if (selectedCells.length > 1) sndError.play().catch(() => { });
    $(".letter-cell").removeClass("selected");
  }

  selectedCells = [];
}