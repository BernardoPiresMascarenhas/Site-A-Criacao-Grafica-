"use client";


import { motion } from "framer-motion";
import Image from "next/image";
import { Scissors, HeartPulse } from "lucide-react";


import { FaStethoscope, FaSyringe, FaMicroscope, FaShoppingCart} from 'react-icons/fa';

const AboutUs = () => {
  
  const services = [
    { icon: <FaStethoscope className="text-purple-500" />, name: "Consultas veterinárias" },
    { icon: <FaSyringe className="text-purple-500" />, name: "Vacinações" },
    { icon: <FaMicroscope className="text-purple-500" />, name: "Exames" },
    { icon: <HeartPulse className="text-purple-500" />, name: "Pequenos procedimentos cirúrgicos" },
    { icon: <FaShoppingCart className="text-purple-500" />, name: "Pet shop com produtos selecionados" },
    { icon: <Scissors className="text-purple-500" />, name: "Banho e tosa com cuidado e carinho" },
  ];

  
  const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, 
      },
    },
  };

  const listItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Imagem à esquerda */}
          <motion.div
            className="flex justify-center"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Image
              src="/sobrenos.png"
              alt="Cachorro e gato sorrindo"
              width={400}
              height={400}
              className="rounded-2xl shadow-2xl border-4 border-yellow-200 object-cover"
            />
          </motion.div>

          {/* Título e textos à direita */}
          <div className="flex flex-col justify-center">
            <motion.h2
              className="text-4xl font-extrabold text-gray-900 mb-4"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              viewport={{ once: true }}
            >
              Sobre Nós
            </motion.h2>

            <motion.p
              className="text-lg text-gray-700 mb-4 leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              À partir do desejo e vocação de seus idealizadores, que já atuaram neste segmento há algum tempo e sentiram a necessidade de unir forças, esforços e competências para fazer a diferença no mercado de impressões gráficas, fundou se em 2003 em Belo Horizonte, a A Criação Gráfica, que vem se consolidando e a cada ano tornando a melhor opção de grandes empresas, como agências de publicidade e empresas que querem compromisso e qualidade.
            </motion.p>

            <motion.p
              className="text-lg text-gray-700 mt-6 leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
            >
              A acriação gráfica, empresa da impressão gráfica e que atua em Belo Horizonte, desenvolve suas atividades, produtos e serviços com excelência tecnológica, visando à satisfação de seus clientes e a segurança dos funcionários.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;