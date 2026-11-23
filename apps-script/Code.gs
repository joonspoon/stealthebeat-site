// Steal the Beat member sign-ups -> Google Sheet
// Setup: open the Sheet > Extensions > Apps Script, paste this in, then
// Deploy > New deployment > Web app > Execute as: Me, Who has access: Anyone.
// Copy the web app URL into assets/form.js (ENDPOINT).

const SHEET_NAME = "Members";
const COLUMNS = [
  "timestamp", "name", "alias", "instagram", "city",
  "pieces", "pieces_other", "got_when",
  "whatsapp", "ok_whatsapp", "email", "ok_email",
  "into", "heard", "soiree", "notes", "page"
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.website) return json({ ok: true }); // spam trap

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(COLUMNS);
      sheet.setFrozenRows(1);
    }
    data.timestamp = new Date();
    // leading apostrophe stops Sheets turning +234... into a number
    if (data.whatsapp) data.whatsapp = "'" + data.whatsapp;
    sheet.appendRow(COLUMNS.map((c) => (data[c] !== undefined ? data[c] : "")));
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json({ ok: true, msg: "STB sign-up endpoint is live." });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
