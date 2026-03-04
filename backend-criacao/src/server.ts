import path from 'path';
import multer from 'multer';
import uploadConfig from './config/multer';
import cors from 'cors';
import { verificarToken } from './middlewares/auth';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import express from 'express';
import { PrismaClient } from '@prisma/client';// Importando o Prisma

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
  const { nome, email, senha } = request.body;

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

  // 3. Geramos o Token (a "chave de acesso")
  // O "segredo-do-token" deve ser uma string forte em um projeto real!
  const token = jwt.sign({ id: usuario.id }, 'segredo-do-token', { expiresIn: '1d' });

  return response.json({ token });
});

// ROTA PARA CRIAR UM CLIENTE (Protegida)
app.post('/clientes', verificarToken, async (request, response) => {
  const { nome, telefone, email } = request.body;

  try {
    const novoCliente = await prisma.cliente.create({
      data: {
        nome,
        telefone,
        email // Como definimos no schema que é opcional, pode não ser enviado
      }
    });

    return response.status(201).json(novoCliente);
  } catch (error) {
    return response.status(400).json({ error: 'Erro ao criar o cliente.' });
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

// ROTA PARA O ADMIN CRIAR PRODUTOS COM VARIAÇÕES E GALERIA
app.post('/produtos', async (request, response) => {
  // Pegamos todos os dados novos que o frontend vai mandar
  const { nome, descricao, precoBase, imagemUrl, imagensExtras, variacoes } = request.body;

  try {
    const novoProduto = await prisma.produto.create({
      data: {
        nome,
        descricao,
        precoBase,
        imagemUrl, // A foto principal de capa
        variacoes, // O "superpoder" do Prisma salva o JSON direto!
        
        // Mágica do Prisma: Já cria as imagens extras na tabela vinculada!
        imagens: {
          create: imagensExtras && imagensExtras.length > 0 
            ? imagensExtras.map((url: string) => ({ url })) 
            : []
        }
      }
    });

    return response.status(201).json(novoProduto);
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    return response.status(400).json({ error: 'Erro ao criar o produto no banco de dados.' });
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
    // ATENÇÃO: Use a mesma palavra secreta que você usou na rota de login do Admin!
    const token = sign({ nome: cliente.nome }, 'sua_senha_super_secreta_aqui', {
      subject: cliente.id,
      expiresIn: '7d' // Cliente fica logado por 7 dias
    });

    return response.json({ 
      token, 
      cliente: { id: cliente.id, nome: cliente.nome } 
    });

  } catch (error) {
    console.error("ERRO NO LOGIN:", error);
    return response.status(500).json({ error: 'Erro interno ao fazer login.' });
  }
});

// ROTA PARA O CLIENTE SOLICITAR ORÇAMENTO PELO SITE
app.post('/vitrine/pedidos', async (request, response) => {
  const authHeader = request.headers.authorization;
  if (!authHeader) return response.status(401).json({ error: 'Sessão não iniciada.' });

  const [, token] = authHeader.split(' ');

  try {
    const { verify } = require('jsonwebtoken');
    const decoded = verify(token, 'sua_senha_super_secreta_aqui');
    const clienteId = decoded.sub;

    // AQUI ESTAVA O ERRO! Agora estamos pegando o arquivo e os detalhes:
    const { descricao, valor, arquivoArte, detalhes } = request.body;

    const novoPedido = await prisma.pedido.create({
      data: {
        descricao,
        valor,
        clienteId,
        status: 'ORÇAMENTO',
        arquivoArte, // Salva o link do PDF no banco
        detalhes     // Salva as opções (Couché, Verniz, etc) no banco
      }
    });

    return response.status(201).json(novoPedido);
  } catch (error) {
    return response.status(401).json({ error: 'Sessão inválida.' });
  }
});

// ROTA PARA O CLIENTE VER AS SUAS ENCOMENDAS (Área do Cliente)
app.get('/meus-pedidos', async (request, response) => {
  const authHeader = request.headers.authorization;
  
  if (!authHeader) {
    return response.status(401).json({ error: 'Sessão não iniciada.' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const { verify } = require('jsonwebtoken');
    const decoded = verify(token, 'sua_senha_super_secreta_aqui'); // Usa a tua chave secreta
    const clienteId = decoded.sub;

    // Vai à base de dados procurar os pedidos deste cliente específico
    const meusPedidos = await prisma.pedido.findMany({
      where: { clienteId },
      orderBy: { criadoEm: 'desc' } // Mostra os mais recentes primeiro
    });

    return response.json(meusPedidos);
  } catch (error) {
    return response.status(401).json({ error: 'Sessão inválida ou expirada.' });
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