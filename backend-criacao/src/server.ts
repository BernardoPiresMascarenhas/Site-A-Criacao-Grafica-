import cors from 'cors';
import { verificarToken } from './middlewares/auth';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import express from 'express';
import { PrismaClient } from '@prisma/client';// Importando o Prisma

const app = express();
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

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});