
"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

type PromoModalProps = {
  onClose: () => void;
  onWhatsApp: () => void;
};

const PromoModal = ({ onClose, onWhatsApp }: PromoModalProps) => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* AJUSTE 1: Diminuí a largura máxima para 'sm' e a altura máxima para 85vh */}
        <motion.div
          className="relative bg-white rounded-3xl shadow-2xl border border-purple-300 overflow-y-auto max-h-[85vh] w-full max-w-sm p-6"
          initial={{ y: -40, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Botão de fechar */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition-all"
          >
            <X size={24} />
          </button>

          {/* Título animado */}
          <motion.h2
            className="text-center text-xl font-bold text-purple-700 mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            🎉 Promoção Especial! 🎉
          </motion.h2>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.div
            className="flex justify-center"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.img
              src="/promocao.png"
              alt="Promoção"
              // AJUSTE 2: Diminuí a altura máxima da imagem para 45vh
              className="rounded-2xl shadow-xl border-4 border-purple-200 transition duration-300 w-auto max-h-[45vh]"
              whileHover={{ scale: 1.05 }}
              />
          </motion.div>

          {/* Botão WhatsApp */}
          <motion.button
            onClick={onWhatsApp}
            className="relative w-full py-3 text-white text-lg font-semibold rounded-xl bg-gradient-to-r from-green-500 via-green-400 to-green-600 hover:scale-105 transition-transform duration-300 shadow-lg overflow-hidden mt-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Eu Quero!
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PromoModal;