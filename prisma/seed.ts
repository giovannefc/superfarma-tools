import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Criar hash da senha
  const hashedPassword = await bcrypt.hash("123456", 10);

  // Criar usuário administrador
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@teste.com" },
    update: {},
    create: {
      email: "admin@teste.com",
      name: "Administrador",
      password: hashedPassword,
      isAdmin: true,
      active: true,
    },
  });

  // Criar usuário comum
  const regularUser = await prisma.user.upsert({
    where: { email: "user@teste.com" },
    update: {},
    create: {
      email: "user@teste.com",
      name: "Usuário Comum",
      password: hashedPassword,
      isAdmin: false,
      active: true,
    },
  });

  console.log("✅ Usuários criados com sucesso:");
  console.log(
    `   📧 Admin: ${adminUser.email} | 🔑 Senha: 123456 | 👑 Admin: Sim`,
  );
  console.log(
    `   📧 User: ${regularUser.email} | 🔑 Senha: 123456 | 👑 Admin: Não`,
  );

  // Usar o usuário admin para criar os dados de exemplo
  const user = adminUser;

  // Criar alguns parceiros de exemplo
  console.log("\n🤝 Criando parceiros de exemplo...");

  const parceirosCriados = await Promise.all([
    prisma.emprestimoParceiro.upsert({
      where: { id: "parceiro-1" },
      update: {},
      create: {
        id: "parceiro-1",
        userId: user.id,
        nome: "Farmácia Central",
        ativo: true,
      },
    }),
    prisma.emprestimoParceiro.upsert({
      where: { id: "parceiro-2" },
      update: {},
      create: {
        id: "parceiro-2",
        userId: user.id,
        nome: "Drogaria Popular",
        ativo: true,
      },
    }),
    prisma.emprestimoParceiro.upsert({
      where: { id: "parceiro-3" },
      update: {},
      create: {
        id: "parceiro-3",
        userId: user.id,
        nome: "Farmácia São José",
        ativo: true,
      },
    }),
  ]);

  console.log(`✅ ${parceirosCriados.length} parceiros criados com sucesso!`);

  // Criar empréstimos de exemplo
  console.log("\n💊 Criando empréstimos de exemplo...");

  // Produtos que DEVEMOS (SAÍDA - emprestamos para outros)
  const emprestimosDevemos = [
    {
      parceiroId: "parceiro-1",
      produto: "Dipirona 500mg - 20 comprimidos",
      fabricante: "EMS",
      quantidade: 5,
      requisitante: "João Silva",
      data: new Date("2024-01-15"),
      status: "PENDENTE" as const,
    },
    {
      parceiroId: "parceiro-2",
      produto: "Paracetamol 750mg - 10 comprimidos",
      fabricante: "Medley",
      quantidade: 3,
      requisitante: "Maria Santos",
      data: new Date("2024-01-10"),
      status: "PENDENTE" as const,
    },
    {
      parceiroId: "parceiro-1",
      produto: "Ibuprofeno 600mg - 30 comprimidos",
      fabricante: "Eurofarma",
      quantidade: 2,
      requisitante: "Carlos Oliveira",
      data: new Date("2024-01-08"),
      status: "SEPARADO" as const,
    },
    {
      parceiroId: "parceiro-3",
      produto: "Omeprazol 20mg - 28 cápsulas",
      fabricante: "Sandoz",
      quantidade: 4,
      requisitante: "Ana Costa",
      data: new Date("2024-01-05"),
      status: "PAGO" as const,
    },
  ];

  // Produtos que DEVEM para nós (ENTRADA - outros emprestaram para nós)
  const emprestimosDevem = [
    {
      parceiroId: "parceiro-2",
      produto: "Amoxicilina 500mg - 21 cápsulas",
      fabricante: "Neo Química",
      quantidade: 2,
      requisitante: "Pedro Almeida",
      data: new Date("2024-01-12"),
      status: "PENDENTE" as const,
    },
    {
      parceiroId: "parceiro-3",
      produto: "Losartana 50mg - 30 comprimidos",
      fabricante: "Germed",
      quantidade: 6,
      requisitante: "Lucia Ferreira",
      data: new Date("2024-01-09"),
      status: "PENDENTE" as const,
    },
    {
      parceiroId: "parceiro-1",
      produto: "Metformina 850mg - 60 comprimidos",
      fabricante: "Cimed",
      quantidade: 1,
      requisitante: "Roberto Lima",
      data: new Date("2024-01-07"),
      status: "SEPARADO" as const,
    },
    {
      parceiroId: "parceiro-2",
      produto: "Sinvastatina 20mg - 30 comprimidos",
      fabricante: "Ranbaxy",
      quantidade: 3,
      requisitante: "Carmen Rodriguez",
      data: new Date("2024-01-03"),
      status: "PAGO" as const,
    },
  ];

  // Criar empréstimos que devemos (SAÍDA)
  for (const emprestimo of emprestimosDevemos) {
    await prisma.emprestimo.upsert({
      where: {
        id: `saida-${emprestimo.parceiroId}-${emprestimo.produto.slice(0, 10).replace(/\s/g, "")}`,
      },
      update: {},
      create: {
        id: `saida-${emprestimo.parceiroId}-${emprestimo.produto.slice(0, 10).replace(/\s/g, "")}`,
        userId: user.id,
        parceiroId: emprestimo.parceiroId,
        produto: emprestimo.produto,
        fabricante: emprestimo.fabricante,
        quantidade: emprestimo.quantidade,
        requisitante: emprestimo.requisitante,
        data: emprestimo.data,
        tipo: "SAIDA",
        status: emprestimo.status,
      },
    });
  }

  // Criar empréstimos que devem para nós (ENTRADA)
  for (const emprestimo of emprestimosDevem) {
    await prisma.emprestimo.upsert({
      where: {
        id: `entrada-${emprestimo.parceiroId}-${emprestimo.produto.slice(0, 10).replace(/\s/g, "")}`,
      },
      update: {},
      create: {
        id: `entrada-${emprestimo.parceiroId}-${emprestimo.produto.slice(0, 10).replace(/\s/g, "")}`,
        userId: user.id,
        parceiroId: emprestimo.parceiroId,
        produto: emprestimo.produto,
        fabricante: emprestimo.fabricante,
        quantidade: emprestimo.quantidade,
        requisitante: emprestimo.requisitante,
        data: emprestimo.data,
        tipo: "ENTRADA",
        status: emprestimo.status,
      },
    });
  }

  console.log(
    `✅ ${emprestimosDevemos.length} empréstimos SAÍDA criados (produtos que devemos)`,
  );
  console.log(
    `✅ ${emprestimosDevem.length} empréstimos ENTRADA criados (produtos que devem para nós)`,
  );

  // Resumo final
  console.log("\n📊 Resumo dos dados criados:");
  console.log(`   👤 2 usuários (1 admin + 1 comum)`);
  console.log(`   🤝 ${parceirosCriados.length} parceiros`);
  console.log(`   📤 ${emprestimosDevemos.length} empréstimos SAÍDA (devemos)`);
  console.log(
    `   📥 ${emprestimosDevem.length} empréstimos ENTRADA (devem para nós)`,
  );
  console.log(
    `   💊 ${emprestimosDevemos.length + emprestimosDevem.length} empréstimos totais`,
  );
}

main()
  .catch(e => {
    console.error("❌ Erro durante o seed:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("🔌 Conexão com banco de dados encerrada.");
  });
