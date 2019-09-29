import React, { useState } from "react";
import ReactDOM from "react-dom";
import Title from "./title";
import { WorkTrackRecord, workTrackStore } from "../WorkTrackStorage";
import CurrentDayRecords from "../../popup/CurrentDayRecords";
import { currentTimeRecord } from "../util/Utilities";

const CurrentDayTracker: React.FunctionComponent<{}> = ({}) => {
  const store = workTrackStore();

  const [workTrackStarted, setWorkTrackStarted] = useState(false);
  const [records] = useState<WorkTrackRecord[]>(getTodaysRecords());

  const now = new Date(Date.now());

  const handlers = {
    onTrackWorkButtonClick: async () => {
      const x = currentTimeRecord();

      if (!workTrackStarted) {
        records.push({ s: x, e: null });
      } else {
        records[records.length - 1].e = x;
      }

      await store.saveRecords(
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate(),
        records
      );

      await store.getRecords(
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate()
      );

      setWorkTrackStarted(!workTrackStarted);
    }
  };

  return (
    <>
      <Title />
      <button id="track-work" onClick={handlers.onTrackWorkButtonClick}>
        {workTrackStarted ? "STOP" : "START"} Work
      </button>
      <CurrentDayRecords records={records} />
    </>
  );
};

const getTodaysRecords = (): WorkTrackRecord[] => {
  return [];
};

ReactDOM.render(<CurrentDayTracker />, document.getElementById("root"));
