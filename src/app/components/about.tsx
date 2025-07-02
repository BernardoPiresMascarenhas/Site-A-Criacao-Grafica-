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
              className="rounded-2xl shadow-2xl border-4 border-purple-200 object-cover"
            />
          </motion.div>

          {/* Título e textos à direita */}
          <div className="flex flex-col justify-center">
            <motion.h2
              className="text-4xl font-extrabold text-purple-700 mb-4"
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
              A Império dos Pets possui mais de 5 anos de dedicação ao cuidado e à saúde dos animais. Nossa missão vai além de oferecer serviços veterinários — buscamos promover qualidade de vida e bem-estar para cada pet que passa por aqui.
            </motion.p>

            {/* Seção da lista de serviços */}
            <motion.div
                className="mt-6"
                variants={listContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Contamos com uma estrutura completa que reúne:
                </h3>
                <ul className="space-y-3">
                    {services.map((service, index) => (
                        <motion.li key={index} className="flex items-center" variants={listItemVariants}>
                            <div className="text-2xl mr-4">{service.icon}</div>
                            <span className="text-gray-700 text-lg">{service.name}</span>
                        </motion.li>
                    ))}
                </ul>
            </motion.div>

            <motion.p
              className="text-lg text-gray-700 mt-6 leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
            >
              Aqui, cada atendimento é feito com responsabilidade, atenção e muito amor. A saúde e o conforto do seu pet são a nossa prioridade. Trabalhamos todos os dias para que eles tenham uma vida mais feliz, saudável e segura — como verdadeiros membros da família.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;