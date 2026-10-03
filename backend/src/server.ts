import dotenv from 'dotenv';
import app from './app';
import { sequelize } from './config/database';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    await sequelize.authenticate();
    console.log('📦 Conectado ao PostgreSQL com sucesso.');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
      console.log(`📄 Swagger disponível em: http://localhost:${PORT}/docs`);
    });
  } catch (error) {
    console.error('❌ Falha ao conectar com o banco de dados:', error);
  }
}

main();
