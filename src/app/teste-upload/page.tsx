"use client";

import { useState } from "react";

export default function TesteUploadPage() {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [urlSalva, setUrlSalva] = useState<string>("");
  const [carregando, setCarregando] = useState(false);

  const fazerUpload = async () => {
    if (!arquivo) {
      alert("Escolha um arquivo primeiro!");
      return;
    }

    setCarregando(true);

    // O FormData é o "envelope" especial do navegador para enviar arquivos físicos
    const envelope = new FormData();
    envelope.append("file", arquivo);

    try {
      const resposta = await fetch("http://localhost:3333/upload", {
        method: "POST",
        body: envelope, // Enviamos o envelope com o arquivo dentro!
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        setUrlSalva(dados.url); // Pega a URL que o backend devolveu
      } else {
        alert("Erro no backend: " + dados.error);
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center border border-gray-200">
        <h1 className="text-2xl font-black text-gray-800 mb-6">Laboratório de Upload 🧪</h1>
        
        <input 
          type="file" 
          onChange={(e) => setArquivo(e.target.files ? e.target.files[0] : null)}
          className="mb-6 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100 cursor-pointer"
        />

        <button 
          onClick={fazerUpload}
          disabled={carregando}
          className="w-full bg-[#262A2B] text-white py-3 rounded-xl font-bold hover:bg-yellow-400 hover:text-black transition disabled:opacity-50"
        >
          {carregando ? "Enviando pro servidor..." : "Testar Upload"}
        </button>

        {urlSalva && (
          <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-200">
            <p className="text-green-700 font-bold mb-2">Sucesso! Arquivo salvo em:</p>
            <a href={urlSalva} target="_blank" className="text-xs text-blue-500 break-all underline">
              {urlSalva}
            </a>
            
            {/* Se for uma imagem, já mostramos ela na tela para provar que deu certo! */}
            <div className="mt-4 w-full h-40 relative rounded-lg overflow-hidden border border-gray-200">
              <img src={urlSalva} alt="Upload Teste" className="object-contain w-full h-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}