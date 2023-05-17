import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { id } = await readBody(event);
  console.log(id);

  assertMethod(event, ['DELETE']);

  const items = await prisma.invoiceItem.deleteMany({
    where: {
      invoiceId: id,
    },
  });

  const invoice = await prisma.invoice.delete({
    where: {
      id: id as number,
    },
  });

  if (!invoice) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Invoice not found',
    });
  }

  return {
    invoice,
    items,
  };
});
