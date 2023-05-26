import { PrismaClient } from '@prisma/client';
import type { InvoiceItem } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { invoice } = await readBody(event);

  assertMethod(event, ['PUT']);

  const items = await prisma.invoiceItem.deleteMany({
    where: {
      invoiceId: invoice.id,
    },
  });

  //  invoiceItems: {
  //       create: invoice.invoiceItems.filter((item: InvoiceItem) => !item.id),
  //       // create new invoice items if there are any
  //       // update existing invoice items
  //       update: invoice.invoiceItems
  //         .filter((item: InvoiceItem) => item.id)
  //         .map((item: InvoiceItem) => ({
  //           where: { id: item.id },
  //           data: {
  //             itemId: item.itemId,
  //             itemName: item.itemName,
  //             condition: item.condition,
  //             qty: item.qty,
  //             partNo: item.partNo,
  //             price: item.price,
  //             total: item.total,
  //           },
  //         })),
  //     },

  // Update invoice with prisma
  const updatedInvoice = await prisma.invoice.update({
    where: { id: invoice.id },
    data: {
      clientName: invoice.clientName,
      clientName2: invoice.clientName2,
      clientEmail: invoice.clientEmail,
      clientEmail2: invoice.clientEmail2,
      currencyType: invoice.currencyType,
      exchangeCost: invoice.exchangeCost,
      eta: invoice.eta,
      paymentDueDate: invoice.paymentDueDate,
      paymentType: invoice.paymentType,
      notes: invoice.notes,
      invoiceItems: {
        create: invoice.invoiceItems.map(({ id, invoiceId, ...item }) => item),
      },
      invoiceTax: invoice.invoiceTax,
      invoiceSubtotal: invoice.invoiceSubtotal,
      invoiceTotal: invoice.invoiceTotal,
      status: invoice.status,
    },
    // include the nested invoiceItems model in the query response
    include: { invoiceItems: true },
  });

  return {
    updatedInvoice,
  };
});
