"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PainelPage() {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);
  
  // 1. Criamos um "cofre" (estado) para guardar o nome do usuário que vem do banco
  const [nomeUsuario, setNomeUsuario] = useState("");

  useEffect(() => {
    const buscarPerfil = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // 2. Batemos na porta do backend mostrando o crachá (token)
        const resposta = await fetch("http://localhost:3333/perfil", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (resposta.ok) {
          const dados = await resposta.json();
          // 3. Sucesso! Guardamos o nome que o backend devolveu
          setNomeUsuario(dados.nome); 
          setAutorizado(true); // Libera a tela
        } else {
          // Se o token for inválido ou expirado, joga a chave fora e expulsa
          localStorage.removeItem("token");
          router.push("/login");
        }
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
      }
    };

    buscarPerfil();
  }, [router]);

  const fazerLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!autorizado) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-xl font-bold text-gray-500">A verificar segurança...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="bg-white p-10 rounded-xl shadow-md text-center max-w-lg w-full border border-gray-200">
        <h1 className="text-3xl font-bold mb-2 text-blue-600">Painel Administrativo</h1>
        
        {/* 4. A mágica visual acontece aqui! */}
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          Bem-vindo, <span className="text-blue-500">{nomeUsuario}</span>!
        </h2>
        
        <p className="mb-8 text-gray-600">
          Você está na área restrita da A Criação Gráfica.
        </p>
        
        <button 
          onClick={fazerLogout}
          className="px-6 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition w-full"
        >
          Sair do Sistema
        </button>
      </div>
    </div>
  );
}