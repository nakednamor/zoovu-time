import React, { useMemo, useState } from "react";
import ReactDOM from "react-dom";
import Title from "./title";
import { WorkTrackRecord, workTrackStore } from "../WorkTrackStorage";
import CurrentDayRecords from "../../popup/CurrentDayRecords";
import { currentTimeRecord } from "../util/Utilities";

const CurrentDayTracker: React.FunctionComponent<{}> = ({}) => {
  const store = workTrackStore();
  const now = new Date(Date.now());

  const [workTrackStarted, setWorkTrackStarted] = useState(false);
  const [records, setRecords] = useState<WorkTrackRecord[]>([]);
  // store.getMonthlyRecords(now.getFullYear(), now.getMonth() + 1, () => {});  TODO same as below

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

ReactDOM.render(<CurrentDayTracker />, document.getElementById("root"));
