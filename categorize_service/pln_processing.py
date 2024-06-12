import nltk
from nltk import tokenize
import pandas as pd
import numpy
import re

nltk.download('punkt')
nltk.download('stopwords')
stopwords = nltk.corpus.stopwords.words('portuguese')


def tokenize_a_text(text):
  words = tokenize.word_tokenize(text, language='portuguese')
  return words

def remove_stop_words(words):
  stopwords = nltk.corpus.stopwords.words('portuguese')
  words_filtered = []
  for word in words:
    if word not in stopwords:
        words_filtered.append(word)
  return words_filtered

def lowercase_tokens(tokens):
    new_tokens = []
    for token in tokens:
        if isinstance(token, str):
            new_tokens.append(token.lower())
        else:  # Se for um "token" com múltiplas palavras
            print("token multiplo lower_case", token)
            new_words = [sub_word.lower() for sub_word in token]
            new_tokens.extend(new_words)
    return new_tokens


def pipeline_pre_processing (text):
  tokenize_text = tokenize_a_text(text)
  lowercase_text = lowercase_tokens(tokenize_text)
  filtered_text = remove_stop_words(lowercase_text)

  return filtered_text

def contabiliza_palavras(df, coluna):
    palavras_tecnologia =[ "tecnologia",   "inovação",    "software",    "hardware",    "inteligência artificial",    "machine learning",    "blockchain",    "realidade virtual",    "realidade aumentada",    "robótica",    "automação",    "dados",    "algoritmo",    "cybersegurança",    "rede",    "cloud computing",    "iot",    "internet das coisas",    "desenvolvimento",    "aplicativo",    "sistema operacional banco de dados",    "programação",    "interface",    "usabilidade",    "tecnologia",    "5g",    "digital"]
    palavras_empreendedorismo = [    "empreendedorismo",    "start-up",    "escalabilidade",    "investimento",    "venture",    "capital",    "pitch",    "modelo de negócio",    "empreendedor",    "inovação",    "mercado",    "produto",    "serviço",    "cliente",    "parceria",    "lucro",    "receita",    "competição",    "branding",    "marketing",    "crescimento",    "sustentabilidade",    "empreender",    "networking",    "incubadora",    "aceleradora",    "mvp"]
    palavras_vendas = ["vendas",    "negociação",    "conversão",    "cliente",    "produto",    "serviço",    "estratégia de vendas",    "funil de vendas",    "marketing digital",    "lead",    "crm",    "proposta",    "fechamento",    "objeção",    "desconto",    "meta",    "comissão",    "vendedor",    "prospeção",    "engajamento",    "retenção",    "pós-venda",    "fidelização",    "upsell",    "cross-sell",    "roi"]
    palavras_lideranca = [    "liderança",    "líder",    "equipe",    "motivação",    "gestão",    "comunicação",    "visão",    "objetivo",    "feedback",    "desenvolvimento",    "empoderamento",    "estratégia",    "conflito",    "inovação",    "cultura",    "comprometimento",    "resiliência",    "coaching",    "liderança servidora",    "diversidade", "inclusão",    "tomada de decisão",    "negociação",    "inteligência emocional",    "autoridade",    "inspiração"]
    palavras_estrategia = [    "estratégia",    "planejamento",    "objetivo",    "meta",    "análise",    "swot (forças, fraquezas, oportunidades, ameaças)",    "competitividade",    "mercado",    "inovação",    "crescimento",    "escala",    "diferenciação",    "posicionamento",    "execução",    "kpi (indicadores-chave de performance)",    "benchmarking",    "vantagem competitiva",    "modelo de negócio",    "análise de risco",    "gestão de mudanças",    "sustentabilidade",    "segmentação",    "alvo",    "tática",    "otimização",    "visão"]
    for indice, linha in df.iterrows():
        texto = linha[coluna]
        score_tecnologia = 0
        score_empreendedorismo = 0
        score_vendas = 0
        score_lideranca = 0
        score_estrategia = 0

        for palavra in texto:
            if palavra in palavras_tecnologia:
                score_tecnologia += 1
            if palavra in palavras_empreendedorismo:
                score_empreendedorismo += 1
            if palavra in palavras_vendas:
                score_vendas += 1
            if palavra in palavras_lideranca:
                score_lideranca += 1
            if palavra in palavras_estrategia:
                score_estrategia += 1

        df.at[indice, 'score_tecnologia'] = score_tecnologia
        df.at[indice, 'score_empreendedorismo'] = score_empreendedorismo
        df.at[indice, 'score_vendas'] = score_vendas
        df.at[indice, 'score_lideranca'] = score_lideranca
        df.at[indice, 'score_estrategia'] = score_estrategia

    return df

def atribui_categoria(df):
  for indice, linha in df.iterrows():
      categorias = ['tecnologia', 'empreendedorismo', 'vendas', 'lideranca', 'estrategia']
      scores = [linha['score_tecnologia'], linha['score_empreendedorismo'], linha['score_vendas'],
                linha['score_lideranca'], linha['score_estrategia']]
      maior_score = max(scores)
      indice_maior_score = scores.index(maior_score)
      categoria = categorias[indice_maior_score]
      df.at[indice, 'category'] = categoria
  return df


def main(text):
  df = pd.DataFrame(columns=['transcription','filtered_text','score_tecnologia','score_empreededorismo','score_estrategia','score_vendas','score_lideranca','category'])
  df.loc[0, 'transcription'] = text
#   df.head()
  filtered_text = pipeline_pre_processing(text)
  df['filtered_text'] = df['filtered_text'].apply(lambda x: filtered_text if pd.isna(x) else x)
  df = contabiliza_palavras(df, 'filtered_text')
  df = atribui_categoria(df)
#   df.head()
  categoria = df.loc[0,'category']
  print('Categoria:', categoria)

  return categoria

