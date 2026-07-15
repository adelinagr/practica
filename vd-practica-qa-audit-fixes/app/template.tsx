"use client";

import { motion } from "framer-motion";

export default function RootTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col min-h-[calc(100vh-64px)]"
    >
      {children}
    </motion.div>
  );
}
