import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { invoice } = await readBody(event);

  assertMethod(event, ['PUT']);

  // Update invoice with prisma

  // const items = await prisma.invoiceItem.updateMany({
  // where: {
  //     invoiceId: invoice.id
  // },
  // data: {
  //     itemName:
  // }
  // })

  const invoiceToUpdate = await prisma.invoice.update({
    where: {
      id: invoice.id,
    },
    data: {
      status: invoice.status,
    },
  });

  if (!invoiceToUpdate) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Invoice not found',
    });
  }

  return {
    invoiceToUpdate,
  };
});
