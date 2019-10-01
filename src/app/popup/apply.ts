import { log } from "../util/Utilities";

log("in apply.js");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  log("apply.js received message from ", sender);

  if (request.greeting === "hello") {
    log("received message from extension");
    sendResponse({ farewell: "goodbye" });
  }
});
