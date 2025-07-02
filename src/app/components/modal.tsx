
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  title: string;
  description: string;
  wpplink: string;
  img: string;
  closeModal: () => void;
  directToCatalog?: boolean;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: "-5%" },
  visible: {
    opacity: 1,
    scale: 1,
    y: "0%",
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  exit: { opacity: 0, scale: 0.9, y: "5%" },
};

const Modal: React.FC<ModalProps> = ({ title, description, closeModal, wpplink, img, directToCatalog }) => {
  const [showCatalog, setShowCatalog] = useState(directToCatalog || false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const isPharmacy = title === "Farmácia Pet";
  const isPetShop = title === "Pet Shop";

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const pharmacyItems = [
    { id: 1, name: "Bravecto - 250mg", image: "/catalogo/farmacia/Bravecto250mg.png", available: true, price: "R$ 214,90", category: "Antiparasitários", onSale: false },
    { id: 2, name: "Bravecto - 112,50mg", image: "/catalogo/farmacia/BravectoCães 112,5mg.png", available: true, price: "R$ 197,90", category: "Antiparasitários", onSale: false },
    { id: 3, name: "Bravecto - 500mg", image: "/catalogo/farmacia/Bravecto500.png", available: true, price: "R$ 256,00", category: "Antiparasitários", onSale: false },
    { id: 4, name: "Defenza - 200mg", image: "/catalogo/farmacia/Defenza.png", available: true, price: "R$ 119,90", category: "Antiparasitários", onSale: false },
    { id: 5, name: "Vermífugo Vetmax Plus", image: "/catalogo/farmacia/Vermífugo Vetmax Plus.png", available: true, price: "R$ 42,90", category: "Vermífugos", onSale: false }, 
    { id: 6, name: "Simparic - 80mg", image: "/catalogo/farmacia/Simparic80.png", available: true, price: "R$ 139,90", category: "Antiparasitários", onSale: false },
    { id: 7, name: "Simparic - 40mg", image: "/catalogo/farmacia/Simparic40.png", available: true, price: "R$ 115,00", category: "Antiparasitários", onSale: false },
    { id: 8, name: "Simparic - 20mg", image: "/catalogo/farmacia/Simparic20.png", available: true, price: "R$ 95,00", category: "Antiparasitários", onSale: false },
    { id: 9, name: "Simparic - 10mg", image: "/catalogo/farmacia/Simparic10.png", available: true, price: "R$ 89,90", category: "Antiparasitários", onSale: false },
    { id: 10, name: "Scalibor - Grande", image: "/catalogo/farmacia/Scalibor Grande.png", available: true, price: "R$ 140,00", category: "Antiparasitários", onSale: false },
    { id: 11, name: "Scalibor - Pequeno e médio", image: "/catalogo/farmacia/Scalibor - Pequeno e médio.png", available: true, price: "R$ 120,00", category: "Antiparasitários", onSale: false },
    { id: 12, name: "Defendpro - antiparasitário gatos", image: "/catalogo/farmacia/Defendpro - antiparasitário gatos.png", available: true, price: "R$ 25,90", category: "Antiparasitários", onSale: false },
    { id: 13, name: "Glicopan pet", image: "/catalogo/farmacia/Glicopan pet.png", available: true, price: "R$ 39,90", category: "Suplemento Vitamínico", onSale: false },
    { id: 14, name: "Hemolitan pet", image: "/catalogo/farmacia/Hemolitan pet.png", available: true, price: "R$ 41,90", category: "Suplemento Vitamínico", onSale: false },
    { id: 15, name: "Enterex", image: "/catalogo/farmacia/Enterex.png", available: true, price: "R$ 23,90", category: "Anti tóxico", onSale: false }, 
    { id: 16, name: "Pulvex", image: "/catalogo/farmacia/Pulvex.png", available: true, price: "R$ 49,90", category: "Antiparasitários", onSale: false },
    { id: 17, name: "Mectal - Gatos", image: "/catalogo/farmacia/Mectal - Gatos.png", available: true, price: "R$ 39,90", category: "Vermífugos", onSale: false },
    { id: 18, name: "Mectal - Filhotes", image: "/catalogo/farmacia/Mectal - Filhotes.png", available: true, price: "R$ 55,90", category: "Vermífugos", onSale: false },
    { id: 19, name: "Sarniran", image: "/catalogo/farmacia/Sarniran.png", available: true, price: "R$ 25,90", category: "Antiparasitários", onSale: false },
    { id: 20, name: "Endogard - 10kg", image: "/catalogo/farmacia/Endogard - 10kg.png", available: true, price: "R$ 55,90", category: "Vermífugos", onSale: false },
    { id: 21, name: "Compplet Mix", image: "/catalogo/farmacia/comppletmix.png", available: true, price: "R$ 39,90", category: "Suplemento Vitamínico", onSale: false },

  ];

  const petShopItems = [
    { id: 1, name: "Removedor de Cerúmem", image: "/catalogo/petshop/RemovedordeCerúmem.png", available: true, price: "R$ 59,90", category: "Higiene", onSale: false },
    { id: 2, name: "Kit Otovet", image: "/catalogo/petshop/KitOtovet.png", available: true, price: "R$ 79,90", category: "Higiene", onSale: false },
    { id: 3, name: "Otovet", image: "/catalogo/petshop/Otovet.png", available: true, price: "R$ 35,90", category: "Higiene", onSale: false },
    { id: 4, name: "Limpa Orelha", image: "/catalogo/petshop/LimpaOrelhas.png", available: true, price: "R$ 19,90", category: "Higiene", onSale: false },
    { id: 5, name: "DentaBite", image: "/catalogo/petshop/Dentabite.png", available: true, price: "R$ 3,50", category: "Petisco", onSale: false },
    { id: 6, name: "Creme Dental", image: "/catalogo/petshop/CremeDental.png", available: true, price: "R$ 17,90", category: "Higiene", onSale: false },
    { id: 7, name: "Hálito Pet", image: "/catalogo/petshop/HálitoPet.png", available: true, price: "R$ 29,90", category: "Higiene", onSale: false },
    { id: 8, name: "Educador - Pipi Pode", image: "/catalogo/petshop/EducadorPipiPode.png", available: true, price: "R$ 25,90", category: "Higiene", onSale: false },
    { id: 9, name: "Educador de Mordidas", image: "/catalogo/petshop/EducadorDeMordidas.png", available: true, price: "R$ 24,90", category: "Higiene", onSale: false },
    { id: 10, name: "Educador - Pipi não Pode", image: "/catalogo/petshop/EducadorPipiNãoPode.png", available: true, price: "R$ 27,90", category: "Higiene", onSale: false },
    { id: 11, name: "Banho a seco", image: "/catalogo/petshop/BANHOSECO.png", available: true, price: "R$ 31,90", category: "Higiene", onSale: false },
    { id: 12, name: "Kit xixi stop", image: "/catalogo/petshop/xixistop.png", available: true, price: "R$ 23,90", category: "Higiene", onSale: false },
    { id: 13, name: "Luva Mágica", image: "/catalogo/petshop/LuvaMagica.png", available: true, price: "R$ 28,90", category: "Higiene", onSale: false },
    { id: 14, name: "Limpa lágrimas", image: "/catalogo/petshop/LIMPALAGRIMAS.png", available: true, price: "R$ 31,90", category: "Higiene", onSale: false },
    { id: 15, name: "Limpa dobrinhas", image: "/catalogo/petshop/LIMPADOBRINHA.png", available: true, price: "R$ 25,90", category: "Higiene", onSale: false },
    { id: 16, name: "Limpa carinha", image: "/catalogo/petshop/LIMPACARINHA.png", available: true, price: "R$ 39,90", category: "Higiene", onSale: false },
    { id: 17, name: "Canelone", image: "/catalogo/petshop/SnacksmastigáveisCanelone.png", available: true, price: "R$ 29,90", category: "Petisco", onSale: false },
    { id: 18, name: "Snacks de Osso", image: "/catalogo/petshop/SnacksmastigáveisOsso.png", available: true, price: "R$ 21,90", category: "Petisco", onSale: false },
    { id: 19, name: "Trança bovina", image: "/catalogo/petshop/SnacksmastigáveisTrançaBovina.png", available: true, price: "R$ 31,90", category: "Petisco", onSale: false },
    { id: 20, name: "Biscoito Doogs", image: "/catalogo/petshop/BiscoitoDoogs.png", available: true, price: "R$ 12,90", category: "Petisco", onSale: false },
    { id: 21, name: "Doogs Dental Care", image: "/catalogo/petshop/DentalCare.png", available: true, price: "R$ 26,90", category: "Petisco", onSale: false },
    { id: 22, name: "Bifinhos", image: "/catalogo/petshop/Bifinhos.png", available: true, price: "R$ 3,90", category: "Petisco", onSale: false },
    { id: 23, name: "Casco Bovino", image: "/catalogo/petshop/CascoBovino.png", available: true, price: "R$ 25,90", category: "Petisco", onSale: false },
    { id: 24, name: "Chifre Bovino", image: "/catalogo/petshop/ChifreBovino.png", available: true, price: "R$ 17,90", category: "Petisco", onSale: false },
    { id: 25, name: "Nuggets Caats", image: "/catalogo/petshop/NuggetsCaats.png", available: true, price: "R$ 8,90", category: "Petisco", onSale: false },
    { id: 26, name: "Orelha Bovina", image: "/catalogo/petshop/OrelhaBovina.png", available: true, price: "R$ 9,90", category: "Petisco", onSale: false },
    { id: 27, name: "Bola Mágica", image: "/catalogo/petshop/BolaMagica.png", available: true, price: "R$ 59,90", category: "Brinquedos", onSale: false },
    { id: 28, name: "Bolinha com guizo", image: "/catalogo/petshop/BolinhascomGuizo.png", available: true, price: "R$ 2,50", category: "Brinquedos", onSale: false },
    { id: 29, name: "Ratinho", image: "/catalogo/petshop/ratinho.png", available: true, price: "R$ 6,90", category: "Brinquedos", onSale: false },
    { id: 30, name: "Bola Lisa", image: "/catalogo/petshop/BolaLisa.png", available: true, price: "R$ 39,90", category: "Brinquedos", onSale: false },
    { id: 31, name: "Graveto Nylon", image: "/catalogo/petshop/Graveto.png", available: true, price: "R$ 33,90", category: "Brinquedos", onSale: false },
    { id: 32, name: "Bola Maluca", image: "/catalogo/petshop/BolaMaluca.png", available: true, price: "R$ 39,90", category: "Brinquedos", onSale: false },
    { id: 33, name: "Alimentador Pet", image: "/catalogo/petshop/AlimentadorPet.png", available: true, price: "R$ 98,00", category: "Acessórios", onSale: false },
    { id: 34, name: "Cortador de unha", image: "/catalogo/petshop/Cortadordeunha.png", available: true, price: "R$ 32,90", category: "Higiene", onSale: false },
    { id: 35, name: "Cata Caca", image: "/catalogo/petshop/CataCaca.png", available: true, price: "R$ 9,90", category: "Higiene", onSale: false },
    { id: 36, name: "Denta Bone", image: "/catalogo/petshop/DentalBone.png", available: true, price: "R$ 11,90", category: "Brinquedos", onSale: false },
    { id: 37, name: "Pazinha", image: "/catalogo/petshop/Pazinha.png", available: true, price: "R$ 6,90", category: "Higiene", onSale: false },
   
  ];
  
  const WHATSAPP_NUMBER = "553195306014";
  const currentItems = isPharmacy ? pharmacyItems : petShopItems;
  const categories = ["Todos", ...Array.from(new Set(currentItems.map(i => i.category))), "Desconto"];

  const filteredItems = currentItems.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategory === "Todos" ||
      (selectedCategory === "Desconto" && item.onSale) ||
      item.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-gray-900 bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50 p-4"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={handleBackdropClick}
      >
        <motion.div
          className="bg-gradient-to-br from-white to-purple-50 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-purple-100 relative"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
           <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 hover:scale-110 transition-transform z-10">
              <X size={24} />
           </button>
          
          {!showCatalog ? (
            <>
              <h3 className="text-2xl font-bold text-purple-800 mb-4">{title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
              <motion.div
                className="flex justify-center"
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Image
                  src={img}
                  alt="petImage"
                  width={500}
                  height={250}
                  objectFit="contain"
                  className="rounded-xl border-4 border-purple-300 shadow-xl hover:shadow-purple-400 transition duration-300"
                />
              </motion.div>
              <div className="flex flex-wrap items-center justify-start gap-4 mt-6">
                {wpplink && (
                  <a href={wpplink} target="_blank" rel="noopener noreferrer" className="w-full">
                    <motion.button
                      className="relative w-full py-3 text-white text-lg font-semibold rounded-xl bg-gradient-to-r from-green-500 via-green-400 to-green-600 transition-transform duration-300 shadow-lg overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Entre em Contato
                    </motion.button>
                  </a>
                )}
                {(isPharmacy || isPetShop) && (
                  <button
                    onClick={() => setShowCatalog(true)}
                    className="bg-purple-600 hover:bg-purple-700 transition px-4 py-2 rounded-lg text-white shadow-md"
                  >
                    Catálogo
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <h3 className="text-2xl font-bold text-purple-800 mb-4">{title}</h3>
              <input
                type="text"
                placeholder="Pesquisar produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 mb-4 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-400"
              />
              <div className="flex gap-2 flex-wrap mb-4">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${
                      selectedCategory === cat
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-transparent pr-2">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => {
                    const ProductCard = (
                       <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="relative flex flex-col items-center border p-3 rounded-xl bg-white shadow-md h-full"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={100}
                            height={100}
                            className={`object-contain h-[90px] ${!item.available ? "opacity-50" : ""}`}
                          />
                           {item.onSale && (
                            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-md">
                              Promoção
                            </span>
                          )}
                           <span className={`text-sm mt-2 ${item.onSale ? 'text-green-600 font-semibold' : 'text-gray-800 font-medium'}`}>
                            {item.price}
                           </span>
                          <p className="text-sm text-gray-700 text-center mt-1 flex-grow">{item.name}</p>
                           {!item.available && (
                            <span className="text-red-500 text-xs font-bold mt-1">Indisponível</span>
                          )}
                        </motion.div>
                    );
                    
                    if (item.available) {
                      const wppMessage = `Olá! Tenho interesse no produto: ${item.name}.`;
                      const wppLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(wppMessage)}`;
                      return (
                        <a href={wppLink} target="_blank" rel="noopener noreferrer" key={item.id} className="hover:scale-105 transition-transform duration-300 block">
                          {ProductCard}
                        </a>
                      )
                    } else {
                      return (
                        <div key={item.id} className="cursor-not-allowed">
                          {ProductCard}
                        </div>
                      )
                    }
                  })
                ) : (
                  <p className="text-center text-gray-500 col-span-2 sm:col-span-3">Produto não encontrado.</p>
                )}
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;