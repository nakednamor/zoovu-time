import React, { useState } from "react";

const Title: React.FunctionComponent<{}> = ({}) => {
  const [currentTime, setCurrentTime] = useState(new Date(Date.now()));

  const locale = navigator.language;

  const dateFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  };

  setInterval(() => {
    setCurrentTime(new Date(Date.now()));
  }, 1000);

  return <h1>{currentTime.toLocaleString(locale, dateFormatOptions)}</h1>;
};

export default Title;
