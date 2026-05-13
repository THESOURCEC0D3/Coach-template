"use client";

import { motion } from "framer-motion";

export default function FadeInUp({
  children,
  delay = 0,
  duration = 1,
  amount = 0.1,
  className = "",
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
