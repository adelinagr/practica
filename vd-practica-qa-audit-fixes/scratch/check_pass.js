const bcrypt = require('bcryptjs');

async function test() {
  const hash = "$2b$10$tlnNsRB/nR8rRgvsw64ZaeGJjIN6TuCylb3N9klRvW0LxTjPrUzYG";
  const passwords = ['admin', 'admin123', 'admin1234', 'password', '123456', 'Admin123!', 'VreauDigitalizare123'];
  
  for (const p of passwords) {
    if (bcrypt.compareSync(p, hash)) {
      console.log('Password is: ' + p);
      return;
    }
  }
  console.log('Password not found in common list.');
}
test();
