import express from "express";

import { getDescs } from "./app.controller";

const router = express.Router();
/**
 * @swagger
 * /get-desc:
 *   get:
 *     summary: Retorna um objeto JSON com dois atributos: "descCurta" e "descLonga"
 *     responses:
 *       200:
 *         description: 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 descCurta:
 *                   type: string
 *                   example: Este é um resumo da transcrição em até 150 caracteres!
 *                 descLonga: 
 *                   type: string
 *                   example: Este é um resumo da transcrição em até 1000 caracteres!
 */
router.post("/get-desc", getDescs);
export default router;
