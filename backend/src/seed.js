// backend/src/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: 'hashedpassword', // normally you'd hash it
      name: 'Test User',
    },
  });

  const camper = await prisma.camper.create({
    data: {
      title: 'Test Camper',
      description: 'A cozy camper van',
      location: 'Brussels',
      price: 89.99,
      ownerId: user.id,
    },
  });

  console.log({ userId: user.id, camperId: camper.id });
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
