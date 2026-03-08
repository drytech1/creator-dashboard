import { prisma } from "../src/lib/prisma";

async function testConnection() {
  try {
    // Try to query the database
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log("✅ Database connection successful!");
    console.log("Result:", result);
    
    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log("\n📋 Tables in database:");
    console.log(tables);
    
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
