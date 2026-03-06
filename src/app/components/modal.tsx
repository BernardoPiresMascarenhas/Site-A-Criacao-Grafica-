"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X, WhatsappLogo, CaretLeft, CaretRight, Image as ImageIcon, PaperPlaneTilt, CheckCircle, FilePdf, ShoppingCart } from '@phosphor-icons/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';


interface ModalProps { service: any; closeModal: () => void; }

const Modal: React.FC<ModalProps> = ({ service, closeModal }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState(false);
  const router = useRouter();
  const { addToCart } = useCart();

  // === NOVOS ESTADOS DA CALCULADORA DE QUANTIDADE ===
  const tipoPreco = service?.tipoPrecificacao || "UNIDADE";
  const [quantidadeLivre, setQuantidadeLivre] = useState(1);
  const [pacoteIdSelecionado, setPacoteIdSelecionado] = useState<string | number>("");

  const [opcoesSelecionadas, setOpcoesSelecionadas] = useState<any[]>([]);
  const [arquivoArte, setArquivoArte] = useState<File | null>(null);

  // Garante que o primeiro pacote venha selecionado por padrão
  useEffect(() => {
    if (tipoPreco === "PACOTE" && service?.pacotes?.length > 0 && !pacoteIdSelecionado) {
      setPacoteIdSelecionado(service.pacotes[0].id);
    }
  }, [service, tipoPreco, pacoteIdSelecionado]);

  if (!service) return null;

  // === O NOVO CÉREBRO MATEMÁTICO ===
  const somaVariacoes = opcoesSelecionadas.reduce((soma, op) => soma + op.precoExtra, 0);
  let precoTotal = 0;
  let textoQuantidade = "";

  if (tipoPreco === "UNIDADE") {
    // Unidade: Multiplica o valor do produto e dos acabamentos pela quantidade escolhida
    precoTotal = ((service.precoBase || 0) + somaVariacoes) * quantidadeLivre;
    textoQuantidade = `${quantidadeLivre} unidade(s)`;
  } else {
    // Pacote: Pega o preço do lote fechado e soma o valor dos acabamentos
    const pacoteAtual = service.pacotes?.find((p: any) => String(p.id) === String(pacoteIdSelecionado)) || service.pacotes?.[0];
    precoTotal = (pacoteAtual?.preco || 0) + somaVariacoes;
    textoQuantidade = pacoteAtual ? `${pacoteAtual.quantidade} unidades (Pacote)` : "";
  }

  const toggleOpcao = (variacao: any) => {
    const jaSelecionado = opcoesSelecionadas.find(op => op.id === variacao.id);
    if (jaSelecionado) {
      setOpcoesSelecionadas(opcoesSelecionadas.filter(op => op.id !== variacao.id));
    } else {
      setOpcoesSelecionadas([...opcoesSelecionadas, variacao]);
    }
  };

  const adicionarAoCarrinho = async () => {
    setCarregando(true);

    try {
        let urlArte = "";
        // Se o cliente anexou a arte, nós fazemos o upload AGORA, para o carrinho já guardar o link pronto!
        if (arquivoArte) {
            const envelope = new FormData();
            envelope.append("file", arquivoArte);
            const respostaUpload = await fetch("http://localhost:3333/upload", { method: "POST", body: envelope });
            const dadosUpload = await respostaUpload.json();
            urlArte = dadosUpload.url;
        }

        // Criamos o "pacotinho" de dados que vai para a memória do navegador
        const novoItemNoCarrinho = {
            idCart: Date.now().toString(), // Gera um ID único na hora
            produtoNome: service.title,
            quantidadeTexto: tipoPreco === "UNIDADE" ? `${quantidadeLivre} unidade(s)` : textoQuantidade,
            preco: precoTotal,
            opcoesExtras: opcoesSelecionadas.map(op => ({ 
                nome: op.nome, 
                preco: op.precoExtra 
            })),
            arteUrl: urlArte || undefined,
        };

        // Salva no Contexto (que automaticamente salva no localStorage)
        addToCart(novoItemNoCarrinho);

        setMensagemSucesso(true);
        // Fecha o modal rapidinho para ele continuar comprando
        setTimeout(() => { 
            setMensagemSucesso(false); 
            closeModal(); 
        }, 1500); 

    } catch (error) {
        alert("Erro ao processar o arquivo. Tente novamente.");
    } finally {
        setCarregando(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm" onClick={closeModal}>
        
        {/* MÁGICA 1: h-[100dvh] e rounded-none no Mobile (Tela Cheia), e h-[85vh] com bordas no PC */}
        <motion.div initial={{ opacity: 0, y: "100%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="relative bg-white w-full max-w-5xl rounded-none md:rounded-2xl shadow-2xl flex flex-col md:flex-row h-[100dvh] md:h-[85vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
          
          <button 
            onClick={closeModal} 
            className="absolute top-4 right-4 z-50 p-2 rounded-full transition-all text-slate-800 bg-white/80 backdrop-blur-md hover:bg-slate-200 shadow-sm"
          >
            <X size={24} weight="bold" />
          </button>

          {/* COLUNA ESQUERDA (IMAGENS) - Ajustei a altura para ficar bonito no celular */}
          <div className="relative w-full md:w-5/12 h-[35vh] md:h-full bg-slate-50 md:bg-slate-900 flex flex-col justify-center flex-shrink-0 border-b md:border-b-0 border-slate-100">
            {service.portfolioItems && service.portfolioItems.length > 0 ? (
                <Swiper modules={[Navigation, Pagination, A11y, Autoplay]} loop={service.portfolioItems.length > 1} spaceBetween={0} slidesPerView={1} className="w-full h-full" onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)} navigation={service.portfolioItems.length > 1 ? { nextEl: '.custom-next', prevEl: '.custom-prev' } : false} pagination={service.portfolioItems.length > 1 ? { clickable: true, bulletActiveClass: '!bg-yellow-400 opacity-100', bulletClass: 'swiper-pagination-bullet !bg-slate-300 md:!bg-white/50 !opacity-100' } : false}>
                {service.portfolioItems.map((item: any) => (
                    <SwiperSlide key={item.id} className="relative w-full h-full flex items-center justify-center">
                    <div className="relative w-full h-full p-6 md:p-12">
                        <Image src={item.image} alt={item.title} fill className="object-contain drop-shadow-md md:drop-shadow-2xl" unoptimized />
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
          <div className="flex-1 flex flex-col min-h-0 bg-white">
            
            {/* CABEÇALHO DO PRODUTO (Fixo no topo da coluna) */}
            <div className="px-6 py-4 md:p-8 pr-16 md:pr-16 border-b border-slate-100 bg-white shrink-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 text-yellow-600 font-semibold text-xs md:text-sm uppercase tracking-wider"><ImageIcon size={16} /><span>Detalhes</span></div>
                
                <div className="bg-yellow-100 text-yellow-800 px-4 py-1.5 rounded-full flex flex-col items-end">
                    <span className="text-[10px] uppercase font-bold tracking-wider leading-none">Total</span>
                    <span className="font-black text-lg leading-none">R$ {precoTotal.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
              <h2 className="text-xl md:text-3xl font-bold text-slate-800 leading-tight">{service.title}</h2>
            </div>

            {/* MÁGICA 2: A área do meio agora é a única que dá scroll! */}
            <div className="flex-1 overflow-y-auto px-6 py-6 md:p-8 space-y-6 md:space-y-8 scroll-smooth">
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">{service.description}</p>

              {/* SELETOR DE QUANTIDADE OU PACOTE */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                {tipoPreco === "UNIDADE" ? (
                  <>
                    <h3 className="font-bold text-slate-800 mb-4">Quantidade desejada:</h3>
                    <div className="flex items-center gap-4">
                      <button type="button" onClick={() => setQuantidadeLivre(Math.max(1, quantidadeLivre - 1))} className="w-10 h-10 flex items-center justify-center bg-white text-slate-800 border border-slate-300 rounded-lg hover:bg-slate-100 font-bold text-xl transition">-</button>
                      <input type="number" min="1" value={quantidadeLivre} onChange={(e) => setQuantidadeLivre(Math.max(1, parseInt(e.target.value) || 1))} className="w-24 p-2 text-center text-slate-800 border border-slate-300 rounded-lg font-bold outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 bg-white" />
                      <button type="button" onClick={() => setQuantidadeLivre(quantidadeLivre + 1)} className="w-10 h-10 flex items-center justify-center bg-white text-slate-800 border border-slate-300 rounded-lg hover:bg-slate-100 font-bold text-xl transition">+</button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="font-bold text-slate-800 mb-4">Escolha a quantidade:</h3>
                    <select value={pacoteIdSelecionado} onChange={(e) => setPacoteIdSelecionado(e.target.value)} className="w-full p-3 text-slate-800 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none bg-white font-bold cursor-pointer transition-all hover:border-yellow-400">
                      {service.pacotes?.map((pacote: any) => (
                        <option key={pacote.id} value={pacote.id} className="text-slate-800">
                          {pacote.quantidade} unidades - R$ {pacote.preco.toFixed(2).replace('.', ',')}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </div>

              {/* OPÇÕES ADICIONAIS (CHECKBOXES) */}
              {service.variacoes && service.variacoes.length > 0 && (
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                      <h3 className="font-bold text-slate-800 mb-4">Personalize o seu pedido:</h3>
                      <div className="space-y-3">
                          {service.variacoes.map((variacao: any) => (
                              <label key={variacao.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-yellow-400 hover:shadow-sm transition-all">
                                  <div className="flex items-center gap-3">
                                      <input type="checkbox" className="w-5 h-5 accent-yellow-500 rounded cursor-pointer" 
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

            {/* RODAPÉ E BOTÕES (Fixo na parte inferior, tiramos o absolute) */}
            <div className="p-4 bg-white border-t border-slate-100 shadow-[0_-5px_15px_rgba(0,0,0,0.02)] shrink-0 flex flex-col sm:flex-row gap-3">
              {mensagemSucesso ? (
                  <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="flex-1 py-3 px-6 bg-green-100 text-green-700 font-bold text-lg rounded-xl flex items-center justify-center gap-2 border border-green-300">
                    <CheckCircle size={24} weight="fill" /><span>Adicionado!</span>
                  </motion.div>
              ) : (
                  <motion.button whileTap={{ scale: 0.98 }} onClick={adicionarAoCarrinho} disabled={carregando} className="flex-1 py-3 px-6 bg-yellow-400 hover:bg-yellow-500 text-[#262A2B] font-black text-lg rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50">
                    <ShoppingCart size={24} weight="bold" /><span>{carregando ? "Processando..." : "Adicionar ao Carrinho"}</span>
                  </motion.button>
              )}
              <a href={`https://api.whatsapp.com/send?phone=5531987090217&text=Olá! Gostaria de tirar uma dúvida.`} target="_blank" rel="noopener noreferrer" className="flex-none">
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