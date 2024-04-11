import { z } from "zod";

// criar um novo usuário
export const createUserSchema = {
  name: z.string(), 
  email: z.string().email(), 
  password: z.string(), 
  confirmPassword: z.string(),
};

// Objeto Zod correspondente ao esquema de criação de usuário
const createUserObject = z.object(createUserSchema);
// Tipo inferido para criar um novo usuário
export type CreateUserDTO = z.infer<typeof createUserObject>;

// Esquema para fazer login de usuário
export const loginUserSchema = {
  email: z.string().email(), // Email do usuário (string no formato de email válido)
  password: z.string(), // Senha do usuário (string)
};

// Objeto Zod correspondente ao esquema de login de usuário
const loginUserObject = z.object(loginUserSchema);
// Tipo inferido para fazer login de usuário
export type LoginUserDTO = z.infer<typeof loginUserObject>;
