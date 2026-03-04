-- AlterTable
ALTER TABLE `pedidos` ADD COLUMN `arquivoArte` VARCHAR(191) NULL,
    ADD COLUMN `detalhes` JSON NULL;

-- AlterTable
ALTER TABLE `produtos` ADD COLUMN `variacoes` JSON NULL;

-- CreateTable
CREATE TABLE `imagens_produto` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `produtoId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `imagens_produto` ADD CONSTRAINT `imagens_produto_produtoId_fkey` FOREIGN KEY (`produtoId`) REFERENCES `produtos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
