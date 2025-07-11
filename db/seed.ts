import { PrismaClient } from "@prisma/client";
import sampleData from "./sample-data";

// this function is to add some data t the database before creating the functionality to do so from the app
async function main() {
  const prisma = new PrismaClient();
  await prisma.product.deleteMany();
  // first we delete everything in the product table and then adding the data so that there are no duplicates
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  await prisma.product.createMany({ data: sampleData.products });
  await prisma.user.createMany({ data: sampleData.users });

  console.log("Database seeded successfully");
}

main();

// to run it we execute in the terminal -> npx tsx ./db/seed
