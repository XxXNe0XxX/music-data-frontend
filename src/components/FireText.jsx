import React from "react";
import { AnimatePresence, motion } from "framer-motion";

const FireText = ({ text }) => {
  // You can define custom variants or just inline them on the motion.div
  const containerVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0 },
  };

  return (
    <>
      <div className="fire">
        <AnimatePresence mode="wait">
          {/* Use text as the 'key' so that AnimatePresence knows to animate
              in/out whenever the text changes */}
          <motion.div
            key={text}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="text-3xl"
          >
            {text}
          </motion.div>
        </AnimatePresence>
      </div>

      <svg className="fire-bg">
        <filter id="flame">
          <feTurbulence
            id="flame"
            baseFrequency="0.1 0.1"
            numOctaves="3"
            seed="4"
          >
            <animate
              attributeName="baseFrequency"
              dur="2s"
              values="0.3 0.1; 0.1 0.3"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="2" />
        </filter>
      </svg>
    </>
  );
};

export default FireText;
