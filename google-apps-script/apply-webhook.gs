/**
 * CompeTenza Business Services — Apply-form webhook
 *
 * Receives a POST from the site's /api/apply Cloudflare Function on every
 * new application, then:
 *   1. Logs the application as a row in a Google Sheet (auto-created on
 *      first run, ID cached in Script Properties).
 *   2. Saves each uploaded document into a per-application Drive subfolder
 *      (auto-created on first run), converting images (JPG/PNG/WEBP) to PDF
 *      along the way — Cloudflare Workers has no PDF-conversion library that
 *      runs in that runtime, which is exactly why this lives in Apps Script
 *      instead.
 *
 * Both emails (staff notification with documents attached, and the student
 * confirmation) are sent by the Cloudflare Worker itself via Resend, not by
 * this script — see functions/api/_email.ts and functions/api/apply.ts.
 * This script's only job is the Sheet log + Drive/PDF backup.
 *
 * SETUP (one-time, in the Apps Script editor — script.google.com):
 *   1. Create a new project, paste this file in as Code.gs.
 *   2. Project Settings (gear icon) → Script Properties → add:
 *        SHARED_SECRET = <a random string you make up>
 *      (SHEET_ID and FOLDER_ID fill themselves in automatically on first run.)
 *   3. Deploy → New deployment → type "Web app".
 *        Execute as: Me
 *        Who has access: Anyone
 *      Copy the resulting web app URL.
 *   4. Give Claude the web app URL and the SHARED_SECRET you picked, to add
 *      as the APPS_SCRIPT_WEBHOOK_URL / APPS_SCRIPT_SHARED_SECRET Cloudflare
 *      Pages secrets.
 *   5. Submit a real test application on the live site and confirm: a row
 *      appears in the Sheet, and a Drive folder appears with PDF(s) inside.
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var props = PropertiesService.getScriptProperties();
    var secret = props.getProperty("SHARED_SECRET");

    if (!secret || data.secret !== secret) {
      return jsonOutput_({ ok: false, error: "Unauthorized" });
    }

    var appFolder = getOrCreateFolder_().createFolder(data.id);
    var driveLinks = [];

    (data.documents || []).forEach(function (doc) {
      var raw = Utilities.base64Decode(doc.base64);
      var blob = Utilities.newBlob(raw, doc.mimeType, doc.filename);
      var pdfBlob = doc.mimeType === "application/pdf" ? blob : imageToPdf_(blob);
      var baseName = doc.filename.replace(/\.[^.]+$/, "");
      var file = appFolder.createFile(pdfBlob.setName(doc.docType + "-" + baseName + ".pdf"));
      driveLinks.push(doc.docType + ": " + file.getUrl());
    });

    logToSheet_(data, appFolder.getUrl(), driveLinks);

    return jsonOutput_({ ok: true, folderUrl: appFolder.getUrl() });
  } catch (err) {
    return jsonOutput_({ ok: false, error: String(err) });
  }
}

// Converts an image blob to a single-page PDF via a throwaway Google Doc —
// uses only the default DocumentApp/DriveApp services, no Advanced Drive
// Service needs enabling.
function imageToPdf_(blob) {
  var doc = DocumentApp.create("tmp-" + blob.getName());
  doc.getBody().appendImage(blob);
  doc.saveAndClose();
  var pdf = DriveApp.getFileById(doc.getId()).getAs("application/pdf");
  DriveApp.getFileById(doc.getId()).setTrashed(true);
  return pdf;
}

function getOrCreateFolder_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty("FOLDER_ID");
  var folder = null;
  if (id) {
    try {
      folder = DriveApp.getFolderById(id);
    } catch (e) {
      folder = null;
    }
  }
  if (!folder) {
    folder = DriveApp.createFolder("CompeTenza Applications");
    props.setProperty("FOLDER_ID", folder.getId());
  }
  return folder;
}

function getOrCreateSheet_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty("SHEET_ID");
  var ss = null;
  if (id) {
    try {
      ss = SpreadsheetApp.openById(id);
    } catch (e) {
      ss = null;
    }
  }
  if (!ss) {
    ss = SpreadsheetApp.create("CompeTenza Applications");
    props.setProperty("SHEET_ID", ss.getId());
  }
  var sheet = ss.getSheetByName("Applications");
  if (!sheet) {
    sheet = ss.insertSheet("Applications");
    sheet.appendRow([
      "Timestamp", "Application ID", "Full Name", "Email", "Phone",
      "Country", "Destination", "Program", "Message", "Folder Link", "Document Links",
    ]);
  }
  return sheet;
}

function logToSheet_(data, folderUrl, driveLinks) {
  getOrCreateSheet_().appendRow([
    new Date(),
    data.id,
    data.fullName,
    data.email,
    data.phone,
    data.country,
    data.destination,
    data.program || "",
    data.message || "",
    folderUrl,
    driveLinks.join(" | "),
  ]);
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
