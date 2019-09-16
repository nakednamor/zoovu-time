import React, { useMemo } from "react";
import ReactDOM from "react-dom";

interface Props {
  date: Date;
}

const CurrentDayTracker: React.FunctionComponent<Props> = ({ date }) => {
  const handlers = useMemo(
    () => ({
      buttonClick: (ev: React.MouseEvent<HTMLButtonElement>) => {
        // tslint:disable-next-line:no-console
        console.log("button clicked" + ev.button);
      }
    }),
    [date]
  );

  return (
    <>
      <h1>hello</h1>
      <button onClick={handlers.buttonClick}>aaaa</button>
    </>
  );
};

ReactDOM.render(
  <CurrentDayTracker date={new Date()} />,
  document.getElementById("root")
);

export default CurrentDayTracker;
