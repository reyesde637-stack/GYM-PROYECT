// Este archivo pertenece al frontend local. No va dentro de Google Apps Script.
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwh3w7KQGailaIXOwZNFcW2l-tnvx4SitSJzatiYT4jIugAkfxq7Vw_jTHzhlD-jYY/exec";

const STORAGE_KEYS = {
  records: "gym-tracker-records",
  pending: "gym-tracker-pending",
  selectedDay: "gym-tracker-selected-day",
  preferredWeightUnit: "gym-tracker-preferred-weight-unit"
};

const PROGRESS_CATEGORY_LABELS = {
  upper: "Upper",
  lower: "Lower",
  others: "Others"
};

const EXERCISE_MEDIA = {
  "Press inclinado barra": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80",
  "Jalon al pecho amplio": "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=900&q=80",
  "Press banca plano": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80",
  "Remo con barra": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=80",
  "Elevaciones laterales": "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=900&q=80",
  "Curl biceps": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=80",
  "Triceps cuerda": "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
  "Sentadilla": "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?auto=format&fit=crop&w=900&q=80",
  "Peso muerto rumano": "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?auto=format&fit=crop&w=900&q=80",
  "Prensa": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=80",
  "Curl femoral": "https://images.unsplash.com/photo-1518611012118-fbcedce76613?auto=format&fit=crop&w=900&q=80",
  "Elevaciones de piernas": "https://images.unsplash.com/photo-1571019613576-2b22c76fd955?auto=format&fit=crop&w=900&q=80",
  "Plancha": "https://images.unsplash.com/photo-1517836357463-4a73f0c72014?auto=format&fit=crop&w=900&q=80",
  "Press hombro": "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?auto=format&fit=crop&w=900&q=80",
  "Jalon al pecho": "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=900&q=80",
  "Remo maquina": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=80",
  "Face pull": "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
  "Curl martillo": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=80",
  "Triceps": "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
  "Hip thrust": "https://images.unsplash.com/photo-1517836357463-4a73f0c72014?auto=format&fit=crop&w=900&q=80",
  "Zancadas": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80",
  "Gemelos": "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?auto=format&fit=crop&w=900&q=80",
  "Ab wheel / crunch": "https://images.unsplash.com/photo-1571019613576-2b22c76fd955?auto=format&fit=crop&w=900&q=80",
  "Cardio 20-30 min": "https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=900&q=80",
  "Abdomen + vacuum": "https://images.unsplash.com/photo-1571019613576-2b22c76fd955?auto=format&fit=crop&w=900&q=80"
};

const routineDays = [
  {
    id: 1,
    label: "Dia 1",
    title: "Upper",
    subtitle: "Pecho superior + espalda",
    description: "Empuje y traccion con enfoque en torso y volumen visual.",
    type: "training",
    progressCategory: "upper",
    exercises: [
      createExercise("Press inclinado barra", "4x6-8"),
      createExercise("Jalon al pecho amplio", "4x8-10"),
      createExercise("Press banca plano", "3x8-10"),
      createExercise("Remo con barra", "3x8-10"),
      createExercise("Elevaciones laterales", "4x12-15"),
      createExercise("Curl biceps", "3x10-12"),
      createExercise("Triceps cuerda", "3x10-12")
    ]
  },
  {
    id: 2,
    label: "Dia 2",
    title: "Lower",
    subtitle: "Pierna + abdomen",
    description: "Base de fuerza, femoral y core.",
    type: "training",
    progressCategory: "lower",
    exercises: [
      createExercise("Sentadilla", "4x6-8"),
      createExercise("Peso muerto rumano", "3x8-10"),
      createExercise("Prensa", "3x10"),
      createExercise("Curl femoral", "3x12"),
      createExercise("Elevaciones de piernas", "3x15"),
      createExercise("Plancha", "3x40 seg")
    ]
  },
  {
    id: 3,
    label: "Dia 3",
    title: "Descanso",
    subtitle: "Recuperacion",
    description: "Movilidad suave, hidratacion y descanso.",
    type: "rest",
    exercises: []
  },
  {
    id: 4,
    label: "Dia 4",
    title: "Upper",
    subtitle: "Hombro + espalda estetica",
    description: "Deltoides, espalda alta y detalle visual.",
    type: "training",
    progressCategory: "upper",
    exercises: [
      createExercise("Press hombro", "4x6-8"),
      createExercise("Jalon al pecho", "3x10"),
      createExercise("Remo maquina", "3x10"),
      createExercise("Elevaciones laterales", "5x12-15"),
      createExercise("Face pull", "3x12-15"),
      createExercise("Curl martillo", "3x10"),
      createExercise("Triceps", "3x10")
    ]
  },
  {
    id: 5,
    label: "Dia 5",
    title: "Lower",
    subtitle: "Gluteo + abdomen",
    description: "Cadena posterior, gluteo y estabilidad central.",
    type: "training",
    progressCategory: "lower",
    exercises: [
      createExercise("Hip thrust", "4x8-10"),
      createExercise("Zancadas", "3x10 c/pierna"),
      createExercise("Curl femoral", "3x12"),
      createExercise("Gemelos", "4x15"),
      createExercise("Ab wheel / crunch", "3x12-15")
    ]
  },
  {
    id: 6,
    label: "Dia 6",
    title: "Opcional",
    subtitle: "Cardio / abdomen",
    description: "Trabajo ligero para condicion y abdomen.",
    type: "training",
    progressCategory: "others",
    exercises: [
      createExercise("Cardio 20-30 min", "1x20-30 min"),
      createExercise("Abdomen + vacuum", "3x12-15")
    ]
  },
  {
    id: 7,
    label: "Dia 7",
    title: "Descanso",
    subtitle: "Recuperacion",
    description: "Recarga completa para iniciar nuevo microciclo.",
    type: "rest",
    exercises: []
  }
];

// Estado principal de la app.
const state = {
  today: getTodayString(),
  selectedDayId: Number(localStorage.getItem(STORAGE_KEYS.selectedDay)) || 1,
  activeExercise: null,
  records: loadJson(STORAGE_KEYS.records, []),
  pendingRecords: loadJson(STORAGE_KEYS.pending, []),
  deletingRecordId: ""
};

const elements = {};

document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  bindEvents();
  renderCurrentDate();
  renderDayCards();
  renderSelectedDay();
  renderHistory();
  populateProgressExerciseSelect();
  renderProgressChart();
  updateDashboardCounts();
  retryPendingRecords(false);
  refreshProgressFromServer(false);
});

function cacheElements() {
  elements.currentDate = document.getElementById("current-date");
  elements.completedSetsCount = document.getElementById("completed-sets-count");
  elements.pendingCount = document.getElementById("pending-count");
  elements.retrySyncBtn = document.getElementById("retry-sync-btn");
  elements.refreshHistoryBtn = document.getElementById("refresh-history-btn");
  elements.dayGrid = document.getElementById("day-grid");
  elements.selectedDayTitle = document.getElementById("selected-day-title");
  elements.selectedDayTag = document.getElementById("selected-day-tag");
  elements.daySummary = document.getElementById("day-summary");
  elements.exerciseList = document.getElementById("exercise-list");
  elements.historyMeta = document.getElementById("history-meta");
  elements.historyList = document.getElementById("history-list");
  elements.refreshProgressBtn = document.getElementById("refresh-progress-btn");
  elements.progressExerciseSelect = document.getElementById("progress-exercise-select");
  elements.progressMetricSelect = document.getElementById("progress-metric-select");
  elements.progressUnitSelect = document.getElementById("progress-unit-select");
  elements.progressSummary = document.getElementById("progress-summary");
  elements.progressChart = document.getElementById("progress-chart");
  elements.progressChartEmpty = document.getElementById("progress-chart-empty");
  elements.modal = document.getElementById("set-modal");
  elements.setForm = document.getElementById("set-form");
  elements.closeModalBtn = document.getElementById("close-modal-btn");
  elements.cancelModalBtn = document.getElementById("cancel-modal-btn");
  elements.saveSetBtn = document.getElementById("save-set-btn");
  elements.toast = document.getElementById("toast");
  elements.dateInput = document.getElementById("date-input");
  elements.dayInput = document.getElementById("day-input");
  elements.exerciseInput = document.getElementById("exercise-input");
  elements.setNumberInput = document.getElementById("set-number-input");
  elements.weightInput = document.getElementById("weight-input");
  elements.weightUnitInput = document.getElementById("weight-unit-input");
  elements.repsDoneInput = document.getElementById("reps-done-input");
  elements.repsTargetInput = document.getElementById("reps-target-input");
  elements.goalHitInput = document.getElementById("goal-hit-input");
  elements.goalOverInput = document.getElementById("goal-over-input");
  elements.notesInput = document.getElementById("notes-input");
}

function bindEvents() {
  elements.retrySyncBtn.addEventListener("click", () => retryPendingRecords(true));
  elements.refreshHistoryBtn.addEventListener("click", refreshHistoryFromServer);
  elements.refreshProgressBtn.addEventListener("click", () => refreshProgressFromServer(true));
  elements.progressExerciseSelect.addEventListener("change", renderProgressChart);
  elements.progressMetricSelect.addEventListener("change", renderProgressChart);
  elements.progressUnitSelect.addEventListener("change", renderProgressChart);
  elements.weightUnitInput.addEventListener("change", () => {
    localStorage.setItem(STORAGE_KEYS.preferredWeightUnit, elements.weightUnitInput.value);
  });
  elements.closeModalBtn.addEventListener("click", closeModal);
  elements.cancelModalBtn.addEventListener("click", closeModal);
  elements.setForm.addEventListener("submit", handleSetSubmit);

  document.addEventListener("click", (event) => {
    const target = getEventElement(event);
    if (!target) {
      return;
    }

    const dayButton = target.closest("[data-day-id]");
    if (dayButton) {
      state.selectedDayId = Number(dayButton.dataset.dayId);
      localStorage.setItem(STORAGE_KEYS.selectedDay, String(state.selectedDayId));
      renderDayCards();
      renderSelectedDay();
      return;
    }

    const registerButton = target.closest("[data-register-exercise]");
    if (registerButton) {
      const dayId = Number(registerButton.dataset.dayId);
      const exerciseIndex = Number(registerButton.dataset.exerciseIndex);
      openRegisterModal(dayId, exerciseIndex);
      return;
    }

    const deleteButton = target.closest("[data-delete-record]");
    if (deleteButton) {
      deleteRecord(deleteButton.dataset.deleteRecord);
      return;
    }

    if (target.matches("[data-close-modal='true']")) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !elements.modal.classList.contains("hidden")) {
      closeModal();
    }
  });
}

function renderCurrentDate() {
  const formatter = new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  elements.currentDate.textContent = capitalizeText(formatter.format(new Date()));
}

function renderDayCards() {
  elements.dayGrid.innerHTML = "";

  routineDays.forEach((day) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `day-card ${day.type === "rest" ? "rest" : ""} ${day.id === state.selectedDayId ? "active" : ""}`;
    button.dataset.dayId = String(day.id);
    button.innerHTML = `
      <div class="day-card-top">
        <div>
          <div class="day-index">${day.label}</div>
          <h3>${day.title}</h3>
        </div>
        <span class="pill">${day.type === "rest" ? "Recovery" : day.exercises.length + " ejercicios"}</span>
      </div>
      <p class="day-description">${day.subtitle}</p>
    `;
    elements.dayGrid.appendChild(button);
  });

  attachDayCardListeners();
}

function renderSelectedDay() {
  const selectedDay = getSelectedDay();

  elements.selectedDayTitle.textContent = `${selectedDay.label} - ${selectedDay.title}`;
  elements.selectedDayTag.textContent = selectedDay.subtitle;
  elements.selectedDayTag.className = `day-tag ${selectedDay.type === "rest" ? "muted" : ""}`;

  if (selectedDay.type === "rest") {
    elements.daySummary.innerHTML = `
      <p><strong>Dia de descanso.</strong> Usa este espacio para movilidad, pasos, estiramientos o simplemente recuperarte.</p>
    `;
    elements.exerciseList.innerHTML = `
      <div class="empty-state">
        No hay ejercicios cargados para este dia. Puedes dejarlo como recordatorio de recuperacion.
      </div>
    `;
    return;
  }

  const totalCompleted = selectedDay.exercises.reduce((sum, exercise) => {
    return sum + getCompletedSetsCount(selectedDay, exercise);
  }, 0);

  const totalObjective = selectedDay.exercises.reduce((sum, exercise) => sum + exercise.targetSets, 0);

  elements.daySummary.innerHTML = `
    <p>
      <strong>${selectedDay.subtitle}</strong><br>
      ${selectedDay.description}<br>
      Progreso del dia: <strong>${totalCompleted}</strong> de <strong>${totalObjective}</strong> sets registrados hoy.
    </p>
  `;

  elements.exerciseList.innerHTML = "";
  selectedDay.exercises.forEach((exercise, exerciseIndex) => {
    const completedSets = getCompletedSetsCount(selectedDay, exercise);
    const card = document.createElement("article");
    card.className = "exercise-card";
    card.innerHTML = `
      <div class="exercise-image-wrap">
        <img
          class="exercise-image"
          src="${exercise.image}"
          alt="Referencia visual para ${exercise.name}"
          data-exercise-name="${escapeAttribute(exercise.name)}"
          loading="lazy"
        >
      </div>
      <div class="exercise-content">
        <div class="exercise-header">
          <div>
            <h3>${exercise.name}</h3>
            <p>${exercise.setsLabel} series objetivo</p>
          </div>
          <span class="pill">${completedSets}/${exercise.targetSets} sets</span>
        </div>
        <div class="set-progress">
          ${renderSetDots(exercise.targetSets, completedSets)}
        </div>
        <p class="exercise-notes">Repeticiones objetivo: ${exercise.targetReps}</p>
        <div class="exercise-actions">
          <div class="status-row">
            ${completedSets > 0 ? '<span class="status-chip success">Con progreso registrado</span>' : '<span class="status-chip pending">Sin sets guardados</span>'}
          </div>
          <button
            class="exercise-button"
            type="button"
            data-register-exercise="true"
            data-day-id="${selectedDay.id}"
            data-exercise-index="${exerciseIndex}"
          >
            Registrar set
          </button>
        </div>
      </div>
    `;
    elements.exerciseList.appendChild(card);
  });

  attachExerciseButtonListeners();
  attachExerciseImageFallbacks();
}

function renderSetDots(total, completed) {
  return Array.from({ length: total }, (_, index) => {
    const completedClass = index < completed ? "done" : "";
    return `<span class="set-dot ${completedClass}" aria-hidden="true"></span>`;
  }).join("");
}

function openRegisterModal(dayId, exerciseIndex) {
  const day = routineDays.find((item) => item.id === dayId);
  const exercise = day.exercises[exerciseIndex];
  const nextSetNumber = Math.min(getCompletedSetsCount(day, exercise) + 1, exercise.targetSets);

  state.activeExercise = {
    dayId,
    exerciseIndex
  };

  elements.dateInput.value = state.today;
  elements.dayInput.value = `${day.label} - ${day.title}`;
  elements.exerciseInput.value = exercise.name;
  elements.setNumberInput.value = String(nextSetNumber);
  elements.setNumberInput.max = String(Math.max(exercise.targetSets, nextSetNumber));
  elements.weightInput.value = "";
  elements.weightUnitInput.value = localStorage.getItem(STORAGE_KEYS.preferredWeightUnit) || "kg";
  elements.repsDoneInput.value = "";
  elements.repsTargetInput.value = exercise.targetReps;
  elements.goalHitInput.value = "Sí";
  elements.goalOverInput.value = "No";
  elements.notesInput.value = "";

  elements.modal.classList.remove("hidden");
  elements.modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  state.activeExercise = null;
  elements.setForm.reset();
  elements.modal.classList.add("hidden");
  elements.modal.setAttribute("aria-hidden", "true");
}

async function handleSetSubmit(event) {
  event.preventDefault();

  if (!state.activeExercise) {
    showToast("No hay ejercicio activo para registrar.", "error");
    return;
  }

  const day = routineDays.find((item) => item.id === state.activeExercise.dayId);
  const exercise = day.exercises[state.activeExercise.exerciseIndex];

  const payload = {
    fecha: elements.dateInput.value,
    diaRutina: elements.dayInput.value,
    ejercicio: elements.exerciseInput.value,
    set: Number(elements.setNumberInput.value),
    peso: normalizeOptionalNumber(elements.weightInput.value),
    unidadPeso: elements.weightUnitInput.value || "kg",
    repsRealizadas: Number(elements.repsDoneInput.value),
    repsObjetivo: elements.repsTargetInput.value,
    cumplioObjetivo: elements.goalHitInput.value,
    superoObjetivo: elements.goalOverInput.value,
    notas: elements.notesInput.value.trim()
  };

  const validationError = validatePayload(payload, exercise);
  if (validationError) {
    showToast(validationError, "error");
    return;
  }

  // Guardamos primero en local para no perder el dato aunque falle el envio remoto.
  const localRecord = {
    id: generateRecordId(),
    timestamp: new Date().toISOString(),
    synced: false,
    ...payload
  };

  state.records.unshift(localRecord);
  persistRecords();
  closeModal();
  renderSelectedDay();
  renderHistory();
  updateDashboardCounts();

  const saveResult = await sendRecordToAppsScript(localRecord);

  if (saveResult.success) {
    localRecord.synced = true;
    if (saveResult.recordId) {
      localRecord.id = saveResult.recordId;
    }
    persistRecords();
    renderHistory();
    renderProgressChart();
    updateDashboardCounts();
    showToast("Set guardado correctamente en Google Sheets.", "success");
    return;
  }

  queuePendingRecord(localRecord);
  renderHistory();
  renderProgressChart();
  updateDashboardCounts();
  showToast("No se pudo enviar. El registro quedo guardado localmente para reintento.", "error");
}

function validatePayload(payload, exercise) {
  if (!payload.fecha) {
    return "La fecha es obligatoria.";
  }

  if (!payload.ejercicio) {
    return "El ejercicio es obligatorio.";
  }

  if (!Number.isFinite(payload.set) || payload.set < 1) {
    return "El numero de set debe ser mayor a 0.";
  }

  if (!Number.isFinite(payload.repsRealizadas) || payload.repsRealizadas < 0) {
    return "Las repeticiones realizadas deben ser validas.";
  }

  if (payload.peso !== "" && (!Number.isFinite(payload.peso) || payload.peso < 0)) {
    return "El peso usado debe ser un numero valido.";
  }

  if (payload.set > exercise.targetSets + 5) {
    return "El numero de set parece demasiado alto para este ejercicio.";
  }

  return "";
}

async function sendRecordToAppsScript(record) {
  if (!isAppsScriptConfigured()) {
    return { success: false };
  }

  try {
    // text/plain evita preflight innecesario y Apps Script recibe el JSON como texto.
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(record)
    });

    if (!response.ok) {
      return { success: false };
    }

    const result = await response.json();
    return {
      success: Boolean(result.success),
      recordId: result.recordId || record.id || ""
    };
  } catch (error) {
    console.error("Error enviando a Apps Script:", error);
    return { success: false };
  }
}

async function refreshHistoryFromServer() {
  if (!isAppsScriptConfigured()) {
    showToast("Primero configura la URL del Web App en script.js.", "error");
    return;
  }

  try {
    const url = new URL(APPS_SCRIPT_URL);
    url.searchParams.set("action", "history");
    url.searchParams.set("date", state.today);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error("No se pudo consultar historial remoto.");
    }

    const result = await response.json();
    if (!result.success || !Array.isArray(result.records)) {
      throw new Error("Respuesta invalida del historial.");
    }

    mergeRemoteRecords(result.records);
    renderSelectedDay();
    renderHistory();
    populateProgressExerciseSelect();
    renderProgressChart();
    updateDashboardCounts();
    showToast("Historial actualizado desde Google Sheets.", "success");
  } catch (error) {
    console.error(error);
    showToast("No fue posible actualizar el historial remoto.", "error");
  }
}

function mergeRemoteRecords(remoteRecords) {
  const normalizedRemote = remoteRecords.map((record) => ({
    id: record.id || buildRemoteRecordId(record),
    timestamp: record.timestamp || new Date().toISOString(),
    fecha: record.fecha,
    diaRutina: record.diaRutina,
    ejercicio: record.ejercicio,
    set: Number(record.set),
    peso: record.peso === "" ? "" : Number(record.peso),
    unidadPeso: record.unidadPeso || "kg",
    repsRealizadas: Number(record.repsRealizadas),
    repsObjetivo: record.repsObjetivo,
    cumplioObjetivo: record.cumplioObjetivo,
    superoObjetivo: record.superoObjetivo,
    notas: record.notas || "",
    synced: true
  }));

  const map = new Map();
  [...state.records, ...normalizedRemote].forEach((record) => {
    map.set(buildLocalDedupKey(record), record);
  });

  state.records = Array.from(map.values()).sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
  persistRecords();
}

async function retryPendingRecords(showFeedback = true) {
  if (!isAppsScriptConfigured() || state.pendingRecords.length === 0) {
    updateDashboardCounts();
    if (showFeedback && !isAppsScriptConfigured()) {
      showToast("Configura la URL del Web App para sincronizar pendientes.", "error");
    }
    return;
  }

  const remaining = [];
  let syncedCount = 0;

  for (const record of state.pendingRecords) {
    const saved = await sendRecordToAppsScript(record);
    if (saved.success) {
      syncedCount += 1;
      const localRecord = state.records.find((item) => item.id === record.id);
      if (localRecord) {
        localRecord.synced = true;
        if (saved.recordId) {
          localRecord.id = saved.recordId;
        }
      }
    } else {
      remaining.push(record);
    }
  }

  state.pendingRecords = remaining;
  persistPendingRecords();
  persistRecords();
  renderHistory();
  populateProgressExerciseSelect();
  renderProgressChart();
  updateDashboardCounts();

  if (showFeedback) {
    if (syncedCount > 0) {
      showToast(`Se sincronizaron ${syncedCount} registros pendientes.`, "success");
    } else {
      showToast("No se pudo sincronizar ningun pendiente en este intento.", "error");
    }
  }
}

function queuePendingRecord(record) {
  const alreadyQueued = state.pendingRecords.some((item) => item.id === record.id);
  if (!alreadyQueued) {
    state.pendingRecords.push(record);
    persistPendingRecords();
  }
}

function renderHistory() {
  const todayRecords = getTodayRecords();

  elements.historyMeta.textContent = todayRecords.length
    ? `${todayRecords.length} registro(s) visibles para ${state.today}.`
    : "Sin registros todavia para la fecha actual.";

  if (!todayRecords.length) {
    elements.historyList.innerHTML = `
      <div class="empty-state">
        Cuando guardes tus sets apareceran aqui con su estado de sincronizacion.
      </div>
    `;
    return;
  }

  elements.historyList.innerHTML = todayRecords.map((record) => `
    <article class="history-item">
      <div class="history-item-header">
        <div>
          <strong>${record.ejercicio}</strong>
          <p>${record.diaRutina}</p>
        </div>
        <button
          class="delete-record-button"
          type="button"
          title="Borrar set"
          aria-label="Borrar set"
          data-delete-record="${record.id || buildRemoteRecordId(record)}"
          ${state.deletingRecordId === (record.id || buildRemoteRecordId(record)) ? "disabled" : ""}
        >
          🗑
        </button>
      </div>
      <div class="meta-line">
        <span class="mini-pill">Set ${record.set}</span>
        <span class="mini-pill">Peso: ${record.peso === "" ? "-" : `${record.peso} ${record.unidadPeso || "kg"}`}</span>
        <span class="mini-pill">Reps: ${record.repsRealizadas}</span>
        <span class="mini-pill">Objetivo: ${record.repsObjetivo}</span>
      </div>
      <div class="meta-line">
        <span class="mini-pill">${record.cumplioObjetivo}</span>
        <span class="mini-pill">${record.superoObjetivo === "Sí" ? "Supero objetivo" : "Sin superar"}</span>
        <span class="mini-pill">${record.synced ? "Sincronizado" : "Pendiente"}</span>
      </div>
      ${record.notas ? `<p class="subtle" style="margin-top:10px;">Notas: ${escapeHtml(record.notas)}</p>` : ""}
    </article>
  `).join("");

  attachHistoryDeleteListeners();
}

async function deleteRecord(recordId) {
  const record = state.records.find((item) => (item.id || buildRemoteRecordId(item)) === recordId);
  if (!record) {
    showToast("No se encontro el registro a borrar.", "error");
    return;
  }

  const confirmed = window.confirm(`¿Borrar el set ${record.set} de ${record.ejercicio}?`);
  if (!confirmed) {
    return;
  }

  state.deletingRecordId = recordId;
  renderHistory();

  if (!record.synced) {
    removeRecordEverywhere(recordId);
    showToast("Set borrado localmente.", "success");
    return;
  }

  const deleteResult = await deleteRecordFromAppsScript(record);

  if (!deleteResult.success) {
    state.deletingRecordId = "";
    renderHistory();
    showToast(deleteResult.message || "No se pudo borrar en Google Sheets.", "error");
    return;
  }

  removeRecordEverywhere(recordId);
  showToast("Set borrado correctamente.", "success");
}

async function deleteRecordFromAppsScript(record) {
  if (!isAppsScriptConfigured()) {
    return { success: false, message: "La URL del Web App no está configurada." };
  }

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        action: "delete",
        recordId: record.id || "",
        fecha: record.fecha,
        diaRutina: record.diaRutina,
        ejercicio: record.ejercicio,
        set: record.set,
        peso: record.peso,
        unidadPeso: record.unidadPeso || "kg",
        repsRealizadas: record.repsRealizadas,
        timestamp: record.timestamp || "",
        notas: record.notas || ""
      })
    });

    if (!response.ok) {
      return { success: false, message: `Error HTTP ${response.status} al borrar.` };
    }

    const result = await response.json();
    return {
      success: Boolean(result.success),
      message: result.message || ""
    };
  } catch (error) {
    console.error("Error borrando en Apps Script:", error);
    return {
      success: false,
      message: "Falló la comunicación con Apps Script al borrar."
    };
  }
}

function removeRecordEverywhere(recordId) {
  state.records = state.records.filter((item) => (item.id || buildRemoteRecordId(item)) !== recordId);
  state.pendingRecords = state.pendingRecords.filter((item) => (item.id || buildRemoteRecordId(item)) !== recordId);
  state.deletingRecordId = "";
  persistRecords();
  persistPendingRecords();
  renderSelectedDay();
  renderHistory();
  populateProgressExerciseSelect();
  renderProgressChart();
  updateDashboardCounts();
}

async function refreshProgressFromServer(showFeedback = true) {
  if (!isAppsScriptConfigured()) {
    if (showFeedback) {
      showToast("Configura la URL del Web App para cargar progreso.", "error");
    }
    return;
  }

  try {
    const url = new URL(APPS_SCRIPT_URL);
    url.searchParams.set("action", "progress");

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error("No se pudo consultar el progreso remoto.");
    }

    const result = await response.json();
    if (!result.success || !Array.isArray(result.records)) {
      throw new Error("Respuesta invalida del progreso.");
    }

    mergeRemoteRecords(result.records);
    populateProgressExerciseSelect();
    renderProgressChart();

    if (showFeedback) {
      showToast("Serie de progreso actualizada.", "success");
    }
  } catch (error) {
    console.error(error);
    if (showFeedback) {
      showToast("No fue posible cargar el progreso remoto.", "error");
    }
  }
}

function populateProgressExerciseSelect() {
  const currentValue = elements.progressExerciseSelect.value;
  const catalog = getExerciseCatalog();
  const overallOptions = Object.keys(PROGRESS_CATEGORY_LABELS).map((category) => {
    return `<option value="overall:${category}">Overall ${PROGRESS_CATEGORY_LABELS[category]}</option>`;
  }).join("");

  const groupedExercises = Object.keys(PROGRESS_CATEGORY_LABELS).map((category) => {
    const options = catalog
      .filter((item) => item.category === category)
      .map((item) => `<option value="exercise:${escapeAttribute(item.name)}">${escapeHtml(item.name)}</option>`)
      .join("");

    if (!options) {
      return "";
    }

    return `<optgroup label="${escapeAttribute(PROGRESS_CATEGORY_LABELS[category])} - Ejercicios">${options}</optgroup>`;
  }).join("");

  elements.progressExerciseSelect.innerHTML = `
    <optgroup label="Resumen por categoría">
      ${overallOptions}
    </optgroup>
    ${groupedExercises}
  `;

  if (!catalog.length) {
    elements.progressExerciseSelect.innerHTML = '<option value="">Sin ejercicios</option>';
    return;
  }

  const validValues = [
    ...Object.keys(PROGRESS_CATEGORY_LABELS).map((category) => `overall:${category}`),
    ...catalog.map((item) => `exercise:${item.name}`)
  ];

  if (validValues.includes(currentValue)) {
    elements.progressExerciseSelect.value = currentValue;
  } else {
    elements.progressExerciseSelect.value = "overall:upper";
  }
}

function renderProgressChart() {
  const selection = parseProgressSelection(elements.progressExerciseSelect.value);
  const metric = elements.progressMetricSelect.value;
  const unit = elements.progressUnitSelect.value;
  const seriesResult = buildProgressSeries(selection, metric, unit);
  const points = seriesResult.points;

  if (!selection || points.length === 0) {
    elements.progressChart.classList.add("hidden");
    elements.progressChartEmpty.classList.remove("hidden");
    elements.progressSummary.textContent = seriesResult.message
      || (selection
        ? "Aún no hay datos suficientes para esa vista."
        : "Selecciona un ejercicio para ver su evolución.");
    return;
  }

  elements.progressChart.classList.remove("hidden");
  elements.progressChartEmpty.classList.add("hidden");
  elements.progressChart.innerHTML = buildChartSvg(points);
  elements.progressSummary.textContent = buildProgressSummary(selection, metric, seriesResult.unitHint || unit, points);
}

function buildProgressSeries(selection, metric, unit) {
  if (!selection) {
    return {
      points: [],
      message: "",
      unitHint: unit
    };
  }

  const records = state.records
    .filter((record) => {
      if (!record.fecha) {
        return false;
      }

      if (selection.type === "overall") {
        if (getProgressCategoryFromRecord(record) !== selection.category) {
          return false;
        }
      } else if (record.ejercicio !== selection.name) {
        return false;
      }

      if (unit === "all") {
        return true;
      }

      return (record.unidadPeso || "kg") === unit;
    })
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  const allSelectionUnits = Array.from(new Set(
    state.records
      .filter((record) => {
        if (selection.type === "overall") {
          return getProgressCategoryFromRecord(record) === selection.category;
        }

        return record.ejercicio === selection.name;
      })
      .map((record) => record.unidadPeso || "kg")
  ));

  if ((metric === "weightMax" || metric === "volume") && unit === "all" && allSelectionUnits.length > 1) {
    return {
      points: [],
      message: "Selecciona kg o lb para esa métrica y evitar mezclar unidades.",
      unitHint: unit
    };
  }

  const grouped = new Map();

  records.forEach((record) => {
    const key = record.fecha;
    const weight = record.peso === "" ? 0 : Number(record.peso);
    const reps = Number(record.repsRealizadas) || 0;
    const volume = weight * reps;

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }

    grouped.get(key).push({
      weight: weight,
      reps: reps,
      volume: volume
    });
  });

  const points = Array.from(grouped.entries()).map(([date, values]) => {
    let value = 0;

    if (metric === "repsMax") {
      value = Math.max(...values.map((item) => item.reps));
    } else if (metric === "volume") {
      value = values.reduce((sum, item) => sum + item.volume, 0);
    } else {
      value = Math.max(...values.map((item) => item.weight));
    }

    return {
      date,
      value: Number(value.toFixed(2))
    };
  }).filter((point) => Number.isFinite(point.value));

  return {
    points,
    message: "",
    unitHint: unit === "all" && allSelectionUnits.length === 1 ? allSelectionUnits[0] : unit
  };
}

function buildProgressSummary(selection, metric, unit, points) {
  const metricLabel = getMetricLabel(metric);
  const first = points[0];
  const last = points[points.length - 1];
  const delta = Number((last.value - first.value).toFixed(2));
  const deltaLabel = delta === 0 ? "sin cambio neto" : `${delta > 0 ? "+" : ""}${delta}`;
  const unitLabel = metric === "repsMax" ? "" : unit === "all" ? " (todas las unidades)" : ` (${unit})`;

  return `${selection.label}: ${metricLabel}${unitLabel} actual ${formatMetricValue(metric, last.value, unit)}. Cambio acumulado ${deltaLabel} desde ${first.date}.`;
}

function buildChartSvg(points) {
  const width = 760;
  const height = 300;
  const padding = { top: 24, right: 24, bottom: 46, left: 48 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const values = points.map((point) => point.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const safeMin = minValue === maxValue ? Math.max(0, minValue - 1) : minValue;
  const safeMax = minValue === maxValue ? maxValue + 1 : maxValue;
  const valueRange = safeMax - safeMin || 1;

  const coords = points.map((point, index) => {
    const x = padding.left + (points.length === 1 ? innerWidth / 2 : (innerWidth / (points.length - 1)) * index);
    const y = padding.top + innerHeight - ((point.value - safeMin) / valueRange) * innerHeight;
    return { ...point, x, y };
  });

  const linePath = coords.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${padding.top + innerHeight} L ${coords[0].x} ${padding.top + innerHeight} Z`;
  const yTicks = 4;
  const yGrid = Array.from({ length: yTicks + 1 }, (_, index) => {
    const ratio = index / yTicks;
    const y = padding.top + innerHeight - ratio * innerHeight;
    const value = safeMin + ratio * valueRange;
    return `
      <line class="chart-grid-line" x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}"></line>
      <text class="chart-axis-text" x="${padding.left - 10}" y="${y + 4}" text-anchor="end">${formatAxisValue(value)}</text>
    `;
  }).join("");

  const xLabels = coords.map((point) => `
    <text class="chart-axis-text" x="${point.x}" y="${height - 16}" text-anchor="middle">${formatDateShort(point.date)}</text>
  `).join("");

  const pointsSvg = coords.map((point) => `
    <circle class="chart-point" cx="${point.x}" cy="${point.y}" r="5"></circle>
    <text class="chart-point-label" x="${point.x}" y="${point.y - 12}" text-anchor="middle">${formatAxisValue(point.value)}</text>
  `).join("");

  return `
    ${yGrid}
    <line class="chart-grid-line" x1="${padding.left}" y1="${padding.top + innerHeight}" x2="${width - padding.right}" y2="${padding.top + innerHeight}"></line>
    <path class="chart-area" d="${areaPath}"></path>
    <path class="chart-line" d="${linePath}"></path>
    ${pointsSvg}
    ${xLabels}
  `;
}

function updateDashboardCounts() {
  const todayRecords = getTodayRecords();
  elements.completedSetsCount.textContent = String(todayRecords.length);
  elements.pendingCount.textContent = String(state.pendingRecords.length);
}

function getTodayRecords() {
  return state.records.filter((record) => record.fecha === state.today);
}

function getCompletedSetsCount(day, exercise) {
  return getTodayRecords().filter((record) => {
    return record.diaRutina === `${day.label} - ${day.title}` && record.ejercicio === exercise.name;
  }).length;
}

function getSelectedDay() {
  return routineDays.find((day) => day.id === state.selectedDayId) || routineDays[0];
}

function persistRecords() {
  localStorage.setItem(STORAGE_KEYS.records, JSON.stringify(state.records));
}

function persistPendingRecords() {
  localStorage.setItem(STORAGE_KEYS.pending, JSON.stringify(state.pendingRecords));
}

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.error(`No se pudo leer ${key}:`, error);
    return fallback;
  }
}

function getEventElement(event) {
  if (event.target instanceof Element) {
    return event.target;
  }

  if (event.target && event.target.parentElement) {
    return event.target.parentElement;
  }

  return null;
}

function attachDayCardListeners() {
  elements.dayGrid.querySelectorAll("[data-day-id]").forEach((button) => {
    button.onclick = (event) => {
      event.stopPropagation();
      state.selectedDayId = Number(button.dataset.dayId);
      localStorage.setItem(STORAGE_KEYS.selectedDay, String(state.selectedDayId));
      renderDayCards();
      renderSelectedDay();
    };
  });
}

function attachExerciseButtonListeners() {
  elements.exerciseList.querySelectorAll("[data-register-exercise]").forEach((button) => {
    button.onclick = (event) => {
      event.stopPropagation();
      const dayId = Number(button.dataset.dayId);
      const exerciseIndex = Number(button.dataset.exerciseIndex);
      openRegisterModal(dayId, exerciseIndex);
    };
  });
}

function attachExerciseImageFallbacks() {
  elements.exerciseList.querySelectorAll(".exercise-image").forEach((image) => {
    image.onerror = () => {
      const exerciseName = image.dataset.exerciseName || "Ejercicio";
      image.src = buildPlaceholderImage(exerciseName);
      image.onerror = null;
    };
  });
}

function attachHistoryDeleteListeners() {
  elements.historyList.querySelectorAll("[data-delete-record]").forEach((button) => {
    button.onclick = (event) => {
      event.stopPropagation();
      deleteRecord(button.dataset.deleteRecord);
    };
  });
}

function showToast(message, type = "success") {
  clearTimeout(showToast.timeoutId);
  elements.toast.textContent = message;
  elements.toast.className = `toast visible ${type}`;

  showToast.timeoutId = setTimeout(() => {
    elements.toast.className = "toast";
  }, 3200);
}

function generateRecordId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createExercise(name, setsLabel) {
  const parsed = parseSetsLabel(setsLabel);
  return {
    name,
    setsLabel,
    targetSets: parsed.targetSets,
    targetReps: parsed.targetReps,
    image: EXERCISE_MEDIA[name] || buildPlaceholderImage(name)
  };
}

function parseSetsLabel(label) {
  const [setsPart, repsPart = ""] = label.split("x");
  return {
    targetSets: Number.parseInt(setsPart, 10) || 1,
    targetReps: repsPart.trim() || "Libre"
  };
}

function buildPlaceholderImage(name) {
  return `https://placehold.co/600x400/101820/EAF2F9?text=${encodeURIComponent(name)}`;
}

function getAllExerciseNames() {
  const routineExercises = routineDays.flatMap((day) => day.exercises.map((exercise) => exercise.name));
  const recordExercises = state.records.map((record) => record.ejercicio).filter(Boolean);
  return Array.from(new Set([...routineExercises, ...recordExercises])).sort((a, b) => a.localeCompare(b, "es"));
}

function getExerciseCatalog() {
  const catalogMap = new Map();

  routineDays.forEach((day) => {
    if (!day.progressCategory) {
      return;
    }

    day.exercises.forEach((exercise) => {
      if (!catalogMap.has(exercise.name)) {
        catalogMap.set(exercise.name, {
          name: exercise.name,
          category: day.progressCategory
        });
      }
    });
  });

  return Array.from(catalogMap.values()).sort((a, b) => a.name.localeCompare(b.name, "es"));
}

function parseProgressSelection(value) {
  if (!value) {
    return null;
  }

  if (value.startsWith("overall:")) {
    const category = value.slice("overall:".length);
    return {
      type: "overall",
      category,
      label: `Overall ${PROGRESS_CATEGORY_LABELS[category] || category}`
    };
  }

  if (value.startsWith("exercise:")) {
    const name = value.slice("exercise:".length);
    return {
      type: "exercise",
      name,
      category: getExerciseCategoryByName(name),
      label: name
    };
  }

  return null;
}

function getExerciseCategoryByName(exerciseName) {
  const day = routineDays.find((item) => {
    return item.exercises.some((exercise) => exercise.name === exerciseName);
  });

  return day && day.progressCategory ? day.progressCategory : "others";
}

function getProgressCategoryFromRecord(record) {
  const byName = getExerciseCategoryByName(record.ejercicio);
  if (byName) {
    return byName;
  }

  const text = String(record.diaRutina || "").toLowerCase();
  if (text.includes("upper")) {
    return "upper";
  }

  if (text.includes("lower")) {
    return "lower";
  }

  return "others";
}

function normalizeOptionalNumber(value) {
  if (value === "") {
    return "";
  }

  return Number(value);
}

function getTodayString() {
  const now = new Date();
  const localOffset = now.getTimezoneOffset();
  const normalizedDate = new Date(now.getTime() - localOffset * 60000);
  return normalizedDate.toISOString().slice(0, 10);
}

function isAppsScriptConfigured() {
  return APPS_SCRIPT_URL && !APPS_SCRIPT_URL.includes("PASTE_YOUR_WEB_APP_URL_HERE");
}

function capitalizeText(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function buildLocalDedupKey(record) {
  return [
    record.fecha,
    record.diaRutina,
    record.ejercicio,
    record.set,
    record.repsRealizadas,
    record.peso,
    record.unidadPeso || "kg",
    record.notas
  ].join("|");
}

function buildRemoteRecordId(record) {
  return `remote-${encodeURIComponent(buildLocalDedupKey(record))}`;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function escapeAttribute(text) {
  return String(text).replace(/"/g, "&quot;");
}

function getMetricLabel(metric) {
  if (metric === "repsMax") {
    return "reps máximas";
  }

  if (metric === "volume") {
    return "volumen";
  }

  return "peso máximo";
}

function formatMetricValue(metric, value, unit = "kg") {
  if (metric === "volume") {
    return `${formatAxisValue(value)} ${unit === "all" ? "u-reps" : `${unit}-reps`}`;
  }

  if (metric === "repsMax") {
    return `${formatAxisValue(value)} reps`;
  }

  return `${formatAxisValue(value)} ${unit === "all" ? "u" : unit}`;
}

function formatAxisValue(value) {
  return Number(value).toLocaleString("es-MX", {
    maximumFractionDigits: 2
  });
}

function formatDateShort(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat("es-MX", {
    month: "short",
    day: "numeric"
  }).format(date);
}
