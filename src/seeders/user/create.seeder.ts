import bcrypt from "bcryptjs";
import prisma from "../../app/config/db.config";
import { cleanEnv, email, str } from "envalid";

const env = cleanEnv(process.env, {
  SUPER_ADMIN_EMAIL: email(),
  SUPER_ADMIN_PASSWORD: str(),
});

export const seedUser = async (): Promise<any> => {
  const password = await bcrypt.hash(env.SUPER_ADMIN_PASSWORD, 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: env.SUPER_ADMIN_EMAIL },
    update: {
      firstName: "Super",
      lastName: "Admin",
      fullName: "Super Admin",
      password: password,
      phoneNumber: "123456789",
    },
    create: {
      email: env.SUPER_ADMIN_EMAIL,
      firstName: "Super",
      lastName: "Admin",
      fullName: "Super Admin",
      password: password,
      phoneNumber: "123456789",
    },
  });
};
