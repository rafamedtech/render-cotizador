import { PrismaClient } from '@prisma/client';
// import protectRoute from '@/server/utils/protectRoute';

const prisma = new PrismaClient();

export default defineEventHandler((event) => {
  //   protectRoute(event);
  return prisma.invoice.findMany({
    select: {
      clientCompany: true,
      clientName: true,
      clientEmail: true,
      clientName2: true,
      clientEmail2: true,
    },
  });
});
