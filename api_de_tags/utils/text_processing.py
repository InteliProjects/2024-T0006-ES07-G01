import nltk
from nltk.tokenize import word_tokenize
from nltk.tag import pos_tag
from nltk.corpus import stopwords
from nltk.tokenize import RegexpTokenizer
from collections import Counter

nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('stopwords')

def extract_nouns(text):
    # Define um tokenizador para manter palavras compostas juntas
    tokenizer = RegexpTokenizer(r'\w+(?:-\w+)*')

    # Tokeniza o texto
    tokens = tokenizer.tokenize(text)

    # Obtém as tags de partes do discurso para cada palavra
    tagged_words = pos_tag(tokens)

    # Filtra as palavras que são substantivos (NN ou NNS) e não são stopwords
    stop_words = set(stopwords.words('portuguese'))
    nouns = [word.lower() for word, pos in tagged_words if pos.startswith('NN') and word.lower() not in stop_words]

    # Conta a frequência de cada substantivo
    noun_counts = Counter(nouns)

    # Ordena os substantivos por frequência
    sorted_nouns = sorted(noun_counts, key=noun_counts.get, reverse=True)

    # Retorna as 5 palavras mais frequentes como tags
    return sorted_nouns[:5]
