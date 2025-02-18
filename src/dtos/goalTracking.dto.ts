import { z } from "zod";


export const CreateGoalTrackingSchema = z.object({
  userId: z.string(),
  name: z.string().min(3, "O nome da meta deve ter pelo menos 3 caracteres"),
  currentAmount: z.number().min(0, "O valor atual não pode ser negativo").default(0),
  targetAmount: z.number().min(1, "O valor da meta deve ser maior que zero"),
  deadline: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Data inválida",
  }).transform((val) => new Date(val)), 
});


export const UpdateGoalTrackingDTO = z.object({
  name: z.string().min(3).optional(),
  currentAmount: z.number().min(0).optional(),
  targetAmount: z.number().min(1).optional(),
  deadline: z.coerce.date().optional(),
});

export type CreateGoalTrackingDTO = z.infer<typeof CreateGoalTrackingSchema>;
export type UpdateGoalTrackingDTO = z.infer<typeof UpdateGoalTrackingDTO>;
