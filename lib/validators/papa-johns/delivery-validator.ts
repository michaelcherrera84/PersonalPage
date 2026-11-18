import { z } from "zod";

const optionalNumber = z.preprocess(
    (value) => value === "" || value === null ? null : value,
    z.coerce.number().nullable()
);

const optionalNonnegativeNumber = optionalNumber.refine(
    (value) => value === null || value >= 0
);

const optionalRating = optionalNumber.refine(
    (value) => value === null || (value >= 1 && value <= 5)
);

export const deliverySchema = z.object({
    id: z.number().int().positive(),
    shiftId: z.number().int().positive(),
    dateTime: z.date(),
    cashTip: optionalNumber,
    ccTip: optionalNonnegativeNumber,
    rating: optionalRating,
    address: z.string().optional().nullable(),
    cashPayment: optionalNonnegativeNumber,
});

export const deliveryCreateSchema = deliverySchema.omit({ id: true });

export type Delivery = z.infer<typeof deliverySchema>;
export type CreateDelivery = z.infer<typeof deliveryCreateSchema>;
