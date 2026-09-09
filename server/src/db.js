import { PrismaClient } from "@prisma/client";

// ONE Prisma Client instance shared by the whole app.
// Every route file imports this same instance.
const prisma = new PrismaClient();

export default prisma;