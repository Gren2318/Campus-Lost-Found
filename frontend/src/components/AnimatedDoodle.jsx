import { motion } from 'framer-motion';

const paths = {
  arrow: "M 10 90 C 20 80, 40 40, 80 20 M 60 10 L 80 20 L 70 40",
  squiggle: "M 10 50 Q 25 10, 50 50 T 90 50",
  star: "M 50 10 L 61 35 L 88 35 L 66 54 L 74 81 L 50 64 L 26 81 L 34 54 L 12 35 L 39 35 Z",
  circle: "M 50, 10 a 40,40 0 1,0 0,80 a 40,40 0 1,0 0,-80",
  underline: "M 10 80 Q 50 90 90 75"
};

const AnimatedDoodle = ({ type = 'squiggle', color = 'currentColor', className = '', strokeWidth = 3 }) => {
  const pathData = paths[type] || paths.squiggle;

  return (
    <motion.svg
      className={`absolute pointer-events-none ${className}`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <motion.path
        d={pathData}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          delay: 0.2
        }}
      />
    </motion.svg>
  );
};

export default AnimatedDoodle;
