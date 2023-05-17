import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  await prisma.invoice.create({
    data: {
      invId: '1',
      clientCompany: 'Render',
      clientName: 'Carlos Morales',
      clientName2: '',
      clientEmail: 'carlos@render.com',
      clientEmail2: '',
      currencyType: 'MX',
      exchangeCost: 0,
      eta: 'Inmediata',
      invoiceDate: '4 abr 2023',
      paymentDueDate: '2023-04-30T07:00:00.000Z',
      paymentType: 'Contado',
      notes: '',
      invoiceItems: {
        create: [
          {
            itemId: 'test',
            itemName: 'test item',
            itemDescription: 'test item',
            condition: 'nuevo',
            qty: 0,
            partNo: '',
            price: 0,
            total: 0,
          },
        ],
      },
      invoiceTax: 16.0,
      invoiceSubtotal: 100.0,
      invoiceTotal: 116.0,
      status: 'Borrador',
    },
  });
}

try {
  await seed();
  await prisma.$disconnect();
} catch (e) {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
}
