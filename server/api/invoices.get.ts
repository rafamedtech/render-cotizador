import { PrismaClient } from '@prisma/client';
import protectRoute from '@/server/utils/protectRoute';

const prisma = new PrismaClient();

export default defineEventHandler((event) => {
  // protectRoute(event);
  return prisma.invoice.findMany({
    select: {
      createdAt: true,
      invId: true,
      invoiceDate: true,
      clientCompany: true,
      invoiceTotal: true,
      status: true,
      clientName: true,
      clientName2: true,
      clientEmail: true,
      clientEmail2: true,
    },
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
  });
});
