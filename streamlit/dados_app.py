import streamlit as st

def main():
    # Descrição curta do vídeo
    short_description = st.text_area(
        "Descrição curta",
        ""
    )

    # Descrição longa do vídeo
    long_description = st.text_area(
        "Descrição longa",
        ""
    )

    # As 5 principais tags relacionadas
    tags = st.text_input(
        "Tags relacionadas (separadas por vírgula)",
        "tag1, tag2, tag3, tag4, tag5"
    )

if __name__ == "__main__":
    main()

  


