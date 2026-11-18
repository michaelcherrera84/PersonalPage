import { z } from "zod";

export const shiftSchema = z.object({
    id: z.number().int().positive(),
    start: z.date(),
    end: z.date().optional().nullable(),
    storeHrs: z.number().nonnegative().optional().nullable(),
    roadHrs: z.number().nonnegative().optional().nullable(),
    miles: z.number().nonnegative().optional().nullable(),
    driverInStorePay: z.number().nonnegative().optional().nullable(),
    onRoadPay: z.number().nonnegative().optional().nullable(),
    mileage: z.number().nonnegative().optional().nullable(),
    cashTips: z.number().optional().nullable(),
    ccTips: z.number().nonnegative().optional().nullable(),
    mileageCost: z.number().nonnegative().optional().nullable(),
});

export const shiftCreateSchema = shiftSchema.pick({ start: true });
export const shiftUpdateSchema = shiftSchema.partial().extend({ id: z.number().int().positive() });

export type Shift = z.infer<typeof shiftSchema>;
export type CreateShift = z.infer<typeof shiftCreateSchema>;
export type UpdateShift = z.infer<typeof shiftUpdateSchema>;
