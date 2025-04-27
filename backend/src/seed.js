// prisma/seed.js

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Create users
  const user1 = await prisma.user.create({
    data: {
      email: 'customer1@example.com',
      password: 'password123', // In a real app, use hashed passwords
      name: 'John Doe',
      role: 'CUSTOMER',
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'owner1@example.com',
      password: 'password123',
      name: 'Jane Smith',
      role: 'OWNER',
    },
  })

  // Create a camper
  const camper1 = await prisma.camper.create({
    data: {
      title: 'Cozy Camper',
      description: 'A perfect camper for a weekend getaway.',
      location: 'Belgium',
      price: 50.0,
      ownerId: user2.id, // Set owner to user2 (owner)
    },
  })

  const camper2 = await prisma.camper.create({
    data: {
      title: 'Luxury RV',
      description: 'Spacious and comfortable for long trips.',
      location: 'Germany',
      price: 120.0,
      ownerId: user2.id,
    },
  })

  // Create reviews
  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Had an amazing time in the Cozy Camper!',
      userId: user1.id, // customer1
      camperId: camper1.id, // Cozy Camper
    },
  })

  // Create bookings
  await prisma.booking.create({
    data: {
      startDate: new Date('2025-05-01'),
      endDate: new Date('2025-05-05'),
      userId: user1.id, // customer1
      camperId: camper1.id, // Cozy Camper
    },
  })

  console.log('Seed data created successfully')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
