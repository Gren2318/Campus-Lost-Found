import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={`p-2 rounded-full transition-all duration-300 relative overflow-hidden flex items-center justify-center w-10 h-10 ${
        isDarkMode 
          ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700 shadow-glow' 
          : 'bg-primary-50 text-primary-600 hover:bg-primary-100 shadow-sm'
      }`}
      aria-label="Toggle Theme"
    >
      <motion.div
        initial={false}
        animate={{
          rotate: isDarkMode ? 0 : 90,
          scale: isDarkMode ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="absolute"
      >
        <Moon size={20} />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          rotate: isDarkMode ? -90 : 0,
          scale: isDarkMode ? 0 : 1,
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="absolute"
      >
        <Sun size={20} />
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
