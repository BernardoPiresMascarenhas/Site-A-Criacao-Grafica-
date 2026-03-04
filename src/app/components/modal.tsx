"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X, WhatsappLogo, CaretLeft, CaretRight, Image as ImageIcon, PaperPlaneTilt, CheckCircle, FilePdf } from '@phosphor-icons/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps { service: any; closeModal: () => void; }

const Modal: React.FC<ModalProps> = ({ service, closeModal }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState(false);
  const router = useRouter();

  // STATES DA CALCULADORA
  const [opcoesSelecionadas, setOpcoesSelecionadas] = useState<any[]>([]);
  const [arquivoArte, setArquivoArte] = useState<File | null>(null);

  if (!service) return null;

  // Calcula o preço final em tempo real (Preço Base + Soma das Variações Escolhidas)
  const precoTotal = service.precoBase + opcoesSelecionadas.reduce((soma, op) => soma + op.precoExtra, 0);

  const toggleOpcao = (variacao: any) => {
    const jaSelecionado = opcoesSelecionadas.find(op => op.id === variacao.id);
    if (jaSelecionado) {
      setOpcoesSelecionadas(opcoesSelecionadas.filter(op => op.id !== variacao.id));
    } else {
      setOpcoesSelecionadas([...opcoesSelecionadas, variacao]);
    }
  };

  const solicitarOrcamento = async () => {
    const token = localStorage.getItem("token_cliente");
    if (!token) {
        alert("Para solicitar online, inicie a sua sessão ou crie uma conta!");
        router.push("/login-cliente");
        return;
    }

    setCarregando(true);

    try {
        // 1. Envia a arte (PDF/JPG) para o servidor primeiro, se o cliente anexou
        let urlArte = "";
        if (arquivoArte) {
            const envelope = new FormData();
            envelope.append("file", arquivoArte);
            const respostaUpload = await fetch("http://localhost:3333/upload", { method: "POST", body: envelope });
            const dadosUpload = await respostaUpload.json();
            urlArte = dadosUpload.url;
        }

        // 2. Monta o pacote com o preço final e as escolhas do cliente
        const pacotePedido = {
            descricao: `Pedido pelo Site: ${service.title}`,
            valor: precoTotal,
            arquivoArte: urlArte || undefined,
            detalhes: {
                // A MÁGICA ESTÁ AQUI: Agora mandamos o nome e o preço extra de cada item!
                opcoesEscolhidas: opcoesSelecionadas.map(op => ({ 
                    nome: op.nome, 
                    preco: op.precoExtra 
                }))
            }
        };

        const resposta = await fetch("http://localhost:3333/vitrine/pedidos", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(pacotePedido)
        });

        if (resposta.ok) {
            setMensagemSucesso(true);
            setTimeout(() => { setMensagemSucesso(false); closeModal(); }, 3000);
        } else {
            alert("Erro ao enviar o pedido. Tente novamente.");
        }
    } catch (error) {
        alert("Erro de conexão com o servidor.");
    } finally {
        setCarregando(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm" onClick={closeModal}>
        <motion.div initial={{ opacity: 0, y: "100%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="relative bg-white w-full max-w-5xl rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col md:flex-row h-[90vh] md:h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
          
          <button onClick={closeModal} className="absolute top-4 right-4 z-50 p-2 rounded-full transition-colors backdrop-blur-md text-slate-600 bg-white/60 hover:bg-slate-200 md:text-white md:bg-white/10 md:hover:bg-slate-100/20">
            <X size={24} weight="bold" />
          </button>

          {/* COLUNA ESQUERDA (IMAGENS) */}
          <div className="relative w-full md:w-5/12 h-64 md:h-full bg-slate-50 md:bg-slate-900 flex flex-col justify-center flex-shrink-0 border-b md:border-b-0 border-slate-100">
            {service.portfolioItems && service.portfolioItems.length > 0 ? (
                <Swiper modules={[Navigation, Pagination, A11y, Autoplay]} loop={service.portfolioItems.length > 1} spaceBetween={0} slidesPerView={1} className="w-full h-full" onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)} navigation={service.portfolioItems.length > 1 ? { nextEl: '.custom-next', prevEl: '.custom-prev' } : false} pagination={service.portfolioItems.length > 1 ? { clickable: true, bulletActiveClass: '!bg-yellow-400 opacity-100', bulletClass: 'swiper-pagination-bullet !bg-slate-300 md:!bg-white/50 !opacity-100' } : false}>
                {service.portfolioItems.map((item: any) => (
                    <SwiperSlide key={item.id} className="relative w-full h-full flex items-center justify-center">
                    <div className="relative w-full h-full p-6 md:p-12">
                        <Image 
                           src={item.image} 
                           alt={item.title} 
                           fill 
                           className="object-contain drop-shadow-md md:drop-shadow-2xl" 
                           unoptimized // <--- A MÁGICA ESTÁ AQUI TAMBÉM!
                        />
                    </div>
                    </SwiperSlide>
                ))}
                </Swiper>
            ) : (
                <div className="flex items-center justify-center h-full text-gray-400"><ImageIcon size={48} /></div>
            )}
            
            {service.portfolioItems && service.portfolioItems.length > 1 && (
              <>
                <button className="custom-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white hover:text-yellow-400 hidden md:block"><CaretLeft size={32} weight="bold" /></button>
                <button className="custom-next absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white hover:text-yellow-400 hidden md:block"><CaretRight size={32} weight="bold" /></button>
              </>
            )}
          </div>

          {/* COLUNA DIREITA (CONTEÚDO E CALCULADORA) */}
          <div className="flex-1 flex flex-col min-h-0 bg-white relative">
            <div className="px-6 py-4 md:p-8 border-b border-slate-100 bg-white z-10">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 text-yellow-600 font-semibold text-xs md:text-sm uppercase tracking-wider"><ImageIcon size={16} /><span>Detalhes</span></div>
                
                {/* PREÇO FINAL DINÂMICO! */}
                <div className="bg-yellow-100 text-yellow-800 px-4 py-1.5 rounded-full flex flex-col items-end">
                    <span className="text-[10px] uppercase font-bold tracking-wider leading-none">Total</span>
                    <span className="font-black text-lg leading-none">R$ {precoTotal.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
              <h2 className="text-xl md:text-3xl font-bold text-slate-800 leading-tight">{service.title}</h2>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 md:p-8 space-y-6 md:space-y-8 scroll-smooth pb-32 md:pb-8">
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">{service.description}</p>

              {/* OPÇÕES ADICIONAIS (CHECKBOXES) */}
              {service.variacoes && service.variacoes.length > 0 && (
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                      <h3 className="font-bold text-slate-800 mb-4">Personalize o seu pedido:</h3>
                      <div className="space-y-3">
                          {service.variacoes.map((variacao: any) => (
                              <label key={variacao.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-yellow-400 hover:shadow-sm transition-all">
                                  <div className="flex items-center gap-3">
                                      <input type="checkbox" className="w-5 h-5 accent-yellow-500 rounded" 
                                        onChange={() => toggleOpcao(variacao)} 
                                        checked={!!opcoesSelecionadas.find(op => op.id === variacao.id)} 
                                      />
                                      <span className="text-sm font-semibold text-slate-700">{variacao.nome}</span>
                                  </div>
                                  <span className="text-sm font-black text-green-600">+ R$ {variacao.precoExtra.toFixed(2)}</span>
                              </label>
                          ))}
                      </div>
                  </div>
              )}

              {/* UPLOAD DE PDF PELO CLIENTE */}
              <div className="border border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition cursor-pointer relative">
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png,.cdr" onChange={(e) => setArquivoArte(e.target.files ? e.target.files[0] : null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <FilePdf size={40} className={`mx-auto mb-2 ${arquivoArte ? 'text-green-500' : 'text-gray-400'}`} weight="duotone" />
                  <p className="text-sm font-bold text-gray-700">{arquivoArte ? arquivoArte.name : "Anexe a sua Arte (PDF, JPG, CDR)"}</p>
                  <p className="text-xs text-gray-400 mt-1">Clique ou arraste o arquivo aqui</p>
              </div>

            </div>

            <div className="p-4 bg-white border-t border-slate-100 shadow-[0_-5px_15px_rgba(0,0,0,0.02)] z-20 absolute bottom-0 w-full flex flex-col sm:flex-row gap-3">
              {mensagemSucesso ? (
                  <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="flex-1 py-3 px-6 bg-green-100 text-green-700 font-bold text-lg rounded-xl flex items-center justify-center gap-2 border border-green-300">
                    <CheckCircle size={24} weight="fill" /><span>Pedido Enviado!</span>
                  </motion.div>
              ) : (
                  <motion.button whileTap={{ scale: 0.98 }} onClick={solicitarOrcamento} disabled={carregando} className="flex-1 py-3 px-6 bg-[#262A2B] hover:bg-yellow-400 hover:text-black text-white font-bold text-lg rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50">
                    <PaperPlaneTilt size={24} weight="fill" /><span>{carregando ? "A enviar..." : "Enviar Pedido"}</span>
                  </motion.button>
              )}
              <a href={`https://api.whatsapp.com/send?phone=5531987090217&text=Olá!`} target="_blank" rel="noopener noreferrer" className="flex-none">
                <motion.button whileTap={{ scale: 0.98 }} className="w-full sm:w-auto py-3 px-4 bg-[#25D366] hover:bg-[#1da851] text-white font-bold rounded-xl flex items-center justify-center shadow-lg"><WhatsappLogo size={24} weight="fill" /></motion.button>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Modal;