#  🐾 Império dos Pets 🐾

![Logo da Império dos Pets](https://site-imperio-dos-pets.vercel.app/_next/image?url=%2Flogo.png&w=256&q=75)

O site oficial da clínica veterinária e pet shop Império dos Pets, desenvolvido para ser uma plataforma de apresentação dos serviços, contato e catálogo de produtos da empresa.

---

### ✨ **[Acesse a demonstração ao vivo](https://site-imperio-dos-pets.vercel.app/)** ✨

---

## 📸 Screenshots



| Home Page | Seção de Serviços | Catálogo (Modal) |
| :---: | :---: | :---: |
| ![Screenshot da Home Page](https://github.com/user-attachments/assets/ebcf8d42-2e06-438e-80f9-b26c72a13ae7) | ![Screenshot da Seção de Serviços](https://github.com/user-attachments/assets/d8c89ff6-56ae-422b-bc29-c43699123fae) | ![Screenshot do Catálogo](https://github.com/user-attachments/assets/ee6bd64e-acd2-4631-881d-c4449e61f6ec) |


---

## 📜 Descrição do Projeto

Este é o repositório do site institucional para a **Império dos Pets**. O projeto consiste em uma landing page moderna e totalmente responsiva, construída para fornecer aos clientes informações claras sobre os serviços oferecidos, galeria de fotos, e múltiplas formas de contato, incluindo um formulário funcional e links diretos para o WhatsApp.

A plataforma também inclui funcionalidades interativas como um catálogo de produtos para o Pet Shop e a Farmácia, com busca e filtros, além de um modal de promoções para engajamento do cliente.

---

## ✅ Funcionalidades Principais

* **Responsividade Completa:** Layout adaptado para Desktop, Tablets e Celulares.
* **Modal de Promoção:** Um pop-up que aparece para o usuário após alguns segundos para destacar promoções especiais.
* **Catálogo de Produtos:** Modais interativos para os serviços de "Pet Shop" e "Farmácia Pet" que abrem um catálogo com:
    * Busca por nome de produto.
    * Filtro por categorias e por itens em promoção.
    * Link direto para o WhatsApp ao clicar em um produto disponível.
* **Formulário de Contato Funcional:** Envia as mensagens dos clientes diretamente para o e-mail da clínica usando Nodemailer.
* **Animações e Micro-interações:** Uso de Framer Motion para uma experiência de usuário mais fluida e agradável.
* **Links Diretos:** Botões flutuantes e links no rodapé para contato rápido via WhatsApp e redes sociais.

---

## 🛠️ Tecnologias Utilizadas

* **Framework:** [Next.js](https://nextjs.org/)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
* **Animações:** [Framer Motion](https://www.framer.com/motion/)
* **Ícones:** [Lucide React](https://lucide.dev/) e [React Icons](https://react-icons.github.io/react-icons/)
* **Envio de E-mail:** [Nodemailer](https://nodemailer.com/)
* **Hospedagem:** [Vercel](https://vercel.com/)

---

## 🚀 Rodando o Projeto Localmente

Siga os passos abaixo para executar o projeto em seu ambiente de desenvolvimento.

**Pré-requisitos:**
* [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
* [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

**Passos:**

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/BernardoPiresMascarenhas/Site-Imperio-Dos-Pets-.git
    ```

2.  **Acesse a pasta do projeto:**
    ```bash
    cd Site-Imperio-Dos-Pets-
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

4.  **Configure as variáveis de ambiente:**
    * Crie uma cópia do arquivo `.env.example` (se você o tiver) ou crie um novo arquivo chamado `.env.local` na raiz do projeto.
    * Adicione as variáveis necessárias (veja a seção abaixo).

5.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    # ou
    yarn dev
    ```

6.  Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

---

## 🔑 Variáveis de Ambiente

Para que o formulário de contato funcione, você precisa configurar as seguintes variáveis de ambiente no seu arquivo `.env.local`:

```
# Credenciais para o envio de e-mail pelo formulário de contato
# Use o e-mail e a senha de app que configuramos
EMAIL_USER="seu-email-de-envio@gmail.com"
EMAIL_PASS="sua-senha-de-app-de-16-digitos"
```

**Importante:** O arquivo `.env.local` já está no `.gitignore` e não deve ser enviado para o GitHub por segurança.

---

## 👨‍💻 Autores

O histórico de desenvolvimento deste projeto está distribuído em dois repositórios. A fase de concepção e o trabalho inicial podem ser vistos no [**repositório original**](https://github.com/sevak19/imperio-dos-pets), enquanto este repositório contém a versão final e as funcionalidades mais recentes.

Este projeto foi concebido e desenvolvido por:

* **Bernardo Pires Mascarenhas**
    * GitHub: [@BernardoPiresMascarenhas](https://github.com/BernardoPiresMascarenhas)
    * LinkedIn: [Bernardo Pires](https://www.linkedin.com/in/bernardo-pires-mascarenhas-3585972bb/)

* **Arthur Costa Serra Negra**
    * GitHub: [@sevak19](https://github.com/sevak19)
    * LinkedIn: [Arthur Costa](https://www.linkedin.com/in/arthur-costa-serra-negra-ab1487320/)

---

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.
