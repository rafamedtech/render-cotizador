import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { id }: any = event.context.params;

  const invoice = await prisma.invoice.findFirst({
    where: {
      invId: id,
    },
    include: {
      invoiceItems: true,
    },
  });

  if (!invoice) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Invoice not found',
    });
  }

  return invoice;
});
