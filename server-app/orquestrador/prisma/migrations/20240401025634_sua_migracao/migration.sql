-- AlterTable
ALTER TABLE "Video" ALTER COLUMN "linkS3" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "processo" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "from" TEXT,
    "to" TEXT,
    "tempo_de_processamento" INTEGER,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
