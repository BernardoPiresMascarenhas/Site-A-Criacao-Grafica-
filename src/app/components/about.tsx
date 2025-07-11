"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { CheckCircle, Zap } from "lucide-react";

const textContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, 
    },
  },
};

const textItemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

const AboutUs = () => {
  return (
    <section id="about" className="py-20 bg-white z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            className="flex flex-col justify-center"
            variants={textContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <motion.h2
              className="text-4xl font-extrabold text-gray-900 mb-6"
              variants={textItemVariants}
            >
              Sobre Nós
            </motion.h2>

            <motion.p
              className="text-lg text-gray-700 mb-8 leading-relaxed"
              variants={textItemVariants}
            >
              Fundada em 2003 em Belo Horizonte, a A Criação Gráfica vem se consolidando a cada ano, tornando-se a melhor opção para agências de publicidade e empresas que buscam compromisso, qualidade e excelência.
            </motion.p>
            
            <motion.div variants={textItemVariants} className="mb-8">
              <div className="flex items-center mb-2">
                <CheckCircle className="w-6 h-6 text-yellow-500 mr-3" />
                <h3 className="text-xl font-bold text-gray-800">
                  Os pequenos detalhes fazem uma grande impressão.
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed pl-9">
                A escolha da melhor empresa de impressão em Belo Horizonte é essencial para garantir resultados de alta qualidade e atender às suas necessidades específicas.
              </p>
            </motion.div>
            
            <motion.div variants={textItemVariants}>
              <div className="flex items-center mb-2">
                <Zap className="w-6 h-6 text-yellow-500 mr-3" />
                <h3 className="text-xl font-bold text-gray-800">
                  SOLUÇÕES QUE FACILITAM
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed pl-9">
                Com o suporte completo de profissionais, a Acriação apresenta a melhor garantia para o seu processo gráfico através da qualidade, prazos, agilidade e atendimento diferenciado.
              </p>
            </motion.div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 grid-rows-2 gap-4 h-[500px]"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className="col-span-2 row-span-1 relative">
              <Image
                src="/sobrenos.png" 
                alt="Equipe da gráfica trabalhando"
                layout="fill"
                objectFit="cover"
                className="rounded-2xl shadow-2xl border-4 border-yellow-200"
              />
            </div>
            <div className="col-span-1 row-span-1 relative">
              <Image
                src="/sobrenos2.png" 
                alt="Detalhe de uma impressão de alta qualidade"
                layout="fill"
                objectFit="cover"
                className="rounded-2xl shadow-2xl border-4 border-yellow-200"
              />
            </div>
            <div className="col-span-1 row-span-1 relative">
              <Image
                src="/sobrenos3.png" 
                alt="Máquina de acabamento gráfico"
                layout="fill"
                objectFit="cover"
                className="rounded-2xl shadow-2xl border-4 border-yellow-200"
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-20 max-w-4xl mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
        >
          <p className="text-lg text-gray-700 leading-relaxed">
            A Acriação Gráfica desenvolve suas atividades com excelência tecnológica, visando à satisfação de seus clientes e a segurança dos funcionários. Quando se trata de impressão gráfica em Belo Horizonte, nossa empresa se destaca como a melhor opção. Oferecemos serviços exclusivos e de alta qualidade que irão impressioná-lo. Com uma equipe altamente qualificada, equipamentos de última geração e uma variedade de opções de acabamento e personalização, estamos prontos para atender a todas as suas necessidades de impressão.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;