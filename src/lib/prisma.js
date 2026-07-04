import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

let prisma;

if (process.env.NODE_ENV === 'production') {
  // In Vercel serverless, the filesystem is read-only except for /tmp
  const tmpDbPath = path.join('/tmp', 'dev.db');
  
  if (!fs.existsSync(tmpDbPath)) {
    // Find the original dev.db in the deployment
    const originalDbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    
    // Copy it to /tmp so we can read and write to it
    if (fs.existsSync(originalDbPath)) {
      fs.copyFileSync(originalDbPath, tmpDbPath);
      console.log('Successfully copied SQLite DB to /tmp for write access.');
    } else {
      console.warn('Could not find original dev.db at', originalDbPath);
    }
  }

  // Tell Prisma to use the writable database in /tmp
  prisma = new PrismaClient({
    datasourceUrl: `file:${tmpDbPath}`
  });
} else {
  // In local development, use the normal client
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
