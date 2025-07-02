"use client"
import { motion } from "framer-motion"

const BotaoAgendamento = () => {
  const scrollToSection = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault()
    const section = document.getElementById(sectionId)
    if (section) section.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <motion.a
      href="#contact"
      onClick={(e) => scrollToSection(e, "contact")}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors inline-block"
    >
      Agende uma Consulta
    </motion.a>
  )
}

export default BotaoAgendamento
