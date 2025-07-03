
"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";

export default function FormularioContato() {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    const form = e.target as HTMLFormElement;

  const name = (form.elements.namedItem("name") as HTMLInputElement)?.value.trim();
  const email = (form.elements.namedItem("email") as HTMLInputElement)?.value.trim();
  const numero = (form.elements.namedItem("numero") as HTMLInputElement)?.value.trim();
  const message = (form.elements.namedItem("message") as HTMLTextAreaElement)?.value.trim();

    if (!name || !email || !numero || !message) {
      setErrorMessage("Por favor, preencha todos os campos.");
      return;
    }

    setIsLoading(true);

    const formDataConverted = {
      nome: name,
      email,
      numero,
      mensagem: message,
    };

    try {
      const response = await fetch("/api/agendar", {
        method: "POST",
        body: JSON.stringify(formDataConverted),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      console.log("Result: ", result);

      if (result) {
        setSuccessMessage("Mensagem enviada com sucesso!");
        form.reset();
      } else {
        setErrorMessage("Erro ao enviar. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro:", error);
      setErrorMessage("Erro ao enviar. Verifique sua conexão.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}
      {successMessage && <p className="text-green-600">{successMessage}</p>}

      <input
        type="text"
        name="name"
        placeholder="Nome"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-400 focus:border-yellow-400 text-black"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-400 focus:border-yellow-400 text-black"
      />
      <input
        type="text"
        name="numero"
        placeholder="Telefone de contato"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-400 focus:border-yellow-400 text-black"
      />
      <textarea
        name="message"
        placeholder="Mensagem"
        rows={4}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-400 focus:border-yellow-400 text-black"
      />
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full ${
          isLoading ? "bg-yellow-200 cursor-not-allowed" : "bg-yellow-300"
        } text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-200 transition-colors`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Enviando...
          </span>
        ) : (
          "Enviar Mensagem"
        )}
      </button>
    </form>
  );
}
