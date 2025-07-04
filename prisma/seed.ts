import { PrismaClient, Role } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Upsert a customer user
  const customer = await prisma.user.upsert({
    where: { email: 'customer@kulachipo.com' },
    update: {},
    create: {
      email: 'customer@kulachipo.com',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', // password123 (bcrypt hash)
      name: 'Demo Customer',
      role: 'customer',
      image: null,
    },
  })

  // Upsert a vendor user
  const vendorUser = await prisma.user.upsert({
    where: { email: 'vendor@kulachipo.com' },
    update: {},
    create: {
      email: 'vendor@kulachipo.com',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', // password123 (bcrypt hash)
      name: 'Demo Vendor',
      role: 'vendor',
      image: null,
      vendor: {
        create: {
          type: 'Food Truck',
          description: 'Serving the crispiest hand-cut fries with 12 unique seasonings since 2018.',
          address: '123 Food Truck Lane, Downtown',
          phone: '(555) 123-4567',
          website: 'goldencrisp.com',
          isOpen: true,
          rating: 4.8,
          totalReviews: 324,
          totalViews: 2847,
          monthlyViews: 456,
          specialties: ['Hand-cut', 'Seasoned', 'Crispy', 'Double-fried'],
          hours: {
            monday: { open: '11:00', close: '21:00', closed: false },
            tuesday: { open: '11:00', close: '21:00', closed: false },
            wednesday: { open: '11:00', close: '21:00', closed: false },
            thursday: { open: '11:00', close: '22:00', closed: false },
            friday: { open: '11:00', close: '23:00', closed: false },
            saturday: { open: '10:00', close: '23:00', closed: false },
            sunday: { open: '12:00', close: '20:00', closed: false },
          },
          image: '/placeholder.svg?height=400&width=800',
          menuItems: {
            create: [
              {
                name: 'Classic Fries',
                price: 4.99,
                description: 'Hand-cut golden fries with sea salt',
                available: true,
              },
              {
                name: 'Loaded Fries',
                price: 7.99,
                description: 'Fries topped with cheese, bacon, and green onions',
                available: true,
              },
              {
                name: 'Truffle Fries',
                price: 9.99,
                description: 'Premium fries with truffle oil and parmesan',
                available: false,
              },
              {
                name: 'Spicy Cajun Fries',
                price: 5.99,
                description: 'Fries with our signature cajun seasoning',
                available: true,
              },
            ],
          },
        },
      },
    },
    include: { vendor: true },
  })

  // Upsert an admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kulachipo.com' },
    update: {},
    create: {
      email: 'admin@kulachipo.com',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', // password123 (bcrypt hash)
      name: 'Admin User',
      role: Role.admin,
      image: null,
    },
  })

  // Add a review from customer to vendor (only if not exists)
  const existingReview = await prisma.review.findFirst({
    where: {
      vendorId: vendorUser.vendor?.id,
      userId: customer.id,
    },
  })
  if (!existingReview && vendorUser.vendor) {
    await prisma.review.create({
      data: {
        vendorId: vendorUser.vendor.id,
        userId: customer.id,
        rating: 5,
        comment: 'Absolutely amazing! The truffle fries are to die for. Crispy on the outside, fluffy on the inside.',
        replied: false,
      },
    })
  }

  console.log('Database seeded!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 