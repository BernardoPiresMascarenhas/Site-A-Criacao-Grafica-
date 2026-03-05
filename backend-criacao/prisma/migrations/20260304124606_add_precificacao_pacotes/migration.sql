-- AlterTable
ALTER TABLE `produtos` ADD COLUMN `pacotes` JSON NULL,
    ADD COLUMN `tipoPrecificacao` VARCHAR(191) NOT NULL DEFAULT 'UNIDADE';
