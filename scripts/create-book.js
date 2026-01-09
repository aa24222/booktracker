require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const book = await prisma.book.create({
    data: {
      id: '18LKPQAACAAJ',
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      isbn: '9780547928227'
    }
  });
  
  console.log('Book created:', book);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());