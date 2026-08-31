import { z } from 'zod';

const menuSchema = z.object({
    number: z.string(),
    name_chinese: z.string(),
    name_german: z.string(),
    price: z.string(),
    description: z.string(),
    unit: z.string().optional(),
    allergens: z.string().optional(),
    additive: z.string().optional(),
    // Link of the photo of the menu item
    photo: z.string().optional(),
});

export type Menu = z.infer<typeof menuSchema>;
