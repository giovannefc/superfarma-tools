-- CreateEnum
CREATE TYPE "public"."EmprestimoStatus" AS ENUM ('PAGO', 'PENDENTE', 'SEPARADO');

-- CreateEnum
CREATE TYPE "public"."EmprestimoTipo" AS ENUM ('ENTRADA', 'SAIDA');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Emprestimo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parceiroId" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "produto" TEXT NOT NULL,
    "fabricante" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "requisitante" TEXT NOT NULL,
    "tipo" "public"."EmprestimoTipo" NOT NULL,
    "status" "public"."EmprestimoStatus" NOT NULL,

    CONSTRAINT "Emprestimo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EmprestimoParceiro" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "EmprestimoParceiro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Conciliacao" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dataInicial" TIMESTAMP(3) NOT NULL,
    "dataFinal" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Conciliacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Cartao" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "conciliacaoId" TEXT NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL,
    "modalidade" TEXT NOT NULL,
    "bandeira" TEXT NOT NULL,
    "parcelas" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Cartao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."Emprestimo" ADD CONSTRAINT "Emprestimo_parceiroId_fkey" FOREIGN KEY ("parceiroId") REFERENCES "public"."EmprestimoParceiro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cartao" ADD CONSTRAINT "Cartao_conciliacaoId_fkey" FOREIGN KEY ("conciliacaoId") REFERENCES "public"."Conciliacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;
