"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, EnvelopeSimple, Phone, LockKey } from "@phosphor-icons/react";

export default function CadastroClientePage() {
  const router = useRouter();
  
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const fazerCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro("");
    setMensagem("");

    try {
      const resposta = await fetch("http://localhost:3333/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, telefone, email, senha })
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        setMensagem("Conta criada com sucesso! Redirecionando...");
        // Aguarda 2 segundinhos para o cliente ler a mensagem e manda pro Login
        setTimeout(() => {
          router.push("/login-cliente");
        }, 2000);
      } else {
        setErro(dados.error || "Erro ao criar conta.");
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
          <h2 className="text-xl font-bold text-white">Crie sua Conta</h2>
          <p className="text-sm text-gray-400 mt-1">Faça seus orçamentos online</p>
        </div>

        {/* Formulário */}
        <div className="p-8">
          <form onSubmit={fazerCadastro} className="space-y-4">
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User size={20} />
              </div>
              <input
                type="text"
                placeholder="Nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all bg-gray-50 focus:bg-white"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Phone size={20} />
              </div>
              <input
                type="text"
                placeholder="WhatsApp (com DDD)"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all bg-gray-50 focus:bg-white"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <EnvelopeSimple size={20} />
              </div>
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all bg-gray-50 focus:bg-white"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <LockKey size={20} />
              </div>
              <input
                type="password"
                placeholder="Crie uma senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all bg-gray-50 focus:bg-white"
              />
            </div>

            {erro && <p className="text-red-500 text-sm font-semibold text-center">{erro}</p>}
            {mensagem && <p className="text-green-600 text-sm font-semibold text-center">{mensagem}</p>}

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-[#262A2B] text-white py-3 rounded-xl font-bold text-lg hover:bg-yellow-400 hover:text-black transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {carregando ? "Criando conta..." : "Cadastrar"}
            </button>
          </form>

          {/* Link para Login */}
          <div className="mt-8 text-center text-sm text-gray-600">
            Já tem uma conta?{" "}
            <button 
              onClick={() => router.push('/login-cliente')}
              className="text-yellow-600 font-bold hover:underline"
            >
              Faça login aqui
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