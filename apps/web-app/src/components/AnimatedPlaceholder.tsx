import { useEffect, useState } from "react";
import { useTransition, animated } from "@react-spring/web";

export default function AnimatedPlaceholder({
  placeholders,
}: {
  placeholders: string[];
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((state) => (state + 1) % placeholders.length);
    }, 7000); // Change text every 3 seconds
    return () => clearInterval(timer);
  }, []);

  const transitions = useTransition(index, {
    from: { opacity: 0, transform: "translate3d(0,100%,0)" },
    enter: { opacity: 1, transform: "translate3d(0,0%,0)" },
    leave: { opacity: 0, transform: "translate3d(0,-50%,0)" },
  });

  return (
    <div className="pointer-events-none absolute bottom-0 left-0 top-0 flex w-full items-center pl-6 text-xl text-neutral-500">
      {transitions((style, i) => (
        <animated.div className="absolute w-full" style={style}>
          {placeholders[i]}
        </animated.div>
      ))}
    </div>
  );
}
