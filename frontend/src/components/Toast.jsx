import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useEffect } from 'react';

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const variants = {
        initial: { opacity: 0, y: -20, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -20, scale: 0.9 }
    };

    const getStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-800';
            case 'error':
                return 'bg-red-50 border-red-200 text-red-800';
            default:
                return 'bg-blue-50 border-blue-200 text-blue-800';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle size={20} className="text-green-600" />;
            case 'error':
                return <AlertCircle size={20} className="text-red-600" />;
            default:
                return <Info size={20} className="text-blue-600" />;
        }
    };

    return (
        <motion.div
            layout
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`${getStyles()} fixed top-4 right-4 z-[9999] min-w-[300px] p-4 rounded-xl border shadow-lg flex items-center gap-3 backdrop-blur-sm`}
        >
            <div className="shrink-0">
                {getIcon()}
            </div>
            <p className="flex-1 font-medium text-sm">{message}</p>
            <button
                onClick={onClose}
                className="shrink-0 p-1 hover:bg-black/5 rounded-full transition-colors"
            >
                <X size={16} className="opacity-60" />
            </button>
        </motion.div>
    );
};

export default Toast;
