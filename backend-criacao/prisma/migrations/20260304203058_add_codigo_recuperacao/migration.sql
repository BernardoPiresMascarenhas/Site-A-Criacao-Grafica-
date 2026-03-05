/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `clientes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `clientes` ADD COLUMN `codigoRecuperacao` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `clientes_email_key` ON `clientes`(`email`);
