import prisma from "../../app/config/db.config";

export const seedBanks = async (): Promise<any> => {
  // Sample bank data
  const banks = [
    { value: "Bank of Abysinia" },
    { value: "Commercial Bank of Ethiopia" },
    { value: "Zemen Bank" },
    { value: "Nib Bank" },
    { value: "Zamzam Bank" },
  ];

  // Create banks
  for (const bank of banks) {
    await prisma.bank.upsert({
      where: {
        // Since there's no unique field other than id, we'll use a compound where condition
        id:
          (await prisma.bank.findFirst({ where: { value: bank.value } }))?.id ||
          -1,
      },
      update: {
        value: bank.value,
      },
      create: {
        value: bank.value,
      },
    });
  }

  console.log(`${banks.length} banks seeded successfully.`);
};
