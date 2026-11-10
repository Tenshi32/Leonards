// game-logic.js - LA MAQUINARIA GENÉRICA
function initGame(questionsData, nextLevelNumber) {

    let idx = 0, score = 0;
    const questions = questionsData;
    const ui = {
        text: document.getElementById("questionText"),
        options: document.getElementById("optionsList"),
        progress: document.getElementById("progressBar"),
        pText: document.getElementById("progressText"),
        score: document.getElementById("liveScore")
    };

    function renderQuestion(i) {
        const item = questions[i];
        if (!item) return;

        ui.text.classList.add("slide-in");
        setTimeout(() => {
            ui.text.textContent = item.q;
            ui.text.classList.remove("slide-in");
            ui.options.innerHTML = "";

            item.options.forEach((opt, j) => {
                const btn = document.createElement("button");
                btn.className = "btn btn-outline-primary option-btn w-100 py-3 mb-2";
                btn.innerHTML = opt;
                btn.onclick = () => {
                    ui.options.querySelectorAll(".option-btn").forEach(b => b.classList.remove("active"));
                    btn.classList.add("active");
                };
                const col = document.createElement("div");
                col.className = "col-6 p-1";
                col.appendChild(btn);
                ui.options.appendChild(col);
            });

            ui.progress.style.width = `${((i + 1) / questions.length) * 100}%`;
            ui.pText.textContent = `Pregunta ${i + 1} de ${questions.length}`;
            ui.score.textContent = `Puntos: ${score * 500}`;
        }, 200);
    }

    function mostrarModalLogro(titulo, nombre, icono, color, desc) {
        const iconEl = document.getElementById("logroIcono");
        document.getElementById("logroTitulo").textContent = titulo;
        document.getElementById("logroNombre").textContent = nombre;
        document.getElementById("logroDesc").textContent = desc;
        iconEl.className = `bi ${icono}`;
        iconEl.style.color = color;
        iconEl.style.filter = `drop-shadow(0 0 15px ${color})`;
        $("#modalLogro").modal("show");
    }

    function verificarLogrosPorPuntos(puntosNivel) {
        let totales = parseInt(localStorage.getItem("mathrush_total_acumulado")) || 0;
        totales += puntosNivel;
        localStorage.setItem("mathrush_total_acumulado", totales);

        const hitos = [
            { pts: 100000, key: "hito_100k", tit: "🏆 HITO ALCANZADO", nom: "Millonario Matemático", ico: "bi-gem", col: "#00d4ff", desc: "¡Eres una leyenda de 100k!" },
            { pts: 10000, key: "hito_10k", tit: "✨ NUEVA MARCA", nom: "Cazador de Puntos", ico: "bi-star-fill", col: "#ff4500", desc: "¡10,000 puntos acumulados!" }
        ];

        hitos.forEach(h => {
            if (totales >= h.pts && !localStorage.getItem(h.key)) {
                localStorage.setItem(h.key, "true");
                setTimeout(() => mostrarModalLogro(h.tit, h.nom, h.ico, h.col, h.desc), 1000);
            }
        });
    }

    function finalizarNivel() {
        const puntosFinales = score * 500;
        const perfecto = score === questions.length;
        const idMedalla = `medal_${nextLevelNumber - 1}`;

        if (perfecto) {
            localStorage.setItem("mathrush_nivel", nextLevelNumber);
            // CORRECCIÓN: Primero chequeamos si YA la tenía, si no, mostramos modal
            if (!localStorage.getItem(idMedalla)) {
                localStorage.setItem(idMedalla, "true");
                const info = LOGROS[nextLevelNumber-1];
                setTimeout(() => mostrarModalLogro("🎖️ ¡NUEVA MEDALLA!", info.nombre, info.icono, info.color, info.desc), 1500);
            }
        } else {
            document.getElementById("modalResultadosLabel").textContent = "¡CASI LO LOGRAS!";
            alert("Necesitas 5/5 para desbloquear el siguiente nivel.");
        }

        const record = parseInt(localStorage.getItem("mathrush_record")) || 0;
        if (puntosFinales > record) localStorage.setItem("mathrush_record", puntosFinales);

        verificarLogrosPorPuntos(puntosFinales);

        document.getElementById("modalAciertos").textContent = `${score} / ${questions.length}`;
        document.getElementById("modalPuntos").textContent = puntosFinales;
        $("#modalResultados").modal("show");
    }

    document.getElementById("nextBtn").onclick = () => {
        const sel = ui.options.querySelector(".active");
        if (!sel) return alert("¡Elige una opción!");

        const btns = Array.from(ui.options.querySelectorAll(".option-btn"));
        if (btns.indexOf(sel) === questions[idx].answer) score++;

        if (idx < questions.length - 1) {
            ui.text.classList.add("slide-out");
            setTimeout(() => {
                ui.text.classList.remove("slide-out");
                idx++;
                renderQuestion(idx);
            }, 300);
        } else {
            finalizarNivel();
        }
    };

    document.getElementById("backBtn").onclick = () => window.location.href = "index.html";
    renderQuestion(idx);
}


