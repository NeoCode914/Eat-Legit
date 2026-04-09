import { z } from 'zod';

export const PartnerRegisterModel = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string()
});

export const PartnerLoginModel = z.object({
    email: z.email(),
    password: z.string()
});