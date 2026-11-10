const preguntasNivel1 = [
  { q: "3 + 4", options: ["5", "6", "7", "8"], answer: 2 },
  { q: "10 - 4", options: ["6", "5", "7", "4"], answer: 0 },
  { q: "7 + 2", options: ["8", "9", "10", "7"], answer: 1 },
  { q: "5 - 3", options: ["1", "2", "3", "0"], answer: 1 },
  { q: "4 + 4", options: ["7", "8", "9", "6"], answer: 1 },
];

const preguntasNivel2 = [
  { q: "6 × 7", options: ["42", "36", "48", "40"], answer: 0 },
  { q: "5 × 5", options: ["10", "20", "25", "30"], answer: 2 },
  { q: "4 × 6", options: ["20", "24", "22", "26"], answer: 1 },
  { q: "8 × 3", options: ["21", "24", "18", "26"], answer: 1 },
  { q: "9 × 2", options: ["16", "14", "20", "18"], answer: 3 },
];

const preguntasNivel3 = [
  { q: "X + 5 = 12 ¿X?", options: ["5", "7", "8", "6"], answer: 1 },
  { q: "20 - X = 8 ¿X?", options: ["12", "10", "14", "18"], answer: 0 },
  { q: "X × 3 = 15 ¿X?", options: ["4", "6", "5", "3"], answer: 2 },
  { q: "La mitad de 50", options: ["20", "25", "30", "15"], answer: 1 },
  { q: "X + X = 20 ¿X?", options: ["5", "15", "20", "10"], answer: 3 },
];

const preguntasNivel4 = [
  { q: "5² + 10", options: ["20", "35", "25", "30"], answer: 1 }, // 25 + 10
  { q: "√81 + 3", options: ["12", "9", "11", "10"], answer: 0 }, // 9 + 3
  { q: "2³ - 4", options: ["2", "4", "6", "8"], answer: 1 }, // 8 - 4
  { q: "15% de 200", options: ["20", "35", "30", "45"], answer: 2 }, // (15 * 2)
  { q: "12 × 12", options: ["144", "124", "134", "154"], answer: 0 },
];

const preguntasNivel5 = [
  { q: "(-5) + 12", options: ["-7", "17", "7", "8"], answer: 2 },
  { q: "3 + 6 × 4", options: ["36", "27", "24", "30"], answer: 1 }, // Prioridad al 6x4
  { q: "√100 ÷ 2 + 5", options: ["10", "15", "5", "8"], answer: 0 }, // 10/2 + 5
  { q: "2⁴ ÷ 4", options: ["2", "8", "6", "4"], answer: 3 }, // 16 / 4
  { q: "10 - (15 + 5)", options: ["10", "-10", "0", "-5"], answer: 1 }, // 10 - 20
];

const LOGROS = {
  1: {
    id: "medal_1",
    nombre: "Novato Sumador",
    icono: "bi-plus-circle-fill",
    color: "#007bff",
    desc: "Completaste el Nivel 1",
  },
  2: {
    id: "medal_2",
    nombre: "Multi-Maestro",
    icono: "bi-x-circle-fill",
    color: "#6610f2",
    desc: "Completaste el Nivel 2",
  },
  3: {
    id: "medal_3",
    nombre: "X-Ray (Experto)",
    icono: "bi-intersect",
    color: "#28a745",
    desc: "Completaste el Nivel 3",
  },
  4: {
    id: "medal_4",
    nombre: "Rey de las Raíces",
    icono: "bi-lightning-fill",
    color: "#fd7e14",
    desc: "Completaste el Nivel 4",
  },
  5: {
    id: "medal_5",
    nombre: "Leyenda Matemática",
    icono: "bi-trophy-fill",
    color: "#6f42c1",
    desc: "Completaste el Nivel 5",
  },
};