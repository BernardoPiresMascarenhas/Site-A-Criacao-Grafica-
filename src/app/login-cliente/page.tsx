"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { EnvelopeSimple, LockKey, Eye, EyeSlash } from "@phosphor-icons/react";

export default function LoginClientePage() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const fazerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const resposta = await fetch("http://localhost:3333/login-unificado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        // 1. Salva o Token VIP na memória do navegador (É isso que o "Meus Pedidos" procura!)
        localStorage.setItem("token_cliente", dados.token);
        
        // Salva os dados do cliente (incluindo o isAdmin) para usar no Menu depois
        localStorage.setItem("dados_cliente", JSON.stringify(dados.cliente));

        // 3. A LINHA MÁGICA QUE SALVA O NOME PARA O CABEÇALHO LER!
        localStorage.setItem("nome_cliente", dados.cliente.nome);
        
        // 2. O GUARDA DE TRÂNSITO (A Mágica do Redirecionamento)
        if (dados.cliente.isAdmin === true) {
          // Se for o chefão, manda pro Painel!
          router.push("/painel"); 
        } else {
          // Se for cliente normal, manda pra Vitrine ou Meus Pedidos
          router.push("/"); 
        }
        
      } else {
        setErro(dados.error || "E-mail ou senha incorretos.");
      }
    } catch (error) {
      setErro("Erro de conexão com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 bg-[url('/header-background.png')] bg-repeat bg-[size:400px_auto]">
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Cabeçalho do Card */}
        <div className="bg-[#262A2B] p-8 text-center flex flex-col items-center">
          <div className="w-40 relative aspect-[3/1] mb-4 cursor-pointer" onClick={() => router.push('/')}>
            <Image 
              src="/logo.png" 
              alt="Logo A Criação" 
              fill 
              className="object-contain brightness-0 invert" 
            />
          </div>
          <h2 className="text-xl font-bold text-white">Bem-vindo(a) de volta!</h2>
          <p className="text-sm text-gray-400 mt-1">Acesse sua conta para pedir orçamentos</p>
        </div>

        {/* Formulário */}
        <div className="p-8">
          <form onSubmit={fazerLogin} className="space-y-5">
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <EnvelopeSimple size={20} />
              </div>
              <input
                type="email"
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                // ADICIONADO: text-slate-800
                className="w-full pl-10 pr-4 py-3 text-slate-800 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all bg-gray-50 focus:bg-white"
              />
            </div>

            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <LockKey size={20} />
                </div>
                
                <input
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="Digite sua Senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
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

            <div className="text-center mt-1">
              <button 
                type="button" 
                onClick={() => router.push('/esqueci-senha')} 
                className="text-sm font-bold text-gray-500 hover:text-yellow-500 transition-colors"
              >
                Esqueceu sua senha?
              </button>
            </div>

            {erro && <p className="text-red-500 text-sm font-semibold text-center">{erro}</p>}

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-yellow-400 text-black py-3 rounded-xl font-bold text-lg hover:bg-yellow-500 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {carregando ? "Entrando..." : "Entrar na Conta"}
            </button>
          </form>

          {/* Link para Cadastro */}
          <div className="mt-8 text-center text-sm text-gray-600">
            Ainda não tem conta?{" "}
            <button 
              onClick={() => router.push('/cadastro-cliente')}
              className="text-blue-600 font-bold hover:underline"
            >
              Crie uma aqui
            </button>
          </div>
        </div>
      </div>
      
      <button 
        onClick={() => router.push('/')}
        className="mt-6 text-gray-500 font-medium hover:text-gray-800 transition"
      >
        ← Voltar para a loja
      </button>

    </div>
  );
}