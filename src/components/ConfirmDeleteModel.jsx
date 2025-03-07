import { motion, AnimatePresence } from "framer-motion";

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          className="border border-white p-6 rounded-lg w-80"
        >
          <h2 className="text-lg font-bold text-center">[ are you sure? ]</h2>
          <p className="my-2 text-sm text-gray-400 text-center">
            do you really want to delete this question?
          </p>
          <div className="flex justify-between mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md hover:bg-gray-500"
            >
              cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-700 rounded-md hover:bg-red-500"
            >
              yes, delete
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
