import express from "express";
import "express-async-errors";
import cors from "cors";
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

import errorHandler from "./middlewares/errorHandler";
import router from "./appRouter";

require("dotenv").config();
console.log(process.env);

const options = {
  definition: {
    openapi: "3.0.0", // Versão do OpenAPI
    info: {
      title: "Minha API Node",
      version: "1.0.0",
      description: "Uma descrição simples da minha API",
    },
  },
  apis: ["./routes/*.js"], // Caminhos para os arquivos onde os endpoints estão documentados
};

const app = express();
// require("dotenv").config({ path: "../api-gpt/.env" });
console.log(process.env.OPENAI_API_KEY);
app.use(cors());
app.use(express.json());
app.use(errorHandler);

app.use("/", router);

const PORT = process.env.PORT || 5028;
const specs = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.listen(PORT, () =>
  console.log(
    `Servidor rodando na porta ${PORT} e api_key é: ${process.env.OPENAI_API_KEY}`
  )
);
