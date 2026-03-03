"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // 1. Importamos a ferramenta de rotas

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState(false);
  
  const router = useRouter(); // 2. Ativamos o roteador aqui

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setMensagem("Conectando...");
    setErro(false);

    try {
      const resposta = await fetch("http://localhost:3333/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        setMensagem("Login aprovado! Entrando...");
        setErro(false);
        
        // Salva o token no navegador para usarmos depois
        localStorage.setItem("token", dados.token);
        
        // 3. O REDIRECIONAMENTO ACONTECE AQUI!
        router.push("/painel");
        
      } else {
        setMensagem(dados.error || "E-mail ou senha incorretos.");
        setErro(true);
      }
    } catch (error) {
      setMensagem("Erro ao se conectar com o servidor.");
      setErro(true);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">A Criação Gráfica</h2>
          <p className="mt-2 text-sm text-gray-500">Acesse o painel do sistema</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
              placeholder="joao2@acriacaografica.com.br"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
              placeholder="Sua senha"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Entrar
          </button>
        </form>

        {/* Mensagem de sucesso ou erro que aparece embaixo do botão */}
        {mensagem && (
          <p className={`text-center font-medium mt-4 ${erro ? "text-red-500" : "text-green-600"}`}>
            {mensagem}
          </p>
        )}
      </div>
    </div>
  );
}