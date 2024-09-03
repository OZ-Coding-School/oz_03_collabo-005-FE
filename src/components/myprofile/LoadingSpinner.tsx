import { motion } from 'framer-motion';

export const LoadingSpinner = () => (
  <motion.div
    className="absolute inset-0 flex items-center justify-center"
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
    <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent" />
  </motion.div>
);
