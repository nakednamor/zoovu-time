import React, { useMemo, useState } from "react";
import ReactDOM from "react-dom";
import Title from "./title";
import { WorkTrackStore } from "../WorkTrackStorage";
import CurrentDayRecords from "./CurrentDayRecords";
import { currentTimeRecord, log } from "../util/Utilities";
import { WorkTrackRecord } from "../WorkTrackRecord";
import { WorkTrackDayRecord } from "../WorkTrackDayRecord";
import "../scss/style.scss";
import {
  Timer,
  TimerOff,
  PlaylistAddCheck,
  DeleteOutline,
  Event
} from "@material-ui/icons/";
import { addMissingZero } from "../util/Utilities";
import Port = chrome.runtime.Port;

const CurrentDayTracker: React.FunctionComponent<{}> = ({}) => {
  const store = new WorkTrackStore(chrome.storage.local, chrome.runtime);
  const now = new Date(Date.now());
  const [workTrackStarted, setWorkTrackStarted] = useState(false);
  const [records, setRecords] = useState<WorkTrackRecord[]>([]);

  const minutesWorked: number = records
    .map(record => record.getWorkingTime())
    .reduce((total: number, currentVal: number) => {
      return total + currentVal;
    }, 0);

  const workingTimeString =
    addMissingZero(Math.floor(minutesWorked / 60)) +
    ":" +
    addMissingZero(minutesWorked % 60);

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

      chrome.runtime.onConnect.addListener((port: Port) => {
        if (port.name !== "ZoovuTime Apply ContentScript") {
          log("received wrong connection from content script", port);
        } else {
          port.onMessage.addListener((message: any): void => {
            const requestedDate: Date = new Date(message.date);

            const dateArray = store.buildKeyFromDate(requestedDate).split("_");
            store.getRecordsOfMonth(
              +dateArray[0],
              +dateArray[1],
              data => {
                port.postMessage({ records: data });
              },
              err =>
                alert("error happened while getting monthly records: " + err)
            );
          });
        }
      });

      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const currentTabId = tabs[0].id || 0; // || 0 is just to pass lint
        chrome.tabs.executeScript(currentTabId, {
          file: "js/apply.js"
        });
      });
    },

    removeAllRecords: () => {
      store.removeAllRecords(log("all records are removed from storage"));
    },

    showOptionsPage: (): void => {
      const url = chrome.runtime.getURL("report.html");
      window.open(url, "_blank");
    }
  };

  return (
    <>
      <Title />
      <div className="tracker-bar">
        <button
          id="track-work"
          onClick={handlers.onTrackWorkButtonClick}
          className={`${
            workTrackStarted ? "track-work--started" : "track-work--stopped"
          }`}
        >
          {workTrackStarted ? (
            <TimerOff fontSize="small" className="icon--before" />
          ) : (
            <Timer fontSize="small" className="icon--before" />
          )}
          {workTrackStarted ? "STOP" : "START"} Work
        </button>
        <span>
          Working time of today: <strong>{workingTimeString}</strong>
        </span>
      </div>

      <CurrentDayRecords records={records} />

      <div className="button-bar">
        <button id="remove-all" onClick={handlers.removeAllRecords}>
          remove all
          <DeleteOutline
            fontSize="small"
            className="icon--after"
            color="error"
          />
        </button>
        <button id="options-page" onClick={handlers.showOptionsPage}>
          overview
          <Event fontSize="small" className="icon--after" htmlColor="#3c0078" />
        </button>
        <button id="apply" onClick={handlers.onApplyButtonClick}>
          apply all
          <PlaylistAddCheck
            fontSize="small"
            className="icon--after"
            htmlColor="green"
          />
        </button>
      </div>
    </>
  );
};

ReactDOM.render(<CurrentDayTracker />, document.getElementById("root"));
