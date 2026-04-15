/* =========================================================
   GLOBAL CONSTANTS
   ========================================================= */

const MAIN = "MAIN_LOG";
const VENDOR = "MASTER_VENDOR";
const PART = "MASTER_PART";


/* =========================================================
   WEB APP ENTRY POINT
   ========================================================= */

function doGet() {
  return HtmlService
    .createHtmlOutputFromFile("index")
    .setTitle("EDI / PO Tracking");
}


/* =========================================================
   FETCH VENDORS FROM MASTER SHEET
   ========================================================= */

function getVendors() {

  const sh = SpreadsheetApp
    .getActive()
    .getSheetByName(VENDOR);

  return sh
    .getRange(2, 1, sh.getLastRow() - 1, 1)
    .getValues()
    .flat()
    .filter(String);
}


/* =========================================================
   FETCH PART NUMBERS FROM MASTER SHEET
   ========================================================= */

function getParts() {

  const sh = SpreadsheetApp
    .getActive()
    .getSheetByName(PART);

  return sh
    .getRange(2, 1, sh.getLastRow() - 1, 1)
    .getValues()
    .flat()
    .filter(String);
}


/* =========================================================
   SAVE LOG DC ENTRY
   ========================================================= */

function saveEntry(data) {

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);

  try {

    const sh = SpreadsheetApp
      .getActive()
      .getSheetByName(MAIN);

    const sr = sh.getLastRow();

    const today = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "dd/MM/yyyy HH:mm:ss"
    );

    sh.appendRow([
      sr,
      today,
      data.plant,
      data.type,
      data.vendor,
      data.type=="Without EDI" ? data.dc : "",   // Vendor Invoice No (F)
      data.type=="Inward DC" ? data.dc : "",     // DC No (G)
      "",                                        // EDI No (H)
      "",                                        // Customer Invoice No (I)
      data.part,
      data.qty,
      data.dock,
      "Pending",
      "",             // Closed On
      data.remark,
      ""              // Time Taken
    ]);

    return { status: true };

  }
  catch (err) {

    return { status: false, msg: err.message };

  }
  finally {

    lock.releaseLock();

  }

}


/* =========================================================
   FETCH OPEN DC LIST
   ========================================================= */

function getOpenDC() {

  const sh = SpreadsheetApp
    .getActive()
    .getSheetByName(MAIN);

  const data = sh.getDataRange().getValues();

  let arr = [];

  for (let i = 1; i < data.length; i++) {

    if (data[i][11] == "Pending") {

      if(data[i][3]=="Without EDI"){
      arr.push(data[i][4] + " | " + data[i][5]);   // Vendor Invoice
      }else{
      arr.push(data[i][4] + " | " + data[i][6]);   // DC No
      }

    }

  }

  return arr;

}


/* =========================================================
   CLOSE DC ENTRY
   ========================================================= */

function closeDC(data) {

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);

  try {

    const sh = SpreadsheetApp
      .getActive()
      .getSheetByName(MAIN);

    const rows = sh.getDataRange().getValues();

    let found = false;

    for (let i = 1; i < rows.length; i++) {

      if (
        rows[i][5] == data.dc &&
        rows[i][4] == data.vendor &&
        rows[i][3] == data.type
      ) {

        /* Write EDI or Invoice depending on type */

        if (data.type == "Without EDI") {
          sh.getRange(i + 1, 7).setValue(data.edi);
        }

        if (data.type == "Inward DC") {
          sh.getRange(i + 1, 8).setValue(data.invoice);
        }

        /* Mark as completed */

        sh.getRange(i + 1, 12).setValue("Completed");

        /* Calculate aging duration */

        const start = rows[i][1];
        const end = new Date();

        const diff = (end - new Date(start)) / (1000 * 60 * 60 * 24);

        sh.getRange(i + 1, 15).setValue(diff);

        /* Set closed date */

        sh.getRange(i + 1, 13).setValue(
          Utilities.formatDate(
            new Date(),
            Session.getScriptTimeZone(),
            "dd/MM/yyyy"
          )
        );

        found = true;
        break;

      }

    }

    if (found) {
      return { status: true };
    }
    else {
      return { status: false, msg: "Record not found" };
    }

  }
  catch (err) {

    return { status: false, msg: err.message };

  }
  finally {

    lock.releaseLock();

  }

}
