import React, { useMemo, useState } from "react";
import ReactDOM from "react-dom";
import Title from "./title";
import { WorkTrackRecord, WorkTrackStore } from "../WorkTrackStorage";
import CurrentDayRecords from "../../popup/CurrentDayRecords";
import { currentTimeRecord, log } from "../util/Utilities";

const CurrentDayTracker: React.FunctionComponent<{}> = ({}) => {
  const store = new WorkTrackStore();
  const now = new Date(Date.now());

  const [workTrackStarted, setWorkTrackStarted] = useState(false);
  const [records, setRecords] = useState<WorkTrackRecord[]>([]);

  useMemo(() => {
    store.getTodaysRecords(todayRecords => {
      if (todayRecords && records.length !== todayRecords.length) {
        setRecords(todayRecords);
      }
    });
  }, []);

  const handlers = {
    onTrackWorkButtonClick: async () => {
      const x = currentTimeRecord();

      if (!workTrackStarted) {
        records.push({ start: x, end: null });
      } else {
        records[records.length - 1].end = x;
      }

      await store.saveRecords(
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate(),
        records
      );

      setWorkTrackStarted(!workTrackStarted);
    },

    onApplyButtonClick: () => {
      log("apply button clicked");

      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const currentTabId = tabs[0].id || 0; // || 0 is just to pass lint
        chrome.tabs.executeScript(
          currentTabId,
          {
            file: "js/apply.js"
          },
          () => {
            // log("executeScript callback!");
            chrome.tabs.sendMessage(
              currentTabId,
              { greeting: "hello" },
              response => {
                log("response from apply.js", response.farewell);
              }
            );
          }
        );
      });
    }
  };

  return (
    <>
      <Title />
      <button id="track-work" onClick={handlers.onTrackWorkButtonClick}>
        {workTrackStarted ? "STOP" : "START"} Work
      </button>
      <CurrentDayRecords records={records} />

      <button id="apply" onClick={handlers.onApplyButtonClick}>
        apply records
      </button>
    </>
  );
};

ReactDOM.render(<CurrentDayTracker />, document.getElementById("root"));
