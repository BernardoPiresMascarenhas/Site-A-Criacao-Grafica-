import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  // Dizemos para ele salvar na pasta "uploads" na raiz do backend
  upload(folder: string) {
    return {
      storage: multer.diskStorage({
        destination: resolve(__dirname, '..', '..', folder),
        filename: (request, file, callback) => {
          // Gera um código doido (hash) de 16 caracteres
          const fileHash = crypto.randomBytes(16).toString('hex');
          // Junta o código com o nome original (Ex: 8f7a...-arte-banner.pdf)
          const nomeLimpo = file.originalname.replace(/\s+/g, '-');
          const fileName = `${fileHash}-${nomeLimpo}`;

          return callback(null, fileName);
        }
      })
    };
  }
};