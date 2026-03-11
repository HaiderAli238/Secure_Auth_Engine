import { motion } from "framer-motion";

const Loader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1 }}
      className="w-16 h-16 border-4 border-t-purple-500 border-white rounded-full"
    ></motion.div>
  </div>
);

export default Loader;
