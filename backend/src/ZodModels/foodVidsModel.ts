import { z } from 'zod';

export const foodVidsModel = z.object({
    videoUrl: z.string(),
    title: z.string(),
    description: z.string(),
})