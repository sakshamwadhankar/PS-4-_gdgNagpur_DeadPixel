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
    
    if (fs.existsSync(originalDbPath)) {
      try {
        fs.copyFileSync(originalDbPath, tmpDbPath);
        console.log('Successfully copied SQLite DB to /tmp for write access.');
      } catch (err) {
        if (err.code !== 'EBUSY') {
          console.error('Failed to copy DB', err);
        }
      }
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
