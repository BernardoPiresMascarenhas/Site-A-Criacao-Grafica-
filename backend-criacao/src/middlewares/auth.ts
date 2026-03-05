import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function verificarToken(request: Request, response: Response, next: NextFunction) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({ error: 'Token não fornecido' });
  }

  // O formato do header geralmente é "Bearer TOKEN"
  const token = authHeader.split(' ')[1];

  try {
    // A MÁGICA AQUI: Usando a mesma chave secreta que o Login usou para gerar o token!
    const chaveSecreta = process.env.JWT_SECRET || 'minha_chave_super_secreta_123';
    
    jwt.verify(token, chaveSecreta);
    
    next(); // Se deu tudo certo, autoriza a continuar
  } catch (err) {
    console.error("ERRO NO TOKEN:", err); // Fofoca no terminal caso dê erro de novo
    return response.status(401).json({ error: 'Token inválido ou expirado' });
  }
}