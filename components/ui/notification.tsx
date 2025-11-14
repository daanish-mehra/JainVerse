"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X } from "lucide-react";
import { useEffect } from "react";

interface NotificationProps {
  show: boolean;
  message: string;
  onClose: () => void;
  duration?: number;
}

export function Notification({ show, message, onClose, duration = 4000 }: NotificationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25,
              duration: 0.5 
            }}
            className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl shadow-2xl p-6 border-2 border-green-300 relative overflow-hidden"
          >
            {/* Animated background glow */}
            <motion.div
              className="absolute inset-0 bg-white opacity-20"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            {/* Content */}
            <div className="relative z-10 flex items-start space-x-4">
              {/* Icon with bounce animation */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 15,
                  delay: 0.1 
                }}
                className="flex-shrink-0"
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
              </motion.div>
              
              {/* Message */}
              <div className="flex-1 min-w-0">
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg font-bold mb-1"
                >
                  {message.split('+')[0]?.trim()}
                </motion.p>
                {message.includes('+') && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-extrabold flex items-center space-x-2"
                  >
                    <span>✨</span>
                    <span>{message.split('+')[1]?.trim()}</span>
                  </motion.p>
                )}
              </div>
              
              {/* Close button */}
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                onClick={onClose}
                className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
            
            {/* Progress bar */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-white/30"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: duration / 1000, ease: "linear" }}
            />
            
            {/* Sparkle effects */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full"
                style={{
                  top: `${20 + i * 30}%`,
                  left: `${10 + i * 15}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  y: [0, -20, -40],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

