import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Criando usuários de produção...");

  // Criar usuário administrador
  const adminPassword = await bcrypt.hash("03031987.TnT", 10);
  const adminUser = await prisma.user.upsert({
    where: { email: "giovannefc@gmail.com" },
    update: {
      password: adminPassword,
      isAdmin: true,
      active: true,
    },
    create: {
      email: "giovannefc@gmail.com",
      name: "Giovanne Ferreira",
      password: adminPassword,
      isAdmin: true,
      active: true,
    },
  });

  // Criar usuário comum
  const userPassword = await bcrypt.hash("101703tnt", 10);
  const regularUser = await prisma.user.upsert({
    where: { email: "contato@superfarmapopular.com.br" },
    update: {
      password: userPassword,
      isAdmin: false,
      active: true,
    },
    create: {
      email: "contato@superfarmapopular.com.br",
      name: "Super Farma Popular",
      password: userPassword,
      isAdmin: false,
      active: true,
    },
  });

  console.log("✅ Usuários de produção criados/atualizados:");
  console.log(
    `   👑 Admin: ${adminUser.email} | Admin: ${adminUser.isAdmin ? "Sim" : "Não"}`,
  );
  console.log(
    `   👤 User: ${regularUser.email} | Admin: ${regularUser.isAdmin ? "Sim" : "Não"}`,
  );

  console.log("\n🔐 Credenciais:");
  console.log(`   📧 ${adminUser.email} | 🔑 03031987.TnT`);
  console.log(`   📧 ${regularUser.email} | 🔑 101703tnt`);
}

main()
  .catch(e => {
    console.error("❌ Erro ao criar usuários de produção:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("🔌 Conexão com banco de dados encerrada.");
  });
