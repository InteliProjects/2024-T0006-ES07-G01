/*
  Warnings:

  - You are about to drop the column `descricao_curta` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `descricao_longa` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `transcricao` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `transcricao_processada` on the `Video` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "descricao_curta",
DROP COLUMN "descricao_longa",
DROP COLUMN "link",
DROP COLUMN "transcricao",
DROP COLUMN "transcricao_processada",
ADD COLUMN     "descricaoCurta" TEXT,
ADD COLUMN     "descricaoLonga" TEXT,
ADD COLUMN     "linkS3" TEXT NOT NULL DEFAULT 'nha',
ADD COLUMN     "linkTranscricao" TEXT,
ADD COLUMN     "transcricaoProcessada" TEXT[];
