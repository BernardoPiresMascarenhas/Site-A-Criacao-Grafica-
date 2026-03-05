"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User, MapPin, ArrowLeft, FloppyDisk, PencilSimple, X } from "@phosphor-icons/react";

export default function MinhaContaPage() {
  const router = useRouter();

  const [id, setId] = useState("");
  const [token, setToken] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState(""); 
  
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });

  const [editando, setEditando] = useState(false);

  const carregarPerfil = useCallback(async () => {
    setCarregando(true);
    const tokenSalvo = localStorage.getItem("token_cliente");
    const dadosSalvos = localStorage.getItem("dados_cliente");

    if (!tokenSalvo || !dadosSalvos) {
      router.push("/login-cliente"); 
      return;
    }

    setToken(tokenSalvo);
    const clienteId = JSON.parse(dadosSalvos).id;
    setId(clienteId);

    try {
      const resposta = await fetch(`http://localhost:3333/clientes/${clienteId}`, {
        headers: { "Authorization": `Bearer ${tokenSalvo}` }
      });

      if (resposta.ok) {
        const dados = await resposta.json();
        setNome(dados.nome || "");
        setTelefone(dados.telefone || "");
        setEmail(dados.email || "");
        setCep(dados.cep || "");
        setLogradouro(dados.logradouro || "");
        setNumero(dados.numero || "");
        setComplemento(dados.complemento || "");
        setBairro(dados.bairro || "");
        setCidade(dados.cidade || "");
        setEstado(dados.estado || "");
      } else {
        // AGORA O SISTEMA AVISA SE ALGO DER ERRADO!
        setMensagem({ texto: `Erro ao buscar dados no servidor (Código ${resposta.status}). Tente relogar.`, tipo: "erro" });
      }
    } catch (error) {
      setMensagem({ texto: "Erro de conexão com o backend. Verifique se ele está rodando.", tipo: "erro" });
    } finally {
      setCarregando(false);
    }
  }, [router]);

  useEffect(() => {
    carregarPerfil();
  }, [carregarPerfil]);

  const buscarCep = async (cepBuscado: string) => {
    if (!editando) return;
    const cepLimpo = cepBuscado.replace(/\D/g, '');
    setCep(cepBuscado);

    if (cepLimpo.length === 8) {
      try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const dados = await resposta.json();
        if (!dados.erro) {
          setLogradouro(dados.logradouro);
          setBairro(dados.bairro);
          setCidade(dados.localidade);
          setEstado(dados.uf);
        }
      } catch (error) {}
    }
  };

  const atualizarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setMensagem({ texto: "", tipo: "" });

    try {
      const resposta = await fetch(`http://localhost:3333/clientes/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          nome, telefone, cep, logradouro, numero, complemento, bairro, cidade, estado
        }),
      });

      if (resposta.ok) {
        setMensagem({ texto: "Perfil atualizado com sucesso!", tipo: "sucesso" });
        localStorage.setItem("nome_cliente", nome); 
        setEditando(false); 
      } else {
        setMensagem({ texto: "Erro ao atualizar dados.", tipo: "erro" });
      }
    } catch (error) {
      setMensagem({ texto: "Erro de conexão com o servidor.", tipo: "erro" });
    } finally {
      setSalvando(false);
    }
  };

  const cancelarEdicao = () => {
    setEditando(false);
    setMensagem({ texto: "", tipo: "" });
    carregarPerfil(); 
  };

  if (carregando) return <div className="min-h-screen flex items-center justify-center text-[#262A2B] font-bold">Carregando seu perfil...</div>;

  // A MÁGICA VISUAL ACONTECE AQUI (Sem bug de transparência!)
  const inputClass = `w-full mt-1 transition-all outline-none ${
    !editando 
      ? 'bg-transparent border-transparent text-[#262A2B] font-black text-lg px-0 py-1 cursor-default' 
      : 'px-4 py-3 rounded-xl text-slate-800 border border-gray-200 focus:ring-2 focus:ring-yellow-400 bg-gray-50 focus:bg-white'
  }`;

  return (
    <div className="min-h-screen bg-gray-50 p-4 py-10 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 h-fit">
        
        <div className="bg-[#262A2B] p-8 relative flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => router.push('/')} className="text-gray-400 hover:text-white transition-colors mr-4" title="Voltar ao início">
              <ArrowLeft size={24} weight="bold" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-white">Minha Conta</h1>
              <p className="text-gray-400 text-sm mt-1">Gerencie seus dados e endereços de entrega.</p>
            </div>
          </div>
        </div>

        <form onSubmit={atualizarPerfil} className="p-8">
          
          <div className="flex justify-end mb-8 border-b pb-4">
            {!editando ? (
              <button 
                type="button" 
                onClick={() => { setEditando(true); setMensagem({texto: "", tipo: ""}); }} 
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl font-bold hover:bg-yellow-400 hover:text-black transition-all shadow-sm"
              >
                <PencilSimple size={20} weight="bold" />
                Editar Informações
              </button>
            ) : (
              <button 
                type="button" 
                onClick={cancelarEdicao} 
                className="flex items-center gap-2 bg-red-50 text-red-600 px-5 py-2.5 rounded-xl font-bold hover:bg-red-100 transition-colors"
              >
                <X size={20} weight="bold" />
                Cancelar Edição
              </button>
            )}
          </div>

          {mensagem.texto && (
            <div className={`p-4 mb-6 rounded-xl text-center font-bold ${mensagem.tipo === 'sucesso' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {mensagem.texto}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-[#262A2B] flex items-center gap-2">
                <User size={24} className="text-yellow-500" weight="fill" /> Meus Dados
              </h2>
              
              <div className="space-y-2 pt-2 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                <div>
                  <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">Nome Completo</label>
                  <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} readOnly={!editando} required className={inputClass} />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">Telefone / WhatsApp</label>
                  <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} readOnly={!editando} required className={inputClass} />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">E-mail</label>
                  <input type="email" value={email} readOnly className={`w-full mt-1 transition-all outline-none bg-transparent border-transparent font-black text-lg px-0 py-1 cursor-not-allowed ${!editando ? 'text-[#262A2B]' : 'text-gray-400'}`} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-bold text-[#262A2B] flex items-center gap-2">
                <MapPin size={24} className="text-yellow-500" weight="fill" /> Endereço Principal
              </h2>
              
              <div className="space-y-2 pt-2 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">CEP</label>
                    <input type="text" value={cep} onChange={(e) => buscarCep(e.target.value)} readOnly={!editando} maxLength={9} className={inputClass} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">Rua / Avenida</label>
                    <input type="text" value={logradouro} onChange={(e) => setLogradouro(e.target.value)} readOnly={!editando} className={inputClass} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">Número</label>
                    <input type="text" value={numero} onChange={(e) => setNumero(e.target.value)} readOnly={!editando} className={inputClass} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">Complemento</label>
                    <input type="text" value={complemento} onChange={(e) => setComplemento(e.target.value)} readOnly={!editando} placeholder={editando ? "Apto, Bloco..." : "-"} className={inputClass} />
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-5">
                    <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">Bairro</label>
                    <input type="text" value={bairro} onChange={(e) => setBairro(e.target.value)} readOnly={!editando} className={inputClass} />
                  </div>
                  <div className="col-span-5">
                    <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">Cidade</label>
                    <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} readOnly={!editando} className={inputClass} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">UF</label>
                    <input type="text" value={estado} onChange={(e) => setEstado(e.target.value)} readOnly={!editando} maxLength={2} className={`${inputClass} uppercase`} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {editando && (
            <div className="mt-10 flex justify-end border-t pt-6 animate-fade-in">
              <button
                type="submit"
                disabled={salvando}
                className="bg-yellow-400 text-[#262A2B] px-8 py-3 rounded-xl font-black text-lg hover:bg-yellow-500 transition-all shadow-md disabled:opacity-70 flex items-center gap-2"
              >
                <FloppyDisk size={24} weight="bold" />
                {salvando ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}