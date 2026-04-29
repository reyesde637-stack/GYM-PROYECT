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

const EXERCISE_LIBRARY = {
  "Press inclinado barra": {
    image: "./assets/exercises/press-inclinado-barra.png",
    guideUrl: "https://www.simplyfitness.com/es/pages/incline-barbell-bench-press",
    guideLabel: "Simply Fitness"
  },
  "Jalon al pecho amplio": {
    image: "./assets/exercises/jalon-pecho-amplio.png",
    guideUrl: "https://www.simplyfitness.com/es/pages/wide-grip-pulldown",
    guideLabel: "Simply Fitness"
  },
  "Press banca plano": {
    image: "./assets/exercises/press-banca-plano.png",
    guideUrl: "https://www.simplyfitness.com/es/pages/barbell-bench-press",
    guideLabel: "Simply Fitness"
  },
  "Remo con barra": {
    image: "./assets/exercises/remo-con-barra.png",
    guideUrl: "https://www.simplyfitness.com/es/pages/barbell-row",
    guideLabel: "Simply Fitness"
  },
  "Elevaciones laterales": {
    image: "./assets/exercises/elevaciones-laterales.png",
    guideUrl: "https://www.simplyfitness.com/es/pages/dumbbell-lateral-raise",
    guideLabel: "Simply Fitness"
  },
  "Curl biceps": {
    image: "./assets/exercises/curl-biceps.png",
    guideUrl: "https://www.simplyfitness.com/es/pages/barbell-curl",
    guideLabel: "Simply Fitness"
  },
  "Triceps cuerda": {
    image: "./assets/exercises/triceps-cuerda.png",
    guideUrl: "https://www.simplyfitness.com/es/pages/cable-rope-puschdown",
    guideLabel: "Simply Fitness"
  },
  "Sentadilla": {
    image: "./assets/exercises/sentadilla.png",
    guideUrl: "https://www.simplyfitness.com/es/pages/squat",
    guideLabel: "Simply Fitness"
  },
  "Peso muerto rumano": {
    image: "./assets/exercises/peso-muerto-rumano.png",
    guideUrl: "https://www.simplyfitness.com/es/pages/barbell-stiff-leg-deadlift",
    guideLabel: "Simply Fitness"
  },
  "Prensa": {
    image: "./assets/exercises/prensa.png",
    guideUrl: "https://www.simplyfitness.com/es/pages/leg-press",
    guideLabel: "Simply Fitness"
  },
  "Curl femoral": {
    image: "./assets/exercises/curl-femoral.png",
    guideUrl: "https://www.simplyfitness.com/es/pages/lying-leg-curl",
    guideLabel: "Simply Fitness"
  },
  "Elevaciones de piernas": {
    image: "./assets/exercises/elevaciones-piernas.png",
    guideUrl: "https://www.simplyfitness.com/es/pages/hanging-leg-raise",
    guideLabel: "Simply Fitness"
  },
  "Plancha": {
    image: "./assets/exercises/plancha.png",
    guideUrl: "https://www.simplyfitness.com/es/pages/plank",
    guideLabel: "Simply Fitness"
  },
  "Press hombro": {
    image: "./assets/exercises/press-hombro.png",
    guideUrl: "https://www.simplyfitness.com/es/pages/seated-barbell-shoulder-press",
    guideLabel: "Simply Fitness"
  },
  "Jalon al pecho": {
    image: "./assets/exercises/jalon-pecho.png",
    guideUrl: "https://www.simplyfitness.com/es/pages/close-grip-pulldown",
    guideLabel: "Simply Fitness"
  },
  "Remo maquina": {
    image: "./assets/exercises/remo-maquina.png",
    guideUrl: "https://www.simplyfitness.com/es/pages/seated-cable-row",
    guideLabel: "Simply Fitness"
  },
  "Face pull": {
    image: "./assets/exercises/face-pull.png",
    guideUrl: "https://www.simplyfitness.com/es/pages/high-cable-rear-delt-fly",
    guideLabel: "Simply Fitness"
  },
  "Curl martillo": {
    image: "./assets/exercises/curl-martillo.png",
    guideUrl: "https://www.simplyfitness.com/es/pages/hammer-curl",
    guideLabel: "Simply Fitness"
  },
  "Triceps": {
    image: "./assets/exercises/triceps-cuerda.png",
    guideUrl: "https://www.simplyfitness.com/es/pages/cable-rope-puschdown",
    guideLabel: "Simply Fitness"
  },
  "Hip thrust": {
    image: "./assets/exercises/hip-thrust.png",
    guideUrl: "https://www.simplyfitness.com/es/pages/barbell-hip-thrust",
    guideLabel: "Simply Fitness"
  },
  "Zancadas": {
    image: "./assets/exercises/zancadas.png",
    guideUrl: "https://www.simplyfitness.com/es/pages/lunge",
    guideLabel: "Simply Fitness"
  },
  "Gemelos": {
    image: "./assets/exercises/gemelos.png",
    guideUrl: "https://www.simplyfitness.com/es/pages/standing-calf-raise",
    guideLabel: "Simply Fitness"
  },
  "Ab wheel / crunch": {
    image: buildPlaceholderImage("Ab wheel / crunch"),
    guideUrl: "https://workoutlabs.com/exercise-guide/ab-roller-wheel-rollout/",
    guideLabel: "WorkoutLabs"
  },
  "Cardio 20-30 min": {
    image: buildPlaceholderImage("Cardio 20-30 min"),
    guideUrl: "",
    guideLabel: ""
  },
  "Abdomen + vacuum": {
    image: "./assets/exercises/abdomen-vacuum.svg",
    guideUrl: "https://workoutlabs.com/exercise-guide/seated-vacuum/",
    guideLabel: "WorkoutLabs"
  }
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
  deletingRecordId: "",
  deleteCandidateId: "",
  calendarViewDate: getMonthStart(new Date()),
  activeSummaryDate: "",
  deferredInstallPrompt: null,
  isOnline: navigator.onLine
};

const elements = {};

document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  bindEvents();
  registerServiceWorker();
  setupPwaExperience();
  renderCurrentDate();
  renderDayCards();
  renderSelectedDay();
  renderHistory();
  renderCalendar();
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
  elements.connectionStatus = document.getElementById("connection-status");
  elements.installAppBtn = document.getElementById("install-app-btn");
  elements.retrySyncBtn = document.getElementById("retry-sync-btn");
  elements.openCalendarBtn = document.getElementById("open-calendar-btn");
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
  elements.calendarModal = document.getElementById("calendar-modal");
  elements.calendarCloseBtn = document.getElementById("calendar-close-btn");
  elements.calendarPrevBtn = document.getElementById("calendar-prev-btn");
  elements.calendarNextBtn = document.getElementById("calendar-next-btn");
  elements.calendarMonthLabel = document.getElementById("calendar-month-label");
  elements.calendarGrid = document.getElementById("calendar-grid");
  elements.dayReportModal = document.getElementById("day-report-modal");
  elements.dayReportCloseBtn = document.getElementById("day-report-close-btn");
  elements.dayReportContent = document.getElementById("day-report-content");
  elements.modal = document.getElementById("set-modal");
  elements.setForm = document.getElementById("set-form");
  elements.closeModalBtn = document.getElementById("close-modal-btn");
  elements.cancelModalBtn = document.getElementById("cancel-modal-btn");
  elements.saveSetBtn = document.getElementById("save-set-btn");
  elements.deleteModal = document.getElementById("delete-modal");
  elements.deleteModalText = document.getElementById("delete-modal-text");
  elements.deleteModalCancelBtn = document.getElementById("delete-modal-cancel-btn");
  elements.deleteModalConfirmBtn = document.getElementById("delete-modal-confirm-btn");
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
  elements.goalAutoSummary = document.getElementById("goal-auto-summary");
  elements.notesInput = document.getElementById("notes-input");
}

function bindEvents() {
  elements.retrySyncBtn.addEventListener("click", () => retryPendingRecords(true));
  elements.installAppBtn.addEventListener("click", installPwa);
  elements.openCalendarBtn.addEventListener("click", openCalendarModal);
  elements.refreshHistoryBtn.addEventListener("click", refreshHistoryFromServer);
  elements.refreshProgressBtn.addEventListener("click", () => refreshProgressFromServer(true));
  elements.progressExerciseSelect.addEventListener("change", renderProgressChart);
  elements.progressMetricSelect.addEventListener("change", renderProgressChart);
  elements.progressUnitSelect.addEventListener("change", renderProgressChart);
  elements.calendarCloseBtn.addEventListener("click", closeCalendarModal);
  elements.calendarPrevBtn.addEventListener("click", () => changeCalendarMonth(-1));
  elements.calendarNextBtn.addEventListener("click", () => changeCalendarMonth(1));
  elements.dayReportCloseBtn.addEventListener("click", closeDayReportModal);
  elements.weightUnitInput.addEventListener("change", () => {
    localStorage.setItem(STORAGE_KEYS.preferredWeightUnit, elements.weightUnitInput.value);
  });
  elements.repsDoneInput.addEventListener("input", updateGoalStatusFromInputs);
  elements.closeModalBtn.addEventListener("click", closeModal);
  elements.cancelModalBtn.addEventListener("click", closeModal);
  elements.deleteModalCancelBtn.addEventListener("click", closeDeleteModal);
  elements.deleteModalConfirmBtn.addEventListener("click", confirmDeleteRecord);
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
      openDeleteModal(deleteButton.dataset.deleteRecord);
      return;
    }

    if (target.matches("[data-close-modal='true']")) {
      closeModal();
      closeDeleteModal();
      closeCalendarModal();
      closeDayReportModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !elements.modal.classList.contains("hidden")) {
      closeModal();
      return;
    }

    if (event.key === "Escape" && !elements.deleteModal.classList.contains("hidden")) {
      closeDeleteModal();
      return;
    }

    if (event.key === "Escape" && !elements.dayReportModal.classList.contains("hidden")) {
      closeDayReportModal();
      return;
    }

    if (event.key === "Escape" && !elements.calendarModal.classList.contains("hidden")) {
      closeCalendarModal();
    }
  });
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("./service-worker.js");
    } catch (error) {
      console.error("No se pudo registrar el service worker:", error);
    }
  });
}

function setupPwaExperience() {
  updateConnectionStatus();
  updateInstallButtonVisibility();

  window.addEventListener("online", handleWentOnline);
  window.addEventListener("offline", handleWentOffline);

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    state.deferredInstallPrompt = event;
    updateInstallButtonVisibility();
  });

  window.addEventListener("appinstalled", () => {
    state.deferredInstallPrompt = null;
    updateInstallButtonVisibility();
    showToast("La app quedó instalada en tu dispositivo.", "success");
  });
}

function updateConnectionStatus() {
  state.isOnline = navigator.onLine;
  elements.connectionStatus.textContent = state.isOnline
    ? "Online y listo para sincronizar"
    : "Modo offline activo";
  elements.connectionStatus.className = `connection-status ${state.isOnline ? "online" : "offline"}`;
}

function updateInstallButtonVisibility() {
  if (state.deferredInstallPrompt) {
    elements.installAppBtn.classList.remove("hidden");
    return;
  }

  elements.installAppBtn.classList.add("hidden");
}

async function installPwa() {
  if (!state.deferredInstallPrompt) {
    showToast("Abre la app desde el navegador del teléfono y usa instalar o agregar a pantalla de inicio.", "error");
    return;
  }

  state.deferredInstallPrompt.prompt();
  const choiceResult = await state.deferredInstallPrompt.userChoice;
  state.deferredInstallPrompt = null;
  updateInstallButtonVisibility();

  if (choiceResult && choiceResult.outcome === "accepted") {
    showToast("Instalación iniciada.", "success");
  }
}

function handleWentOnline() {
  updateConnectionStatus();
  retryPendingRecords(false);
  refreshHistoryFromServer(false);
  refreshProgressFromServer(false);
  showToast("Conexión restablecida. Intentando sincronizar pendientes.", "success");
}

function handleWentOffline() {
  updateConnectionStatus();
  showToast("Modo offline activo. Tus sets se guardarán como pendientes.", "error");
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

function openCalendarModal() {
  renderCalendar();
  elements.calendarModal.classList.remove("hidden");
  elements.calendarModal.setAttribute("aria-hidden", "false");
}

function closeCalendarModal() {
  elements.calendarModal.classList.add("hidden");
  elements.calendarModal.setAttribute("aria-hidden", "true");
}

function openDayReportModal(dateString) {
  state.activeSummaryDate = dateString;
  elements.dayReportContent.innerHTML = buildDayReportMarkup(dateString);
  elements.dayReportModal.classList.remove("hidden");
  elements.dayReportModal.setAttribute("aria-hidden", "false");
}

function closeDayReportModal() {
  state.activeSummaryDate = "";
  elements.dayReportModal.classList.add("hidden");
  elements.dayReportModal.setAttribute("aria-hidden", "true");
}

function changeCalendarMonth(offset) {
  const nextDate = new Date(state.calendarViewDate);
  nextDate.setMonth(nextDate.getMonth() + offset);
  state.calendarViewDate = getMonthStart(nextDate);
  renderCalendar();
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

function renderCalendar() {
  const monthFormatter = new Intl.DateTimeFormat("es-MX", {
    month: "long",
    year: "numeric"
  });
  const monthStart = getMonthStart(state.calendarViewDate);
  const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
  const offset = (monthStart.getDay() + 6) % 7;
  const gridStart = new Date(monthStart);
  gridStart.setDate(monthStart.getDate() - offset);
  const recordCounts = getRecordCountsByDate();

  elements.calendarMonthLabel.textContent = capitalizeText(monthFormatter.format(monthStart));
  elements.calendarGrid.innerHTML = Array.from({ length: 42 }, (_, index) => {
    const cellDate = new Date(gridStart);
    cellDate.setDate(gridStart.getDate() + index);
    const dateString = formatDateInputValue(cellDate);
    const isCurrentMonth = cellDate.getMonth() === monthStart.getMonth();
    const isToday = dateString === state.today;
    const count = recordCounts.get(dateString) || 0;
    const isChecked = count > 0;

    return `
      <button
        class="calendar-day ${isCurrentMonth ? "" : "muted"} ${isToday ? "today" : ""} ${isChecked ? "checked" : ""}"
        type="button"
        data-calendar-date="${dateString}"
      >
        <span class="calendar-day-number">${cellDate.getDate()}</span>
        ${isChecked ? `<span class="calendar-day-check">✓</span>` : ""}
        ${isChecked ? `<span class="calendar-day-count">${count} set${count === 1 ? "" : "s"}</span>` : ""}
      </button>
    `;
  }).join("");

  attachCalendarDayListeners();
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
          <div class="exercise-meta">
            <div class="status-row">
            ${completedSets > 0 ? '<span class="status-chip success">Con progreso registrado</span>' : '<span class="status-chip pending">Sin sets guardados</span>'}
            </div>
            ${exercise.guideUrl ? `
              <a
                class="exercise-guide-link"
                href="${exercise.guideUrl}"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver guía
                <span>${escapeHtml(exercise.guideLabel || "Fuente")}</span>
              </a>
            ` : ""}
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
  elements.goalHitInput.value = "No";
  elements.goalOverInput.value = "No";
  elements.notesInput.value = "";
  updateGoalStatusFromInputs();

  elements.modal.classList.remove("hidden");
  elements.modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  state.activeExercise = null;
  elements.setForm.reset();
  elements.modal.classList.add("hidden");
  elements.modal.setAttribute("aria-hidden", "true");
}

function openDeleteModal(recordId) {
  const record = state.records.find((item) => (item.id || buildRemoteRecordId(item)) === recordId);
  if (!record) {
    showToast("No se encontro el registro a borrar.", "error");
    return;
  }

  state.deleteCandidateId = recordId;
  elements.deleteModalText.textContent = `¿Seguro que quieres quitar el set ${record.set} de ${record.ejercicio}? Esta acción también intentará borrarlo en Google Sheets.`;
  elements.deleteModal.classList.remove("hidden");
  elements.deleteModal.setAttribute("aria-hidden", "false");
}

function closeDeleteModal() {
  state.deleteCandidateId = "";
  elements.deleteModal.classList.add("hidden");
  elements.deleteModal.setAttribute("aria-hidden", "true");
}

function updateGoalStatusFromInputs() {
  const repsDone = Number(elements.repsDoneInput.value);
  const targetRange = parseRepRange(elements.repsTargetInput.value);

  if (!Number.isFinite(repsDone) || repsDone < 0 || !targetRange) {
    elements.goalHitInput.value = "No";
    elements.goalOverInput.value = "No";
    elements.goalAutoSummary.textContent = "Escribe tus reps y el estado se calculará automáticamente.";
    return;
  }

  const hitGoal = repsDone >= targetRange.min;
  const overGoal = repsDone > targetRange.max;

  elements.goalHitInput.value = hitGoal ? "Sí" : "No";
  elements.goalOverInput.value = overGoal ? "Sí" : "No";

  if (overGoal) {
    elements.goalAutoSummary.textContent = `Superaste el rango objetivo (${targetRange.label}) con ${repsDone} reps.`;
    return;
  }

  if (hitGoal) {
    elements.goalAutoSummary.textContent = `Cumpliste el rango objetivo (${targetRange.label}) con ${repsDone} reps.`;
    return;
  }

  const missing = Math.max(0, targetRange.min - repsDone);
  elements.goalAutoSummary.textContent = `Te faltaron ${missing} rep${missing === 1 ? "" : "s"} para llegar al mínimo del rango (${targetRange.label}).`;
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

  const existingRecord = findExistingSetRecord(payload);
  const nextRecordId = existingRecord ? (existingRecord.id || existingRecord.recordId || "") : "";

  // Guardamos primero en local para no perder el dato aunque falle el envio remoto.
  const localRecord = {
    id: nextRecordId || generateRecordId(),
    timestamp: new Date().toISOString(),
    synced: false,
    ...payload
  };

  upsertLocalRecord(localRecord, existingRecord);
  removePendingRecord(localRecord.id);
  persistRecords();
  closeModal();
  renderSelectedDay();
  renderHistory();
  refreshCalendarAndSummaryViews();
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
    refreshCalendarAndSummaryViews();
    updateDashboardCounts();
    showToast(existingRecord ? "Set reemplazado correctamente." : "Set guardado correctamente en Google Sheets.", "success");
    return;
  }

  queuePendingRecord(localRecord);
  renderHistory();
  renderProgressChart();
  refreshCalendarAndSummaryViews();
  updateDashboardCounts();
  showToast(existingRecord ? "No se pudo reemplazar en Sheets. El cambio quedó guardado localmente para reintento." : "No se pudo enviar. El registro quedo guardado localmente para reintento.", "error");
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

  if (!navigator.onLine) {
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

async function refreshHistoryFromServer(showFeedback = true) {
  if (!isAppsScriptConfigured()) {
    if (showFeedback) {
      showToast("Primero configura la URL del Web App en script.js.", "error");
    }
    return;
  }

  if (!navigator.onLine) {
    if (showFeedback) {
      showToast("Estás offline. Mostrando el historial guardado localmente.", "error");
    }
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
    if (showFeedback) {
      showToast("Historial actualizado desde Google Sheets.", "success");
    }
  } catch (error) {
    console.error(error);
    if (showFeedback) {
      showToast("No fue posible actualizar el historial remoto.", "error");
    }
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
  refreshCalendarAndSummaryViews();
}

async function retryPendingRecords(showFeedback = true) {
  if (!isAppsScriptConfigured() || state.pendingRecords.length === 0) {
    updateDashboardCounts();
    if (showFeedback && !isAppsScriptConfigured()) {
      showToast("Configura la URL del Web App para sincronizar pendientes.", "error");
    }
    return;
  }

  if (!navigator.onLine) {
    if (showFeedback) {
      showToast("Sin internet. Los sets seguirán como pendientes hasta reconectar.", "error");
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
  refreshCalendarAndSummaryViews();
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

async function confirmDeleteRecord() {
  const recordId = state.deleteCandidateId;
  closeDeleteModal();

  if (!recordId) {
    return;
  }

  await deleteRecord(recordId);
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
        repsObjetivo: record.repsObjetivo || "",
        cumplioObjetivo: record.cumplioObjetivo || "No",
        superoObjetivo: record.superoObjetivo || "No",
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
  refreshCalendarAndSummaryViews();
  updateDashboardCounts();
}

async function refreshProgressFromServer(showFeedback = true) {
  if (!isAppsScriptConfigured()) {
    if (showFeedback) {
      showToast("Configura la URL del Web App para cargar progreso.", "error");
    }
    return;
  }

  if (!navigator.onLine) {
    if (showFeedback) {
      showToast("Estás offline. El progreso visible viene del almacenamiento local.", "error");
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
  const setNumbers = getTodayRecords().filter((record) => {
    return record.diaRutina === `${day.label} - ${day.title}` && record.ejercicio === exercise.name;
  }).map((record) => Number(record.set));

  return new Set(setNumbers).size;
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
      openDeleteModal(button.dataset.deleteRecord);
    };
  });
}

function attachCalendarDayListeners() {
  elements.calendarGrid.querySelectorAll("[data-calendar-date]").forEach((button) => {
    button.onclick = () => {
      const dateString = button.dataset.calendarDate;
      const count = getRecordsForDate(dateString).length;
      if (!count) {
        showToast("Ese día no tiene sets registrados todavía.", "error");
        return;
      }

      closeCalendarModal();
      openDayReportModal(dateString);
    };
  });
}

function refreshCalendarAndSummaryViews() {
  if (elements.calendarGrid) {
    renderCalendar();
  }

  if (state.activeSummaryDate && elements.dayReportContent) {
    elements.dayReportContent.innerHTML = buildDayReportMarkup(state.activeSummaryDate);
  }
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

function parseRepRange(targetText) {
  const numbers = String(targetText || "").match(/\d+(?:\.\d+)?/g);
  if (!numbers || numbers.length === 0) {
    return null;
  }

  const parsed = numbers.map((value) => Number(value)).filter((value) => Number.isFinite(value));
  if (!parsed.length) {
    return null;
  }

  return {
    min: parsed[0],
    max: parsed.length > 1 ? parsed[1] : parsed[0],
    label: String(targetText || "").trim()
  };
}

function createExercise(name, setsLabel) {
  const parsed = parseSetsLabel(setsLabel);
  const libraryEntry = EXERCISE_LIBRARY[name] || {};
  return {
    name,
    setsLabel,
    targetSets: parsed.targetSets,
    targetReps: parsed.targetReps,
    image: libraryEntry.image || buildPlaceholderImage(name),
    guideUrl: libraryEntry.guideUrl || "",
    guideLabel: libraryEntry.guideLabel || ""
  };
}

function findExistingSetRecord(payload) {
  return state.records.find((record) => {
    return record.fecha === payload.fecha
      && record.diaRutina === payload.diaRutina
      && record.ejercicio === payload.ejercicio
      && Number(record.set) === Number(payload.set);
  }) || null;
}

function upsertLocalRecord(record, existingRecord) {
  if (!existingRecord) {
    state.records.unshift(record);
    return;
  }

  state.records = state.records.map((item) => {
    const itemId = item.id || buildRemoteRecordId(item);
    const existingId = existingRecord.id || buildRemoteRecordId(existingRecord);
    return itemId === existingId ? record : item;
  });

  state.records.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

function removePendingRecord(recordId) {
  if (!recordId) {
    return;
  }

  state.pendingRecords = state.pendingRecords.filter((item) => (item.id || buildRemoteRecordId(item)) !== recordId);
  persistPendingRecords();
}

function parseSetsLabel(label) {
  const [setsPart, repsPart = ""] = label.split("x");
  return {
    targetSets: Number.parseInt(setsPart, 10) || 1,
    targetReps: repsPart.trim() || "Libre"
  };
}

function buildPlaceholderImage(name) {
  const label = String(name || "Ejercicio")
    .replace(/[&<>"']/g, "")
    .slice(0, 42);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
      <defs>
        <linearGradient id="bg" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="#101820"/>
          <stop offset="100%" stop-color="#1c2733"/>
        </linearGradient>
      </defs>
      <rect width="600" height="400" rx="28" fill="url(#bg)"/>
      <circle cx="470" cy="88" r="64" fill="#c7ff6b" opacity="0.12"/>
      <circle cx="112" cy="302" r="88" fill="#58adff" opacity="0.1"/>
      <text x="50%" y="46%" fill="#edf2f7" font-family="Arial, sans-serif" font-size="34" font-weight="700" text-anchor="middle">
        Gym Tracker
      </text>
      <text x="50%" y="58%" fill="#9ba9bb" font-family="Arial, sans-serif" font-size="22" text-anchor="middle">
        ${label}
      </text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function getRecordsForDate(dateString) {
  return state.records
    .filter((record) => record.fecha === dateString)
    .sort((a, b) => new Date(a.timestamp || `${a.fecha}T00:00:00`).getTime() - new Date(b.timestamp || `${b.fecha}T00:00:00`).getTime());
}

function getRecordCountsByDate() {
  const map = new Map();

  state.records.forEach((record) => {
    if (!record.fecha) {
      return;
    }

    map.set(record.fecha, (map.get(record.fecha) || 0) + 1);
  });

  return map;
}

function buildDayReportMarkup(dateString) {
  const records = getRecordsForDate(dateString);
  if (!records.length) {
    return `<div class="empty-state">No hay registros disponibles para esa fecha.</div>`;
  }

  const analysis = analyzeDayRecords(records);

  return `
    <div class="day-report-hero">
      <div>
        <h4>${formatLongDate(dateString)}</h4>
        <p>${analysis.totalSets} sets · ${analysis.uniqueExercises.length} ejercicio(s) · ${analysis.firstTime}${analysis.lastTime && analysis.lastTime !== analysis.firstTime ? ` a ${analysis.lastTime}` : ""}</p>
      </div>
      <div class="day-report-badge">
        <strong>${analysis.estimatedCalories}</strong>
        <span>kcal estimadas</span>
      </div>
    </div>

    <div class="day-report-metrics">
      <div class="report-metric-card">
        <span>Cumplimiento</span>
        <strong>${analysis.goalRate}%</strong>
      </div>
      <div class="report-metric-card">
        <span>Volumen total</span>
        <strong>${formatAxisValue(analysis.totalVolume)}</strong>
      </div>
      <div class="report-metric-card">
        <span>Duración estimada</span>
        <strong>${analysis.estimatedMinutes} min</strong>
      </div>
    </div>

    <div class="report-section">
      <h5>Puntos fuertes</h5>
      <ul class="report-list">
        ${analysis.strengths.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </div>

    <div class="report-section">
      <h5>Puntos débiles</h5>
      <ul class="report-list">
        ${analysis.weaknesses.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </div>

    <div class="report-section">
      <h5>Orden de ejercicios</h5>
      <ol class="report-sequence">
        ${analysis.exerciseSequence.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ol>
    </div>

    <div class="report-section">
      <h5>Recomendaciones</h5>
      <ul class="report-list">
        ${analysis.recommendations.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
      <p class="report-footnote">Calorías estimadas con una referencia de 75 kg y la densidad de la sesión. Úsalo como orientación, no como medición clínica.</p>
    </div>

    <div class="report-section">
      <h5>Línea del tiempo</h5>
      <div class="report-timeline">
        ${analysis.timeline.map((item) => `
          <div class="timeline-item">
            <strong>${escapeHtml(item.time)}</strong>
            <span>${escapeHtml(item.text)}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function analyzeDayRecords(records) {
  const sortedRecords = records.slice().sort((a, b) => new Date(a.timestamp || `${a.fecha}T00:00:00`).getTime() - new Date(b.timestamp || `${b.fecha}T00:00:00`).getTime());
  const totalSets = sortedRecords.length;
  const totalVolume = sortedRecords.reduce((sum, record) => sum + (Number(record.peso) || 0) * (Number(record.repsRealizadas) || 0), 0);
  const goalHits = sortedRecords.filter((record) => record.cumplioObjetivo === "Sí").length;
  const overs = sortedRecords.filter((record) => record.superoObjetivo === "Sí").length;
  const misses = sortedRecords.filter((record) => record.cumplioObjetivo !== "Sí").length;
  const missingWeights = sortedRecords.filter((record) => record.peso === "" || Number(record.peso) === 0).length;
  const uniqueExercises = Array.from(new Set(sortedRecords.map((record) => record.ejercicio)));
  const orderedExercises = [];
  sortedRecords.forEach((record) => {
    if (!orderedExercises.includes(record.ejercicio)) {
      orderedExercises.push(record.ejercicio);
    }
  });

  const exerciseSequence = orderedExercises.map((exerciseName, index) => {
    const exerciseRecords = sortedRecords.filter((record) => record.ejercicio === exerciseName);
    const setCount = exerciseRecords.length;
    const bestSet = exerciseRecords.reduce((best, record) => {
      const currentScore = (Number(record.peso) || 0) * (Number(record.repsRealizadas) || 0);
      const bestScore = best ? (Number(best.peso) || 0) * (Number(best.repsRealizadas) || 0) : -1;
      return currentScore > bestScore ? record : best;
    }, null);
    return `${index + 1}. ${exerciseName} · ${setCount} set(s) · mejor set ${formatSetLine(bestSet)}`;
  });

  const firstTimestamp = sortedRecords[0].timestamp || `${sortedRecords[0].fecha}T00:00:00`;
  const lastTimestamp = sortedRecords[sortedRecords.length - 1].timestamp || `${sortedRecords[sortedRecords.length - 1].fecha}T00:00:00`;
  const estimatedMinutes = estimateSessionMinutes(sortedRecords);
  const estimatedCalories = estimateCaloriesBurned(sortedRecords, estimatedMinutes);
  const topExercise = getTopVolumeExercise(sortedRecords);
  const goalRate = Math.round((goalHits / Math.max(1, totalSets)) * 100);

  const strengths = [];
  const weaknesses = [];
  const recommendations = [];

  if (goalHits > 0) {
    strengths.push(`Cumpliste el objetivo en ${goalHits} de ${totalSets} sets.`);
  }
  if (overs > 0) {
    strengths.push(`Superaste el rango objetivo en ${overs} set(s), señal de progreso real.`);
  }
  if (topExercise) {
    strengths.push(`El ejercicio más fuerte del día fue ${topExercise.name} con ${formatAxisValue(topExercise.volume)} de volumen total.`);
  }
  if (!strengths.length) {
    strengths.push("Quedó registro completo de la sesión, lo cual ya ayuda bastante a progresar con criterio.");
  }

  if (misses > 0) {
    weaknesses.push(`${misses} set(s) quedaron por debajo del mínimo del rango objetivo.`);
  }
  if (missingWeights > 0) {
    weaknesses.push(`Faltó registrar peso en ${missingWeights} set(s), lo que baja la calidad del análisis.`);
  }
  if (estimatedMinutes < 20) {
    weaknesses.push("La sesión quedó muy corta; quizá registraste solo una parte del entrenamiento.");
  }
  if (!weaknesses.length) {
    weaknesses.push("No se ven puntos débiles grandes en el registro; la sesión estuvo bastante pareja.");
  }

  if (overs >= 2) {
    recommendations.push("En los ejercicios donde superaste el rango, considera subir 2.5% a 5% la próxima vez.");
  }
  if (misses > 0) {
    recommendations.push("En los sets que no llegaron al mínimo, mantén el peso actual y prioriza técnica y descanso.");
  }
  if (missingWeights > 0) {
    recommendations.push("Registra el peso en todos los sets para que el progreso y las calorías estimadas sean más útiles.");
  }
  if (!recommendations.length) {
    recommendations.push("Mantén la progresión actual e intenta cerrar un set extra fuerte al inicio de la próxima sesión.");
  }

  const timeline = sortedRecords.map((record) => ({
    time: formatTimeOnly(record.timestamp || `${record.fecha}T00:00:00`),
    text: `${record.ejercicio} · set ${record.set} · ${record.repsRealizadas} reps · ${record.peso === "" ? "sin peso" : `${record.peso} ${record.unidadPeso || "kg"}`} · objetivo ${record.repsObjetivo}`
  }));

  return {
    totalSets,
    totalVolume,
    goalRate,
    estimatedMinutes,
    estimatedCalories,
    firstTime: formatTimeOnly(firstTimestamp),
    lastTime: formatTimeOnly(lastTimestamp),
    uniqueExercises,
    strengths,
    weaknesses,
    recommendations,
    exerciseSequence,
    timeline
  };
}

function getTopVolumeExercise(records) {
  const byExercise = new Map();

  records.forEach((record) => {
    const key = record.ejercicio;
    const volume = (Number(record.peso) || 0) * (Number(record.repsRealizadas) || 0);
    byExercise.set(key, (byExercise.get(key) || 0) + volume);
  });

  let best = null;
  byExercise.forEach((volume, name) => {
    if (!best || volume > best.volume) {
      best = { name, volume };
    }
  });

  return best;
}

function estimateSessionMinutes(records) {
  const first = new Date(records[0].timestamp || `${records[0].fecha}T00:00:00`);
  const last = new Date(records[records.length - 1].timestamp || `${records[records.length - 1].fecha}T00:00:00`);
  const spanMinutes = Math.max(0, (last.getTime() - first.getTime()) / 60000);
  const fallbackMinutes = records.length * 2.75;
  return Math.max(Math.round(spanMinutes + 8), Math.round(fallbackMinutes), 12);
}

function estimateCaloriesBurned(records, minutes) {
  const totalVolume = records.reduce((sum, record) => sum + (Number(record.peso) || 0) * (Number(record.repsRealizadas) || 0), 0);
  const sessionDensity = totalVolume / Math.max(1, minutes);
  const met = Math.min(7.2, 4.8 + sessionDensity / 220);
  const referenceBodyWeightKg = 75;
  const calories = met * 3.5 * referenceBodyWeightKg / 200 * minutes;
  return Math.round(calories);
}

function formatSetLine(record) {
  if (!record) {
    return "sin datos";
  }

  const weightText = record.peso === "" ? "sin peso" : `${record.peso} ${record.unidadPeso || "kg"}`;
  return `${record.repsRealizadas} reps con ${weightText}`;
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

function formatLongDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return capitalizeText(new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date));
}

function formatTimeOnly(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-MX", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function getMonthStart(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function formatDateInputValue(date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}
