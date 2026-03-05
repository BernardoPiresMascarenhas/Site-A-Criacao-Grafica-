"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EnvelopeSimple, LockKey, Key, ArrowLeft, CheckCircle, Eye, EyeSlash } from "@phosphor-icons/react";


export default function EsqueciSenhaPage() {
  const router = useRouter();

  // Controle de qual tela o usuário está vendo (1: Pede Email, 2: Pede Código+Senha, 3: Sucesso)
  const [etapa, setEtapa] = useState<1 | 2 | 3>(1);
  
  // Dados do formulário
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  
  // Estados de feedback
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  // ==========================================
  // FUNÇÃO 1: PEDIR O CÓDIGO NO BACKEND
  // ==========================================
  const solicitarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const resposta = await fetch("http://localhost:3333/clientes/esqueci-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        setEtapa(2); // Avança para a tela de digitar o código
      } else {
        setErro(dados.error || "Erro ao solicitar código.");
      }
    } catch (error) {
      setErro("Erro de conexão com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  // ==========================================
  // FUNÇÃO 2: ENVIAR CÓDIGO E NOVA SENHA
  // ==========================================
  const resetarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const resposta = await fetch("http://localhost:3333/clientes/resetar-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, codigo, novaSenha }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        setEtapa(3); // Avança para a tela de sucesso!
      } else {
        setErro(dados.error || "Código inválido ou expirado.");
      }
    } catch (error) {
      setErro("Erro de conexão com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Cabeçalho */}
        <div className="bg-[#262A2B] p-8 text-center relative">
          {etapa !== 3 && (
            <button 
              onClick={() => router.push('/login-cliente')}
              className="absolute left-6 top-8 text-gray-400 hover:text-white transition-colors"
              title="Voltar para o Login"
            >
              <ArrowLeft size={24} weight="bold" />
            </button>
          )}
          <h1 className="text-2xl font-black text-white mt-2">Recuperar Senha</h1>
          <p className="text-gray-400 text-sm mt-2">
            {etapa === 1 && "Vamos te enviar um código de segurança."}
            {etapa === 2 && "Quase lá! Verifique sua caixa de entrada."}
            {etapa === 3 && "Tudo certo com a sua conta!"}
          </p>
        </div>

        <div className="p-8">
          
          {/* ================= ETAPA 1: PEDIR EMAIL ================= */}
          {etapa === 1 && (
            <form onSubmit={solicitarCodigo} className="space-y-5 animate-fade-in">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <EnvelopeSimple size={20} />
                </div>
                <input
                  type="email"
                  placeholder="Digite seu e-mail de cadastro"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 text-slate-800 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-50 focus:bg-white transition-all"
                />
              </div>

              {erro && <p className="text-red-500 text-sm font-semibold text-center">{erro}</p>}

              <button
                type="submit"
                disabled={carregando}
                className="w-full bg-yellow-400 text-[#262A2B] py-3 rounded-xl font-bold text-lg hover:bg-yellow-500 transition-all shadow-sm disabled:opacity-70 mt-2"
              >
                {carregando ? "Enviando código..." : "Receber Código por E-mail"}
              </button>
            </form>
          )}

          {/* ================= ETAPA 2: CÓDIGO + NOVA SENHA ================= */}
          {etapa === 2 && (
            <form onSubmit={resetarSenha} className="space-y-5 animate-fade-in">
              <div className="text-center mb-4">
                <span className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Enviado para: {email}</span>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Key size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Código de 6 dígitos"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  required
                  maxLength={6}
                  className="w-full pl-10 pr-4 py-3 text-slate-800 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-50 focus:bg-white transition-all tracking-[0.2em] font-black text-center"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <LockKey size={20} />
                </div>
                
                <input
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="Sua nova senha"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 text-slate-800 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-50 focus:bg-white transition-all"
                />

                {/* BOTÃO DO OLHINHO AQUI! */}
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-yellow-500 transition-colors"
                >
                  {mostrarSenha ? <EyeSlash size={22} /> : <Eye size={22} />}
                </button>
              </div>

              {erro && <p className="text-red-500 text-sm font-semibold text-center">{erro}</p>}

              <button
                type="submit"
                disabled={carregando}
                className="w-full bg-[#262A2B] text-white py-3 rounded-xl font-bold text-lg hover:bg-yellow-400 hover:text-[#262A2B] transition-all shadow-sm disabled:opacity-70 mt-2"
              >
                {carregando ? "Validando..." : "Alterar Senha"}
              </button>
              
              <button
                type="button"
                onClick={() => setEtapa(1)}
                className="w-full py-2 text-sm font-bold text-gray-500 hover:text-gray-800 transition"
              >
                Não recebi o código. Tentar de novo.
              </button>
            </form>
          )}

          {/* ================= ETAPA 3: SUCESSO ================= */}
          {etapa === 3 && (
            <div className="text-center space-y-4 animate-fade-in py-4">
              <CheckCircle size={80} weight="fill" className="text-green-500 mx-auto" />
              <h2 className="text-2xl font-black text-[#262A2B]">Senha Atualizada!</h2>
              <p className="text-gray-500 text-sm">Sua senha foi alterada com sucesso. Você já pode fazer login na sua conta.</p>
              
              <button
                onClick={() => router.push('/login-cliente')}
                className="w-full bg-yellow-400 text-[#262A2B] py-3 rounded-xl font-bold text-lg hover:bg-yellow-500 transition-all shadow-sm mt-6"
              >
                Ir para o Login
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}