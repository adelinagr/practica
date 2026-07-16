const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

const prisma = new PrismaClient();

async function main() {
  const newHash = hashPassword('admin123');
  await prisma.user.upsert({
    where: { email: 'admin@vreaudigitalizare.eu' },
    update: { password: newHash, role: 'ADMIN' },
    create: {
      email: 'admin@vreaudigitalizare.eu',
      name: 'Admin',
      password: newHash,
      role: 'ADMIN',
    }
  });
  console.log('Admin user created/updated with password: admin123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
