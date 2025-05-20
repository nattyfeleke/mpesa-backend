-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Draft', 'Submitted');

-- CreateTable
CREATE TABLE "tbl_bank" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "tbl_bank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_branch" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "bank_id" INTEGER NOT NULL,

    CONSTRAINT "tbl_branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_application" (
    "id" SERIAL NOT NULL,
    "bank_name" TEXT NOT NULL,
    "branch_name" TEXT NOT NULL,
    "account_name" TEXT NOT NULL,
    "account_number" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'Draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "bank_id" INTEGER NOT NULL,
    "branch_id" INTEGER NOT NULL,

    CONSTRAINT "tbl_application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_transacion_history" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_transacion_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_application_account_number_key" ON "tbl_application"("account_number");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_transacion_history_transaction_id_key" ON "tbl_transacion_history"("transaction_id");

-- AddForeignKey
ALTER TABLE "tbl_branch" ADD CONSTRAINT "tbl_branch_bank_id_fkey" FOREIGN KEY ("bank_id") REFERENCES "tbl_bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_application" ADD CONSTRAINT "tbl_application_bank_id_fkey" FOREIGN KEY ("bank_id") REFERENCES "tbl_bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_application" ADD CONSTRAINT "tbl_application_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "tbl_branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
