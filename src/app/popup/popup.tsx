import React, { useMemo, useState } from "react";
import ReactDOM from "react-dom";
import Title from "./title";
import { WorkTrackStore } from "../WorkTrackStorage";
import CurrentDayRecords from "../../popup/CurrentDayRecords";
import { currentTimeRecord, log } from "../util/Utilities";
import { WorkTrackRecord } from "../WorkTrackRecord";
import { WorkTrackDayRecord } from "../WorkTrackDayRecord";

const CurrentDayTracker: React.FunctionComponent<{}> = ({}) => {
  const store = new WorkTrackStore(chrome.storage.local, chrome.runtime);
  const now = new Date(Date.now());

  const [workTrackStarted, setWorkTrackStarted] = useState(false);
  const [records, setRecords] = useState<WorkTrackRecord[]>([]);

  useMemo(() => {
    store.getTodaysRecords(
      dayRecord => {
        if (dayRecord && records.length !== dayRecord.records.length) {
          setRecords(dayRecord.records);
          if (
            dayRecord.records.length !== 0 &&
            !dayRecord.records[dayRecord.records.length - 1].end
          ) {
            setWorkTrackStarted(true);
          }
        }
      },
      error => alert("error happened while getting todays records" + error) // TODO better error handling
    );
  }, []);

  const handlers = {
    onTrackWorkButtonClick: async () => {
      const x = currentTimeRecord();

      if (!workTrackStarted) {
        records.push(new WorkTrackRecord(x));
      } else {
        records[records.length - 1].end = x;
      }

      await store.saveRecord(
        new WorkTrackDayRecord(store.buildKeyFromDate(now), records)
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
    },

    removeAllRecords: () => {
      store.removeAllRecords(log("all records are removed from storage"));
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

      <button id="remove-all" onClick={handlers.removeAllRecords}>
        REMOVE ALL RECORDS
      </button>
    </>
  );
};

ReactDOM.render(<CurrentDayTracker />, document.getElementById("root"));
