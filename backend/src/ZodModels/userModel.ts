import { z } from 'zod';

export const registerModel = z.object({
    username: z.string(),
    email: z.email(),
    password: z.string()
});

export const loginModel = z.object({
    email: z.email(),
    password: z.string()
})