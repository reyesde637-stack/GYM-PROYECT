// Este archivo pertenece a Google Apps Script. No va dentro del frontend local.
// Usa solo el ID del Sheet, no la URL completa.
const SHEET_ID = "1wA6v_FUEGquCTALpDsrj0UzrJFOabUO08Hvk4EKy-B0";
const SHEET_NAME = "Registros";

const HEADERS = [
  "Timestamp",
  "Fecha",
  "DiaRutina",
  "Ejercicio",
  "Set",
  "Peso",
  "RepsRealizadas",
  "RepsObjetivo",
  "CumplioObjetivo",
  "SuperoObjetivo",
  "Notas",
  "RecordId",
  "UnidadPeso"
];

function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || "health";

    if (action === "history") {
      const date = (e.parameter.date || "").trim();
      return jsonOutput_({
        success: true,
        records: getHistoryByDate_(date)
      });
    }

    if (action === "progress") {
      const exercise = (e.parameter.exercise || "").trim();
      return jsonOutput_({
        success: true,
        records: getProgressRecords_(exercise)
      });
    }

    return jsonOutput_({
      success: true,
      message: "Gym Tracker API activa"
    });
  } catch (error) {
    return jsonOutput_({
      success: false,
      message: error.message
    });
  }
}

function doPost(e) {
  try {
    const body = e && e.postData && e.postData.contents ? e.postData.contents : "{}";
    const payload = JSON.parse(body);

    if (payload.action === "delete") {
      return jsonOutput_(deleteRecord_(payload));
    }

    validatePayload_(payload);

    const sheet = getSheet_();
    const recordId = payload.id || payload.recordId || Utilities.getUuid();

    sheet.appendRow([
      new Date(),
      payload.fecha,
      payload.diaRutina,
      payload.ejercicio,
      payload.set,
      payload.peso === "" ? "" : payload.peso,
      payload.repsRealizadas,
      payload.repsObjetivo,
      payload.cumplioObjetivo,
      payload.superoObjetivo,
      payload.notas || "",
      recordId,
      payload.unidadPeso || "kg"
    ]);

    return jsonOutput_({
      success: true,
      message: "Registro guardado correctamente",
      recordId: recordId
    });
  } catch (error) {
    return jsonOutput_({
      success: false,
      message: error.message
    });
  }
}

// Ejecuta esta funcion una vez despues de pegar este archivo en Apps Script.
function setupSheet() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, HEADERS.length);
}

function getHistoryByDate_(date) {
  if (!date) {
    throw new Error("El parametro date es obligatorio.");
  }

  return getAllRecords_().filter(function(record) {
    return record.fecha === date;
  });
}

function getProgressRecords_(exercise) {
  const records = getAllRecords_();

  if (!exercise) {
    return records;
  }

  return records.filter(function(record) {
    return record.ejercicio === exercise;
  });
}

function deleteRecord_(payload) {
  const sheet = getSheet_();
  const rows = getRawRows_();

  if (rows.length === 0) {
    throw new Error("No hay registros para borrar.");
  }

  const rowToDelete = findRowIndexToDelete_(rows, payload);

  if (!rowToDelete) {
    throw new Error("No se encontro el registro en Google Sheets.");
  }

  sheet.deleteRow(rowToDelete);

  return {
    success: true,
    message: "Registro borrado correctamente"
  };
}

function findRowIndexToDelete_(rows, payload) {
  var fallbackCandidates = [];

  for (var i = 0; i < rows.length; i += 1) {
    var row = rows[i];

    if (payload.recordId && row.recordId && payload.recordId === row.recordId) {
      return row.sheetRowIndex;
    }

    if (
      normalizeString_(row.fecha) === normalizeString_(payload.fecha) &&
      normalizeString_(row.diaRutina) === normalizeString_(payload.diaRutina) &&
      normalizeString_(row.ejercicio) === normalizeString_(payload.ejercicio) &&
      normalizeNumber_(row.set) === normalizeNumber_(payload.set) &&
      normalizeNumber_(row.repsRealizadas) === normalizeNumber_(payload.repsRealizadas)
    ) {
      fallbackCandidates.push(row);
    }
  }

  if (fallbackCandidates.length === 1) {
    return fallbackCandidates[0].sheetRowIndex;
  }

  if (fallbackCandidates.length > 1) {
    var exactWeightAndNotes = fallbackCandidates.find(function(row) {
      return (
        normalizeNumber_(row.peso) === normalizeNumber_(payload.peso) &&
        normalizeString_(row.unidadPeso) === normalizeString_(payload.unidadPeso || "kg") &&
        normalizeString_(row.notas) === normalizeString_(payload.notas)
      );
    });

    if (exactWeightAndNotes) {
      return exactWeightAndNotes.sheetRowIndex;
    }

    var timestampMatch = fallbackCandidates.find(function(row) {
      return normalizeString_(row.timestamp) === normalizeString_(payload.timestamp);
    });

    if (timestampMatch) {
      return timestampMatch.sheetRowIndex;
    }

    return fallbackCandidates[fallbackCandidates.length - 1].sheetRowIndex;
  }

  return 0;
}

function getAllRecords_() {
  return getRawRows_().map(function(row) {
    return {
      id: row.recordId || "",
      recordId: row.recordId || "",
      timestamp: row.timestamp,
      fecha: row.fecha,
      diaRutina: row.diaRutina,
      ejercicio: row.ejercicio,
      set: row.set,
      peso: row.peso,
      repsRealizadas: row.repsRealizadas,
      repsObjetivo: row.repsObjetivo,
      cumplioObjetivo: row.cumplioObjetivo,
      superoObjetivo: row.superoObjetivo,
      notas: row.notas || "",
      unidadPeso: row.unidadPeso || "kg"
    };
  });
}

function getRawRows_() {
  const sheet = getSheet_();
  const lastRow = sheet.getLastRow();
  const lastColumn = Math.max(sheet.getLastColumn(), HEADERS.length);

  if (lastRow < 2) {
    return [];
  }

  const headerValues = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  const data = sheet.getRange(2, 1, lastRow - 1, lastColumn).getValues();
  const headerMap = buildHeaderMap_(headerValues);

  return data.map(function(row, index) {
    return mapRow_(row, headerMap, index + 2);
  });
}

function buildHeaderMap_(headers) {
  const map = {};

  headers.forEach(function(header, index) {
    if (header) {
      map[String(header).trim()] = index;
    }
  });

  return map;
}

function mapRow_(row, headerMap, sheetRowIndex) {
  return {
    sheetRowIndex: sheetRowIndex,
    timestamp: formatTimestamp_(getCell_(row, headerMap, "Timestamp")),
    fecha: String(getCell_(row, headerMap, "Fecha") || ""),
    diaRutina: String(getCell_(row, headerMap, "DiaRutina") || ""),
    ejercicio: String(getCell_(row, headerMap, "Ejercicio") || ""),
    set: getCell_(row, headerMap, "Set"),
    peso: getCell_(row, headerMap, "Peso"),
    repsRealizadas: getCell_(row, headerMap, "RepsRealizadas"),
    repsObjetivo: String(getCell_(row, headerMap, "RepsObjetivo") || ""),
    cumplioObjetivo: String(getCell_(row, headerMap, "CumplioObjetivo") || ""),
    superoObjetivo: String(getCell_(row, headerMap, "SuperoObjetivo") || ""),
    notas: String(getCell_(row, headerMap, "Notas") || ""),
    recordId: String(getCell_(row, headerMap, "RecordId") || ""),
    unidadPeso: String(getCell_(row, headerMap, "UnidadPeso") || "kg")
  };
}

function getCell_(row, headerMap, headerName) {
  const index = headerMap[headerName];
  return index === undefined ? "" : row[index];
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    throw new Error('No existe la hoja "' + SHEET_NAME + '". Ejecuta setupSheet() primero.');
  }

  return sheet;
}

function normalizeString_(value) {
  return String(value || "").trim();
}

function normalizeNumber_(value) {
  if (value === "" || value === null || value === undefined) {
    return "";
  }

  var numeric = Number(value);
  return Number.isNaN(numeric) ? String(value).trim() : numeric;
}

function validatePayload_(payload) {
  const requiredFields = [
    "fecha",
    "diaRutina",
    "ejercicio",
    "set",
    "repsRealizadas",
    "repsObjetivo",
    "cumplioObjetivo",
    "superoObjetivo"
  ];

  requiredFields.forEach(function(field) {
    if (payload[field] === undefined || payload[field] === null || payload[field] === "") {
      throw new Error("Falta el campo obligatorio: " + field);
    }
  });

  if (Number(payload.set) < 1) {
    throw new Error("El numero de set debe ser mayor a 0.");
  }

  if (Number(payload.repsRealizadas) < 0) {
    throw new Error("Las repeticiones realizadas deben ser validas.");
  }

  if (payload.peso !== "" && Number(payload.peso) < 0) {
    throw new Error("El peso debe ser un numero valido.");
  }
}

function formatTimestamp_(value) {
  if (!value) {
    return "";
  }

  return Utilities.formatDate(
    new Date(value),
    Session.getScriptTimeZone(),
    "yyyy-MM-dd'T'HH:mm:ss"
  );
}

function jsonOutput_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
