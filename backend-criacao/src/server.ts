import dotenv from 'dotenv';
dotenv.config(); // Isso força o Node a ler o .env AGORA, antes de qualquer outra coisa

// Só DEPOIS disso você importa as outras coisas, como o Prisma e o Express
import { PrismaClient } from '@prisma/client';
import express from 'express';

import path from 'path';
import multer from 'multer';
import uploadConfig from './config/multer';
import cors from 'cors';
import { verificarToken } from './middlewares/auth';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

const app = express();
// Configura a pasta onde os arquivos vão ser salvos
const upload = multer(uploadConfig.upload('./uploads'));

// Isso faz o Express funcionar como um "servidor de arquivos estáticos"
// Qualquer um que acessar http://localhost:3333/files/nome-da-foto.jpg vai ver a imagem!
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(cors());
const prisma = new PrismaClient(); // Iniciando a conexão com o banco
const port = 3333; 

app.use(express.json());

// Nossa rota de teste que já estava aqui
app.get('/perfil', verificarToken, async (request, response) => {
  // 1. Pegamos o token que o middleware já validou
  const authHeader = request.headers.authorization;
  const token = authHeader!.split(' ')[1];

  // 2. Lemos o ID que guardamos dentro do token lá na hora do login
  const payload = jwt.decode(token) as { id: string };

  // 3. Buscamos o dono desse ID no banco de dados com o Prisma
  const usuario = await prisma.usuario.findUnique({
    where: { id: payload.id }
  });

  // 4. Devolvemos o nome e o email para o frontend (nunca a senha!)
  return response.json({
    nome: usuario?.nome,
    email: usuario?.email
  });
});

// ROTA PROTEGIDA
app.get('/perfil', verificarToken, async (request, response) => {
  return response.json({ 
    message: 'Bem-vindo à área secreta da A Criação Gráfica!',
    dica: 'Apenas usuários autenticados conseguem ler isso.' 
  });
});

app.post('/usuarios', async (request, response) => {
  const { nome, descricao, precoBase, imagemUrl, imagensExtras, variacoes, tipoPrecificacao, pacotes } = request.body;

  try {
    // 1. Geramos um "salt" (um tempero aleatório) e depois o hash da senha
    const hashSenha = await bcrypt.hash(senha, 10); 

    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: hashSenha, // Agora salvamos o hash, não a senha real!
      }
    });

    // 2. Por segurança, não devolvemos a senha nem no JSON de resposta
    const { senha: _, ...usuarioSemSenha } = novoUsuario;

    return response.status(201).json(usuarioSemSenha);
    
  } catch (error) {
    return response.status(400).json({ error: 'Erro ao criar usuário.' });
  }
});

// ROTA DE LOGIN
app.post('/login', async (request, response) => {
  const { email, senha } = request.body;

  try {
    // 1. Buscamos o usuário no banco
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario) {
      return response.status(401).json({ error: 'Usuário ou senha inválidos' });
    }

    // 2. Comparamos a senha digitada com o hash guardado
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return response.status(401).json({ error: 'Usuário ou senha inválidos' });
    }

    // 3. Geramos o Token (a "chave de acesso") com a CHAVE UNIFICADA!
    const chaveSecreta = process.env.JWT_SECRET || 'minha_chave_super_secreta_123';
    const token = jwt.sign({ id: usuario.id }, chaveSecreta, { expiresIn: '1d' });

    return response.json({ token });
  } catch (error) {
    console.error("ERRO NO LOGIN ADMIN:", error);
    return response.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// ROTA PARA CRIAR UM CLIENTE (Protegida)
app.post('/clientes', async (request, response) => {
  const { 
      nome, telefone, email, senha,
      cep, logradouro, numero, complemento, bairro, cidade, estado 
    } = request.body;

  try {
    // 1. Criptografar a senha caso ela tenha sido enviada
    const bcrypt = require('bcrypt'); // ou 'bcryptjs' dependendo do seu projeto
    const senhaCriptografada = senha ? await bcrypt.hash(senha, 10) : null;

    // 2. Criar o cliente com todos os campos novos
    const novoCliente = await prisma.cliente.create({
      data: {
        nome,
        telefone,
        email, 
        senha: senhaCriptografada, // Salva a senha embaralhada!
        
        // === NOVOS CAMPOS DE ENDEREÇO ===
        cep,
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        estado
      }
    });

    return response.status(201).json(novoCliente);
  } catch (error) {
    console.error("ERRO AO CRIAR CLIENTE:", error);
    return response.status(400).json({ error: 'Erro ao criar o cliente.' });
  }
});

// =========================================================
// ROTA: BUSCAR DADOS DO PERFIL (MINHA CONTA)
// =========================================================
app.get('/clientes/:id', verificarToken, async (request, response) => {
  try {
    const { id } = request.params;
    
    const cliente = await prisma.cliente.findUnique({
      where: { id },
      // Ocultamos a senha e o código de recuperação por segurança!
      select: { 
        id: true, nome: true, email: true, telefone: true, 
        cep: true, logradouro: true, numero: true, complemento: true, 
        bairro: true, cidade: true, estado: true 
      }
    });

    if (!cliente) return response.status(404).json({ error: 'Cliente não encontrado' });
    
    return response.json(cliente);
  } catch (error) {
    console.error("ERRO AO BUSCAR PERFIL:", error);
    return response.status(500).json({ error: 'Erro interno ao buscar dados.' });
  }
});

// ROTA PARA LISTAR TODOS OS CLIENTES (Protegida)
app.get('/clientes', verificarToken, async (request, response) => {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: {
        criadoEm: 'desc' // Mostra sempre os clientes mais recentes no topo da lista
      }
    });

    return response.json(clientes);
  } catch (error) {
    return response.status(500).json({ error: 'Erro ao procurar os clientes.' });
  }
});

// =========================================================
// ROTA: ATUALIZAR PERFIL DO CLIENTE (MINHA CONTA)
// =========================================================
app.put('/clientes/:id', async (request, response) => {
  try {
    const { id } = request.params;
    
    // Pegamos tudo que pode ser atualizado na tela de Minha Conta
    const { 
      nome, telefone, 
      cep, logradouro, numero, complemento, bairro, cidade, estado 
    } = request.body;

    // Atualiza direto no banco de dados
    const clienteAtualizado = await prisma.cliente.update({
      where: { id },
      data: {
        nome,
        telefone,
        cep,
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        estado
      }
    });

    console.log(`[BACKEND] Perfil atualizado com sucesso: ${clienteAtualizado.nome}`);
    return response.json({ message: 'Perfil atualizado com sucesso!', cliente: clienteAtualizado });

  } catch (error) {
    console.error("ERRO AO ATUALIZAR PERFIL:", error);
    return response.status(500).json({ error: 'Erro interno ao atualizar os dados.' });
  }
});

// ROTA PARA CRIAR UM PEDIDO/ORÇAMENTO (Protegida)
app.post('/pedidos', verificarToken, async (request, response) => {
  const { descricao, valor, status, clienteId } = request.body;

  try {
    const novoPedido = await prisma.pedido.create({
      data: {
        descricao,
        valor,
        status: status || "ORÇAMENTO", // Se não mandar status, vira orçamento por padrão
        clienteId
      }
    });

    return response.status(201).json(novoPedido);
  } catch (error) {
    return response.status(400).json({ error: 'Erro ao criar o pedido. Verifique se o ID do cliente está correto.' });
  }
});

// ROTA PARA LISTAR TODOS OS PEDIDOS (Protegida)
app.get('/pedidos', verificarToken, async (request, response) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      orderBy: { criadoEm: 'desc' },
      // A MÁGICA DO PRISMA AQUI: Ele já traz os dados do cliente dono do pedido junto!
      include: {
        cliente: true 
      }
    });

    return response.json(pedidos);
  } catch (error) {
    return response.status(500).json({ error: 'Erro ao buscar os pedidos.' });
  }
});

// ROTA PARA ATUALIZAR O STATUS DO PEDIDO (Protegida)
app.patch('/pedidos/:id/status', verificarToken, async (request, response) => {
  const { id } = request.params; // Pega o ID que vem na URL
  const { status } = request.body; // Pega o novo status que vem no corpo

  try {
    const pedidoAtualizado = await prisma.pedido.update({
      where: { id },
      data: { status }
    });

    return response.json(pedidoAtualizado);
  } catch (error) {
    return response.status(400).json({ error: 'Erro ao atualizar o status do pedido.' });
  }
});

// ROTA PARA DELETAR UM PEDIDO (Protegida)
app.delete('/pedidos/:id', verificarToken, async (request, response) => {
  const { id } = request.params;

  try {
    // O Prisma vai no banco e apaga a linha exata que tem esse ID
    await prisma.pedido.delete({
      where: { id }
    });

    // O status 204 significa "Sucesso, mas não tenho nenhum texto para te devolver"
    return response.status(204).send(); 
  } catch (error) {
    return response.status(400).json({ error: 'Erro ao deletar o pedido.' });
  }
});

// ROTA PARA DELETAR UM CLIENTE (Protegida)
app.delete('/clientes/:id', verificarToken, async (request, response) => {
  const { id } = request.params;

  try {
    // O Prisma tenta apagar o cliente no banco
    await prisma.cliente.delete({
      where: { id }
    });

    return response.status(204).send(); 
  } catch (error) {
    // Se der erro (ex: o cliente tem pedidos), a gente avisa o frontend!
    return response.status(400).json({ 
      error: 'Não é possível deletar este cliente porque ele possui orçamentos/pedidos vinculados.' 
    });
  }
});

// ROTA PARA BUSCAR MÉTRICAS DO PAINEL (Protegida)
app.get('/metricas', verificarToken, async (request, response) => {
  try {
    // 1. Conta quantos clientes existem
    const totalClientes = await prisma.cliente.count();
    
    // 2. Conta quantos pedidos estão na fila de produção
    const emProducao = await prisma.pedido.count({
      where: { status: 'PRODUÇÃO' }
    });

    // 3. Conta quantos orçamentos aguardam aprovação
    const orcamentos = await prisma.pedido.count({
      where: { status: 'ORÇAMENTO' }
    });

    // 4. Soma o valor de todos os pedidos que já estão "PRONTO" (Faturamento real)
    const faturamento = await prisma.pedido.aggregate({
      _sum: { valor: true },
      where: { status: 'PRONTO' }
    });

    return response.json({
      totalClientes,
      emProducao,
      orcamentos,
      faturamentoTotal: faturamento._sum.valor || 0 // Se for null, retorna 0
    });
  } catch (error) {
    return response.status(500).json({ error: 'Erro ao buscar métricas.' });
  }
});

app.post('/produtos', async (request, response) => {
  try {
    const { nome, descricao, precoBase, imagemUrl, imagensExtras, variacoes, tipoPrecificacao, pacotes } = request.body;

    const produto = await prisma.produto.create({
      data: {
        nome,
        descricao,
        precoBase: Number(precoBase) || 0,
        tipoPrecificacao: tipoPrecificacao || "UNIDADE",
        pacotes: pacotes || [], // Salva os milheiros como JSON
        imagemUrl,
        variacoes: variacoes || [], 
        imagens: {
          create: imagensExtras && imagensExtras.length > 0 
            ? imagensExtras.map((url: string) => ({ url })) 
            : []
        }
      }
    });

    console.log("[BACKEND] Produto CRIADO com sucesso!");
    return response.status(201).json(produto);
  } catch (error) {
    console.error("ERRO AO CRIAR PRODUTO:", error);
    return response.status(500).json({ error: 'Erro interno ao criar produto.' });
  }
});

// ROTA PARA ATUALIZAR UM PRODUTO COMPLETO (EDIÇÃO HÍBRIDA)
app.put('/produtos/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const { nome, descricao, precoBase, imagemUrl, imagensExtras, variacoes, tipoPrecificacao, pacotes } = request.body;

    const produtoExiste = await prisma.produto.findUnique({ where: { id } });
    if (!produtoExiste) return response.status(404).json({ error: 'Produto não encontrado.' });

    // Apaga as FOTOS EXTRAS antigas
    await prisma.imagemProduto.deleteMany({
      where: { produtoId: id }
    });

    const produtoAtualizado = await prisma.produto.update({
      where: { id },
      data: {
        nome,
        descricao,
        precoBase: Number(precoBase) || 0,
        tipoPrecificacao: tipoPrecificacao || "UNIDADE",
        pacotes: pacotes || [],
        imagemUrl,
        variacoes: variacoes || [],
        imagens: {
          create: imagensExtras && imagensExtras.length > 0 
            ? imagensExtras.map((url: string) => ({ url })) 
            : []
        }
      }
    });

    console.log("[BACKEND] Produto ATUALIZADO com sucesso!");
    return response.json(produtoAtualizado);
  } catch (error) {
    console.error("ERRO AO ATUALIZAR PRODUTO:", error);
    return response.status(500).json({ error: 'Erro interno ao atualizar.' });
  }
});

// ROTA PÚBLICA PARA LISTAR PRODUTOS NA VITRINE
app.get('/produtos', async (request, response) => {
  try {
    const produtos = await prisma.produto.findMany({
      // MÁGICA: Puxa a galeria de imagens extras junto com o produto!
      include: { imagens: true } 
    });
    return response.json(produtos);
  } catch (error) {
    return response.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// ROTA PÚBLICA PARA CADASTRO DE CLIENTES NO E-COMMERCE
app.post('/cadastro', async (request, response) => {
  const { nome, telefone, email, senha } = request.body;

  try {
    // 1. Verifica se o e-mail já está em uso para evitar duplicatas
    if (email) {
      const clienteExistente = await prisma.cliente.findFirst({ where: { email } });
      if (clienteExistente) {
        return response.status(400).json({ error: 'Este e-mail já está cadastrado.' });
      }
    }

    // 2. Criptografa a senha do cliente antes de salvar no banco
    const { hash } = require('bcryptjs');
    const senhaHash = await hash(senha, 10);

    // 3. Salva o cliente no banco de dados
    await prisma.cliente.create({
      data: {
        nome,
        telefone,
        email,
        senha: senhaHash
      }
    });

    return response.status(201).json({ mensagem: 'Conta criada com sucesso!' });
  } catch (error) {
    // Isso vai imprimir o erro real com letras vermelhas no seu terminal!
    console.error("ERRO DETALHADO NO CADASTRO:", error); 
    return response.status(400).json({ error: 'Erro ao criar conta.' });
  }
});

app.post('/login-cliente', async (request, response) => {
  const { email, senha } = request.body;

  try {
    // 1. Procura o cliente pelo e-mail
    const cliente = await prisma.cliente.findFirst({ where: { email } });
    
    // Se não achar o cliente ou se ele for um cliente antigo sem senha
    if (!cliente || !cliente.senha) {
      return response.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    // 2. Compara a senha digitada com a criptografada no banco
    const { compare } = require('bcryptjs');
    const senhaValida = await compare(senha, cliente.senha);

    if (!senhaValida) {
      return response.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    // 3. Gera o Token VIP do cliente
    const { sign } = require('jsonwebtoken');
    
    // A MÁGICA DA CHAVE IGUALADA:
    const chaveSecreta = process.env.JWT_SECRET || 'minha_chave_super_secreta_123';
    
    const token = sign(
      { 
        id: cliente.id, 
        nome: cliente.nome,
        isAdmin: cliente.isAdmin // <-- Superpoder restaurado!
      }, 
      chaveSecreta, // <-- Agora usa a mesma chave do Leão de Chácara!
      { expiresIn: '7d' } // Cliente fica logado por 7 dias
    );

    // 4. Devolve o token e os dados para o Frontend
    return response.json({ 
      token, 
      cliente: { 
        id: cliente.id, 
        nome: cliente.nome,
        isAdmin: cliente.isAdmin // <-- Frontend precisa disso para o roteamento do Painel
      } 
    });

  } catch (error) {
    console.error("ERRO NO LOGIN:", error);
    return response.status(500).json({ error: 'Erro interno ao fazer login.' });
  }
});

// =========================================================
// ROTA PARA O CLIENTE SOLICITAR ORÇAMENTO PELO SITE
// =========================================================
app.post('/vitrine/pedidos', verificarToken, async (request, response) => {
  try {
    // 1. Pegamos todos os dados preciosos que o Modal do Frontend enviou
    const { descricao, valor, arquivoArte, detalhes } = request.body;

    // 2. Abrimos o Token com a CHAVE CERTA para descobrir de quem é o pedido
    const authHeader = request.headers.authorization;
    const token = authHeader.split(' ')[1];
    const jwt = require('jsonwebtoken');
    const chaveSecreta = process.env.JWT_SECRET || 'minha_chave_super_secreta_123';
    
    const decoded = jwt.verify(token, chaveSecreta);
    const clienteId = decoded.id; // Agora pegamos o ID do lugar certinho!

    // 3. Salvamos o pedido completo no banco de dados
    const novoPedido = await prisma.pedido.create({
      data: {
        descricao: descricao,
        valor: valor,
        clienteId: clienteId,
        status: 'ORÇAMENTO', // Já entra como orçamento pendente
        arquivoArte: arquivoArte, // Salva o link do PDF/Arte
        detalhes: detalhes       // Salva as opções extras escolhidas
      }
    });

    console.log(`[SUCESSO] Pedido VIP recebido: ${descricao} | R$ ${valor}`);
    return response.status(201).json(novoPedido);

  } catch (error) {
    console.error("ERRO AO RECEBER PEDIDO DA VITRINE:", error);
    return response.status(500).json({ error: 'Erro ao processar o pedido no servidor.' });
  }
});

// =========================================================
// ROTA: LISTAR PEDIDOS DO CLIENTE LOGADO (MEUS PEDIDOS)
// =========================================================
app.get('/meus-pedidos', verificarToken, async (request, response) => {
  try {
    // 1. Extraímos o ID do cliente direto do token
    const authHeader = request.headers.authorization;
    const token = authHeader.split(' ')[1]; // Pega a parte depois do "Bearer "
    
    const jwt = require('jsonwebtoken');
    const chaveSecreta = process.env.JWT_SECRET || 'minha_chave_super_secreta_123';
    const decoded = jwt.verify(token, chaveSecreta);
    
    const clienteId = decoded.id; // O ID do cliente que está fazendo o pedido

    // 2. Buscamos no banco apenas os pedidos DESTE cliente
    const pedidos = await prisma.pedido.findMany({
      where: { clienteId: clienteId },
      orderBy: { criadoEm: 'desc' } // Mais novos primeiro
    });

    return response.json(pedidos);
  } catch (error) {
    console.error("ERRO AO BUSCAR MEUS PEDIDOS:", error);
    return response.status(500).json({ error: 'Erro ao buscar pedidos.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

// ROTA PARA RECEBER FOTOS E PDFs
app.post('/upload', upload.single('file'), (request, response) => {
  if (!request.file) {
    return response.status(400).json({ error: 'Nenhum arquivo enviado.' });
  }

  // Monta a URL completa para o frontend conseguir acessar o arquivo depois
  const fileUrl = `http://localhost:3333/files/${request.file.filename}`;

  return response.json({ url: fileUrl });
});

app.patch('/pedidos/:id/status', async (request, response) => {
  const { id } = request.params;
  const { status } = request.body;
  
  const pedidoAtualizado = await prisma.pedido.update({
    where: { id },
    data: { status }
  });
  
  return response.json(pedidoAtualizado);
});

// ROTA PARA O ADMIN DELETAR UM PRODUTO
app.delete('/produtos/:id', async (request, response) => {
  const { id } = request.params;

  try {
    // O Prisma deleta o produto e as imagens relacionadas (graças ao Cascade)
    await prisma.produto.delete({
      where: { id }
    });

    return response.status(204).send(); // 204 significa "Deu certo e não tem nada para retornar"
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    return response.status(400).json({ error: 'Erro ao deletar o produto.' });
  }
});

// ROTA PARA ALIMENTAR OS GRÁFICOS DO DASHBOARD
app.get('/dashboard/graficos', async (request, response) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      orderBy: { criadoEm: 'asc' } // Garante a ordem cronológica
    });

    // 1. LÓGICA DO GRÁFICO DE STATUS (Rosca)
    const orcamentos = pedidos.filter(p => p.status === 'ORÇAMENTO').length;
    const producao = pedidos.filter(p => p.status === 'PRODUÇÃO').length;
    const prontos = pedidos.filter(p => p.status === 'PRONTO').length;

    const dadosStatus = [
      { nome: 'Orçamento', quantidade: orcamentos },
      { nome: 'Em Produção', quantidade: producao },
      { nome: 'Prontos', quantidade: prontos }
    ];

    // 2. LÓGICA DE PRODUTOS MAIS VENDIDOS (Barras)
    // Agrupa as descrições para contar qual sai mais
    const contagemProdutos: Record<string, number> = {};
    pedidos.forEach(p => {
      // Limpa o prefixo "Pedido pelo Site: " se houver, para o gráfico ficar limpo
      const nomeProduto = p.descricao.replace('Pedido pelo Site: ', '').trim();
      contagemProdutos[nomeProduto] = (contagemProdutos[nomeProduto] || 0) + 1;
    });
    
    // Transforma em array, ordena do maior para o menor e pega os 4 top
    const dadosProdutos = Object.entries(contagemProdutos)
      .map(([nome, vendas]) => ({ nome, vendas }))
      .sort((a, b) => b.vendas - a.vendas)
      .slice(0, 4);

    // 3. LÓGICA DE FATURAMENTO DOS ÚLTIMOS 7 DIAS (Linha)
    const dadosFaturamento = [];
    for (let i = 6; i >= 0; i--) {
      const data = new Date();
      data.setDate(data.getDate() - i);
      
      // Formata para "Seg", "Ter", etc.
      const diaSemana = data.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
      const dataComparacao = data.toDateString();

      // Soma o valor apenas dos pedidos que estão PRONTOS neste dia específico
      const faturamentoDoDia = pedidos
        .filter(p => p.status === 'PRONTO' && new Date(p.criadoEm).toDateString() === dataComparacao)
        .reduce((acc, p) => acc + p.valor, 0);

      dadosFaturamento.push({ 
        dia: diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1), // Deixa a primeira letra maiúscula
        valor: faturamentoDoDia 
      });
    }

    return response.json({ dadosStatus, dadosProdutos, dadosFaturamento });
  } catch (error) {
    console.error("Erro ao gerar gráficos:", error);
    return response.status(500).json({ error: 'Erro ao gerar dados dos gráficos.' });
  }
});

// =========================================================
// ROTA 1: SOLICITAR RECUPERAÇÃO (GERA CÓDIGO E ENVIA EMAIL)
// =========================================================
app.post('/clientes/esqueci-senha', async (request, response) => {
  try {
    const { email } = request.body;

    // 1. Verifica se o cliente existe
    const cliente = await prisma.cliente.findUnique({ where: { email } });
    if (!cliente) {
      return response.status(404).json({ error: 'Nenhuma conta encontrada com este e-mail.' });
    }

    // 2. Gera um código de 6 dígitos aleatório
    const codigoSecreto = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Salva o código no banco de dados do cliente
    await prisma.cliente.update({
      where: { email },
      data: { codigoRecuperacao: codigoSecreto }
    });

    console.log("DADOS QUE O NODE ESTÁ LENDO:");
    console.log("Email:", process.env.EMAIL_USER);
    console.log("Senha:", process.env.EMAIL_PASS);

    // 4. Configura o Carteiro (Nodemailer) com os dados do seu .env
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true para a porta 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 5. Envia o e-mail para o cliente
    await transporter.sendMail({
      from: `"A Criação Gráfica" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Seu Código de Recuperação de Senha 🔐",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>Olá, ${cliente.nome}!</h2>
          <p>Você solicitou a recuperação de senha no site da <b>A Criação Gráfica</b>.</p>
          <p>Seu código de segurança é:</p>
          <h1 style="background: #f4f4f4; padding: 15px; letter-spacing: 5px; text-align: center; border-radius: 8px;">${codigoSecreto}</h1>
          <p>Se você não solicitou isso, basta ignorar este e-mail.</p>
        </div>
      `,
    });

    console.log(`[BACKEND] Código ${codigoSecreto} enviado para ${email}`);
    return response.json({ message: 'E-mail enviado com sucesso!' });

  } catch (error) {
    console.error("ERRO AO ENVIAR EMAIL DE RECUPERAÇÃO:", error);
    return response.status(500).json({ error: 'Erro interno ao processar solicitação.' });
  }
});


// =========================================================
// ROTA 2: TROCAR A SENHA (VALIDA O CÓDIGO E SALVA NOVA SENHA)
// =========================================================
app.post('/clientes/resetar-senha', async (request, response) => {
  try {
    const { email, codigo, novaSenha } = request.body;

    // 1. Busca o cliente para ver se o código bate
    const cliente = await prisma.cliente.findUnique({ where: { email } });

    if (!cliente || cliente.codigoRecuperacao !== codigo) {
      return response.status(400).json({ error: 'Código inválido ou expirado!' });
    }

    // 2. CRIPTOGRAFA A NOVA SENHA ANTES DE SALVAR! 🔐
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(novaSenha, salt);

    // 3. Atualiza a senha (agora criptografada) e APAGA o código por segurança
    await prisma.cliente.update({
      where: { email },
      data: { 
        senha: senhaCriptografada, 
        codigoRecuperacao: null
      }
    });

    console.log(`[BACKEND] Senha alterada e criptografada com sucesso para ${email}`);
    return response.json({ message: 'Senha alterada com sucesso!' });

  } catch (error) {
    console.error("ERRO AO RESETAR SENHA:", error);
    return response.status(500).json({ error: 'Erro interno ao resetar senha.' });
  }
});