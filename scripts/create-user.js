require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      id: 'user1',
      email: 'test@example.com',
      name: 'Test User'
    }
  });
  
  console.log('User created:', user);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());