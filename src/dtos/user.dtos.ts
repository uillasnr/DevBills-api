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
export const LoginUserSchema = {
  email: z.string().email(), 
  password: z.string(), 
};

// Objeto Zod correspondente ao esquema de login de usuário
const LoginUserObject = z.object(LoginUserSchema);
// Tipo inferido para fazer login de usuário
export type LoginUserDTO = z.infer<typeof LoginUserObject>;
