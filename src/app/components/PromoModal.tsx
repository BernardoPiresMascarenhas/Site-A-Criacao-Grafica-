"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from 'next/image'; // MUDANÇA: Importar o componente Image

type PromoModalProps = {
  onClose: () => void;
  onWhatsApp: () => void;
};

const PromoModal = ({ onClose, onWhatsApp }: PromoModalProps) => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-60 backdrop-blur-sm p-4 pt-40"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* CONTEÚDO DO MODAL */}
        <motion.div
          className="relative bg-white rounded-3xl shadow-2xl border border-yellow-300 w-full max-w-sm mx-auto"
          initial={{ y: -40, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botão de fechar */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition-all z-10"
          >
            <X size={24} />
          </button>

          <div className="p-6">
              {/* Título animado */}
              <motion.h2
                className="text-center text-xl font-bold text-yellow-500 mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                🔥 Promoção Especial! 🔥
              </motion.h2>

              {/* Imagem */}
              <motion.div
                className="flex justify-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {/* MUDANÇA: Troca de <img> por <Image> */}
                <Image
                  src="/promocao.png"
                  alt="Promoção"
                  width={400} // Defina a largura real da sua imagem
                  height={400} // Defina a altura real da sua imagem
                  className="rounded-2xl shadow-xl border-4 border-yellow-200 w-full h-auto" // h-auto para manter a proporção
                />
              </motion.div>

              {/* Botão WhatsApp */}
              <motion.button
                onClick={onWhatsApp}
                className="relative w-full py-3 text-white text-lg font-semibold rounded-xl bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 hover:scale-105 transition-transform duration-300 shadow-lg overflow-hidden mt-6"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Eu Quero!
              </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PromoModal;