import json

from sqlmodel import Session

from database import engine
from models import Livro


def popular_livros():
    with open("dados/livros.json", "r", encoding="utf-8") as arquivo:
        livros = json.load(arquivo)

    with Session(engine) as session:
        for dados in livros:
            livro = Livro(
                titulo=dados["titulo"],
                autor=dados["autor"],
                categoria=dados["categoria"],
                isbn=dados["isbn"],
                quantidade_total=dados["quantidade_total"],
                quantidade_disponivel=dados["quantidade_total"],
                editora=dados["editora"],
                ano_publicacao=dados["ano_publicacao"],
                edicao=dados["edicao"],
                numero_paginas=dados["numero_paginas"],
                descricao=dados["descricao"],
                capa=dados["capa"]
            )

            session.add(livro)

        session.commit()

    print(f"{len(livros)} livros cadastrados com sucesso!")


if __name__ == "__main__":
    popular_livros()