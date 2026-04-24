const SHEET_ID = "1wA6v_FUEGquCTALpDsrj0UzrJFOabUO08Hvk4EKy-B0";
const SHEET_NAME = "Registros";
const HEADERS = ["Timestamp","Fecha","DiaRutina","Ejercicio","Set","Peso","RepsRealizadas","RepsObjetivo","CumplioObjetivo","SuperoObjetivo","Notas","RecordId","UnidadPeso"];

function doGet(e) {
  try {
    const p = (e && e.parameter) || {};
    const action = String(p.action || "health").trim();
    if (action === "history") return json_({ success: true, records: getRecords_({ date: p.date }) });
    if (action === "progress") return json_({ success: true, records: getRecords_({ exercise: p.exercise }) });
    return json_({ success: true, message: "Gym Tracker API activa" });
  } catch (error) {
    return json_({ success: false, message: error.message });
  }
}

function doPost(e) {
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    if (payload.action === "delete") return json_(deleteRecord_(payload));
    validatePayload_(payload);
    return json_(saveRecord_(payload));
  } catch (error) {
    return json_({ success: false, message: error.message });
  }
}

function setupSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sh.setFrozenRows(1);
  sh.autoResizeColumns(1, HEADERS.length);
}

function saveRecord_(p) {
  const sh = getSheet_(), rows = getRows_(), id = String(p.id || p.recordId || Utilities.getUuid());
  const row = rows.find(r => (r.recordId && r.recordId === id) || (r.fecha === normDate_(p.fecha) && normText_(r.diaRutina) === normText_(p.diaRutina) && normText_(r.ejercicio) === normText_(p.ejercicio) && normNum_(r.set) === normNum_(p.set)));
  const values = [new Date(), normDate_(p.fecha), p.diaRutina, p.ejercicio, p.set, p.peso === "" ? "" : p.peso, p.repsRealizadas, p.repsObjetivo, p.cumplioObjetivo, p.superoObjetivo, p.notas || "", id, p.unidadPeso || "kg"];
  if (row) sh.getRange(row.sheetRowIndex, 1, 1, HEADERS.length).setValues([values]); else sh.appendRow(values);
  return { success: true, message: row ? "Registro actualizado correctamente" : "Registro guardado correctamente", replaced: Boolean(row), recordId: id };
}

function deleteRecord_(p) {
  const sh = getSheet_(), rows = getRows_();
  let row = rows.find(r => realId_(p.recordId) && r.recordId === String(p.recordId));
  if (!row) {
    const matches = rows.filter(r => r.fecha === normDate_(p.fecha) && normText_(r.ejercicio) === normText_(p.ejercicio) && normNum_(r.set) === normNum_(p.set));
    row = matches.find(r => normText_(r.diaRutina) === normText_(p.diaRutina) && normNum_(r.repsRealizadas) === normNum_(p.repsRealizadas))
      || matches.find(r => normNum_(r.peso) === normNum_(p.peso))
      || matches.find(r => normText_(r.notas) === normText_(p.notas))
      || matches[matches.length - 1];
  }
  if (!row) throw new Error("No se encontro el registro en Google Sheets.");
  sh.deleteRow(row.sheetRowIndex);
  return { success: true, message: "Registro borrado correctamente" };
}

function getRecords_(filters) {
  const d = normDate_(filters && filters.date), ex = normText_(filters && filters.exercise);
  return getRows_().filter(r => (!d || r.fecha === d) && (!ex || normText_(r.ejercicio) === ex)).map(r => ({ id: r.recordId, recordId: r.recordId, timestamp: r.timestamp, fecha: r.fecha, diaRutina: r.diaRutina, ejercicio: r.ejercicio, set: r.set, peso: r.peso, repsRealizadas: r.repsRealizadas, repsObjetivo: r.repsObjetivo, cumplioObjetivo: r.cumplioObjetivo, superoObjetivo: r.superoObjetivo, notas: r.notas, unidadPeso: r.unidadPeso }));
}

function getRows_() {
  const sh = getSheet_(), lastRow = sh.getLastRow(), lastCol = Math.max(sh.getLastColumn(), HEADERS.length);
  if (lastRow < 2) return [];
  const headers = sh.getRange(1, 1, 1, lastCol).getValues()[0], data = sh.getRange(2, 1, lastRow - 1, lastCol).getValues(), map = {};
  headers.forEach((h, i) => { if (h) map[String(h).trim()] = i; });
  return data.map((row, i) => ({ sheetRowIndex: i + 2, timestamp: fmtTs_(cell_(row, map, "Timestamp")), fecha: normDate_(cell_(row, map, "Fecha")), diaRutina: String(cell_(row, map, "DiaRutina") || ""), ejercicio: String(cell_(row, map, "Ejercicio") || ""), set: cell_(row, map, "Set"), peso: cell_(row, map, "Peso"), repsRealizadas: cell_(row, map, "RepsRealizadas"), repsObjetivo: String(cell_(row, map, "RepsObjetivo") || ""), cumplioObjetivo: String(cell_(row, map, "CumplioObjetivo") || ""), superoObjetivo: String(cell_(row, map, "SuperoObjetivo") || ""), notas: String(cell_(row, map, "Notas") || ""), recordId: String(cell_(row, map, "RecordId") || ""), unidadPeso: String(cell_(row, map, "UnidadPeso") || "kg") }));
}

function getSheet_() {
  const sh = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  if (!sh) throw new Error('No existe la hoja "' + SHEET_NAME + '". Ejecuta setupSheet() primero.');
  return sh;
}

function validatePayload_(p) {
  ["fecha","diaRutina","ejercicio","set","repsRealizadas","repsObjetivo","cumplioObjetivo","superoObjetivo"].forEach(f => { if (p[f] === undefined || p[f] === null || p[f] === "") throw new Error("Falta el campo obligatorio: " + f); });
  if (Number(p.set) < 1) throw new Error("El numero de set debe ser mayor a 0.");
  if (Number(p.repsRealizadas) < 0) throw new Error("Las repeticiones realizadas deben ser validas.");
  if (p.peso !== "" && Number(p.peso) < 0) throw new Error("El peso debe ser un numero valido.");
}

function cell_(row, map, name) { const i = map[name]; return i === undefined ? "" : row[i]; }
function normText_(v) { return String(v || "").trim().toLowerCase().replace(/[–—]/g, "-").replace(/\s+/g, " "); }
function normNum_(v) { if (v === "" || v === null || v === undefined) return ""; const n = Number(v); return Number.isNaN(n) ? String(v).trim() : n; }
function normDate_(v) { if (!v) return ""; if (Object.prototype.toString.call(v) === "[object Date]" && !Number.isNaN(v.getTime())) return Utilities.formatDate(v, Session.getScriptTimeZone(), "yyyy-MM-dd"); return String(v).trim(); }
function realId_(v) { const t = String(v || "").trim(); return t !== "" && !/^remote-/.test(t); }
function fmtTs_(v) { if (!v) return ""; return Utilities.formatDate(new Date(v), Session.getScriptTimeZone(), "yyyy-MM-dd'T'HH:mm:ss"); }
function json_(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }
