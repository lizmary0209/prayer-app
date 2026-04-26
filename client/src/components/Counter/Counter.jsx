import { useEffect, useState } from "react";

function Counter({ value, event, setEvent }) {
    const [displayValue, setDisplayValue] = useState(0);
    const [bump, setBump] = useState(false);
    const [glow, setGlow] = useState(false);

    useEffect(() => {
  let start = 0;
  let counter;


  const duration = event ? 1200 : 800;
  const delay = 200; 

  const timeout = setTimeout(() => {
    const increment = value / (duration / 16);

     counter = setInterval(() => {
      start += increment;

      if (start >= value) {
        setDisplayValue(value);
        clearInterval(counter);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    setBump(true);
    setGlow(true);


    setTimeout(() => setBump(false), 200);

    if (event && setEvent) {
      setTimeout(() => {
        setEvent(false);
       }, 1200);
    }
  }, delay);

  return () => {
     clearTimeout(timeout);
     if (counter) clearInterval(counter);
  };
}, [value, event, setEvent]);

    return (
        <span className={`home__count ${bump ? "bump" : ""} ${glow ? "glow" : ""} ${event ? "event" : ""}`}>
            {displayValue}
        </span>
    );
}

export default Counter;