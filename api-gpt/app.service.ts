import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getDescCurta(texto: string): Promise<string> {
  const completion = await openai.completions.create({
    model: "gpt-3.5-turbo-instruct",
    prompt: `Dado a conversa a seguir, faça um resumo, buscando manter as principais ideia discutidas em um única frase, gastando até 50 tokens.\n\n${texto}`,
    max_tokens: 56,
    temperature: 0,
  });

  console.log(completion);

  return completion.choices[0].text;
}

export async function getDescLonga(texto: string): Promise<string> {

  const completion = await openai.completions.create({
    model: "gpt-3.5-turbo-instruct",
    prompt: `Dado a conversa a seguir, faça um resumo, buscando manter as principais ideia discutidas em dois parágrafos de até 3 frases cada, gastando até 250 tokens.\n\n${texto}`,
    max_tokens: 256,
    temperature: 0,
  });

  console.log(completion);
  return completion.choices[0].text;
}
