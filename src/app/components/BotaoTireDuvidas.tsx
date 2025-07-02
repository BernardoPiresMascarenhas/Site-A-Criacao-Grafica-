import { motion } from "framer-motion";

export default function BotaoTireDuvidas() {
  return (
    <motion.a
      href="https://wa.me/553195306014?text=Olá,%20gostaria%20de%20tirar%20uma%20dúvida."
      target="_blank"
      rel="noopener noreferrer"
      className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium mt-4 inline-block"
      whileHover={{ scale: 1.05, backgroundColor: "#6b21a8" }} // aumenta e escurece no hover
      whileTap={{ scale: 0.95 }} // efeito ao clicar  
    >
      Tire suas dúvidas aqui
    </motion.a>
  );
}
