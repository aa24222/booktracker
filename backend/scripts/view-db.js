const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('\n========== DATABASE CONTENTS ==========\n');

  console.log('📚 BOOKS:');
  const books = await prisma.book.findMany();
  console.log(books.length > 0 ? books : 'No books yet');

  console.log('\n👤 USERS:');
  const users = await prisma.user.findMany();
  console.log(users.length > 0 ? users : 'No users yet');

  console.log('\n📖 USER BOOKS:');
  const userBooks = await prisma.userBook.findMany({
    include: { 
      book: true,
      user: true 
    }
  });
  console.log(userBooks.length > 0 ? JSON.stringify(userBooks, null, 2) : 'No user books yet');

  console.log('\n📁 COLLECTIONS:');
  const collections = await prisma.collection.findMany({
    include: { 
      _count: { select: { books: true } }
    }
  });
  console.log(collections.length > 0 ? JSON.stringify(collections, null, 2) : 'No collections yet');

  console.log('\n========================================\n');
}

main()
  .catch(e => {
    console.error('Error:', e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });