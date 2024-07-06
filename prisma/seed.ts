import { prisma } from "../src/utils/context";

const seedUser = async () => {
  try {
    await prisma.users.create({
      data: {
        email: "admin@admin.com",
        name: "Admin",
        userType: "admin",
        createdBy: 1,
      },
    });
  } catch (error) {
    return error;
  }
};

seedUser()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async () => {
    await prisma.$disconnect();
    process.exit(1);
  });
