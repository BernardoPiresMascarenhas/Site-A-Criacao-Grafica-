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
    // Verificamos se o token é válido com a mesma chave secreta do login
    jwt.verify(token, 'segredo-do-token');
    next(); // Se deu tudo certo, autoriza a continuar
  } catch (err) {
    return response.status(401).json({ error: 'Token inválido' });
  }
}