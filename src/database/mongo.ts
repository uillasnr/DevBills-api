
import mongoose from "mongoose";

export async function setupMongo(): Promise<void> {
  try {
    // Verifique se a conexão já existe e está aberta
    if (mongoose.connection.readyState === 1) {
      return;
    }

    // Crie uma nova conexão com o banco de dados
    const client = await mongoose.connect(
      process.env.MONGODB_URL || "localhost:27017",
      {
        auth: {
          username: process.env.MONGODB_USERNAME,
          password: process.env.MONGODB_PASSWORD,
        },
      }
    );

    // Verifique se a conexão foi bem-sucedida
    if (client.connection.readyState === 1) {
      console.log("🎲 Conectado ao banco de dados com sucesso! 🎲");
    } else {
      console.error("❌ Falha ao conectar ao banco de dados! ❌");
    }
  } catch (error) {
    console.error(error);
  }
}


