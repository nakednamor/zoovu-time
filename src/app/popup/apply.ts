import { log } from "../util/Utilities";

log("in apply.js");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  log("apply.js received message from ", sender);

  if (request.greeting === "hello") {
    log("received message from extension");
    sendResponse({ farewell: "goodbye" });
  }
});

const selector =
  "#addRegularizationPage table#attRegTable tbody tr:not(#attDetailsListRow)";
const dataRows = document.querySelectorAll(selector);

dataRows.forEach(row => {
  const inputFrom = row.querySelector(
    "input#ZPAtt_reg_fromTime"
  ) as HTMLInputElement;
  const inputTo = row.querySelector(
    "input#ZPAtt_reg_toTime"
  ) as HTMLInputElement;

  if (inputFrom) {
    inputFrom.value = "8:00 AM";
  }
  if (inputTo) {
    inputTo.value = "4:00 PM";
  }
});
