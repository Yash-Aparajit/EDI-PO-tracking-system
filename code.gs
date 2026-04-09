const MAIN_SHEET = "MAIN_LOG";
const VENDOR_SHEET = "MASTER_VENDOR";
const PART_SHEET = "MASTER_PART";

function doGet() {
  return HtmlService.createHtmlOutputFromFile("index")
  .setTitle("DC Tracking System");
}

/* FETCH VENDORS */
function getVendors(){

const sh = SpreadsheetApp.getActive().getSheetByName(VENDOR_SHEET);
if(!sh) return [];

return sh.getRange(2,1,sh.getLastRow()-1,1)
.getValues()
.flat()
.filter(String);

}

/* FETCH PARTS */

function getParts(){

const sh = SpreadsheetApp.getActive().getSheetByName(PART_SHEET);

const data = sh.getRange(2,1,sh.getLastRow()-1,2).getValues();

return data;

}

/* GET PART DESC */

function getPartDesc(part){

const sh = SpreadsheetApp.getActive().getSheetByName(PART_SHEET);

const data = sh.getDataRange().getValues();

for(let i=1;i<data.length;i++){

if(data[i][0]==part){

return data[i][1];

}

}

return "";

}

/* SAVE ENTRY */

function saveEntry(form){

const lock = LockService.getScriptLock();
lock.waitLock(20000);

try{

const sh = SpreadsheetApp.getActive().getSheetByName(MAIN_SHEET);

const sr = sh.getLastRow();

const today = Utilities.formatDate(
new Date(),
Session.getScriptTimeZone(),
"dd/MM/yyyy"
);

sh.appendRow([
sr,
today,
form.plant,
form.vendor,
form.dc,
"",
form.part,
form.desc,
form.qty,
form.dock,
"Pending",
""
]);

return true;

}

finally{

lock.releaseLock();

}

}

/* FETCH OPEN DC */

function getOpenDC(){

const sh = SpreadsheetApp.getActive().getSheetByName(MAIN_SHEET);

const data = sh.getDataRange().getValues();

let arr=[];

for(let i=1;i<data.length;i++){

if(data[i][10]=="Pending"){

arr.push(data[i][4]);

}

}

return arr;

}

/* CLOSE DC */

function closeDC(form){

const lock = LockService.getScriptLock();
lock.waitLock(20000);

try{

const sh = SpreadsheetApp.getActive().getSheetByName(MAIN_SHEET);

const data = sh.getDataRange().getValues();

for(let i=1;i<data.length;i++){

if(data[i][4]==form.dc){

sh.getRange(i+1,6).setValue(form.edi);

sh.getRange(i+1,11).setValue("Completed");

sh.getRange(i+1,12).setValue(
Utilities.formatDate(new Date(),
Session.getScriptTimeZone(),
"dd/MM/yyyy")
);

break;

}

}

return true;

}

finally{

lock.releaseLock();

}

}
