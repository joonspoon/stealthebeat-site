// Steal the Beat member sign-ups -> Google Sheet "Steal the Beat Members"
// Bound to the Sheet (Extensions > Apps Script). Deployed as a web app:
// Execute as: Me, Who has access: Anyone. The /exec URL goes in assets/form.js.

const SHEET_NAME = "Members";
const FIELDS = [
  ["timestamp", "Signed up"], ["name", "Full name"], ["alias", "Alias"],
  ["instagram", "IG handle"], ["city", "City"], ["pieces", "Pieces owned"],
  ["pieces_other", "Other piece"], ["got_when", "Got it (month)"],
  ["whatsapp", "WhatsApp"], ["ok_whatsapp", "OK to WhatsApp"],
  ["email", "Email"], ["ok_email", "OK to email"],
  ["into", "Event interests"], ["soiree", "Soiree 13 Dec"],
  ["notes", "Notes"], ["page", "Page"]
];

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.getSheets()[0];
    if (sheet.getLastRow() > 0) sheet = ss.insertSheet(SHEET_NAME);
    else sheet.setName(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(FIELDS.map((f) => f[1]));
    sheet.getRange(1, 1, 1, FIELDS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.website) return json({ ok: true }); // spam trap
    data.timestamp = new Date();
    if (data.whatsapp) data.whatsapp = "'" + data.whatsapp; // keep the + sign
    getSheet().appendRow(FIELDS.map((f) => (data[f[0]] !== undefined ? data[f[0]] : "")));
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json({ ok: true, msg: "STB sign-up endpoint is live." });
}

function setup() {
  getSheet();
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
