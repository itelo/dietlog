import { z } from "zod";

import { createTRPCRouter, protectProcedure } from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
  list: protectProcedure
    .query(({ ctx }) => {
      return ctx.db.post.findMany({
        where: {
          userId: ctx.auth.userId,
        }
      });
    }),

  create: protectProcedure
    .input(z.object({ 
      mealCycleVariant: z.enum([
        "breakfast",
        "lunch",
        "dinner",
        "afternoon-snack",
        "evening-snack",
        "morning-snack",
        "supper", // ceia em pt-br
        "other",
      ]),
      timestamp: z.string().datetime(),
      imageURL: z.string().url(),
     }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          mealCycleVariant: input.mealCycleVariant,
          timestamp: new Date(input.timestamp),
          imageURL: input.imageURL,
          userId: ctx.auth.userId,
        },
      });
    }),
});
