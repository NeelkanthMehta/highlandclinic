import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  const depts = await prisma.department.findMany();
  console.log("Departments in DB:", JSON.stringify(depts, null, 2));

  const docs = await prisma.user.findMany({
    where: { role: "DOCTOR" },
    include: { doctorProfile: true },
  });
  console.log("Doctors in DB count:", docs.length);
  docs.forEach((d) => {
    console.log(`- ${d.name} (${d.doctorProfile?.specialty})`);
  });
}

main().catch(console.error).finally(() => process.exit(0));

