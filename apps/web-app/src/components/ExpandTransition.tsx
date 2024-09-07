import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

export default function ExpandTransition({
  children,
  buffer = 0, // How much buffer to add to the measured content height
}: {
  children: React.ReactNode;
  buffer?: number;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [measuring, setMeasuring] = useState(true);
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
      setMeasuring(false);
    }
  }, [contentRef]);

  const variants = {
    open: { maxHeight: contentHeight + buffer },
    closed: { maxHeight: 0 },
  };

  return (
    <>
      <motion.div
        className="overflow-hidden"
        initial="closed"
        animate="open"
        exit="closed"
        variants={variants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div
          ref={contentRef}
          className={measuring ? "h-0 overflow-hidden" : ""}
        >
          {children}
        </div>
      </motion.div>
    </>
  );
}
