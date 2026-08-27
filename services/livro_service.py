from sqlmodel import Session

from models import Livro
from repositories import livro_repository, emprestimo_repository

import os
import uuid
import shutil

def listar_livros(
    session: Session
):
    return livro_repository.listar(
        session
    )


def buscar_livro(
    session: Session,
    livro_id: int
):
    return livro_repository.buscar_por_id(
        session,
        livro_id
    )


async def criar_livro(
    session,
    titulo,
    autor,
    categoria,
    isbn,
    quantidade_total,
    capa=None
):

    if quantidade_total < 1:
        raise ValueError(
            "A quantidade deve ser maior que zero."
        )


    caminho_capa = None


    if capa:

        extensoes_permitidas = {
            ".jpg",
            ".jpeg",
            ".png",
            ".webp"
        }

        _, extensao = os.path.splitext(
            capa.filename
        )

        extensao = extensao.lower()


        if extensao not in extensoes_permitidas:

            raise ValueError(
                "Formato de imagem não permitido."
            )


        nome_arquivo = (
            f"{uuid.uuid4()}{extensao}"
        )


        pasta_capas = os.path.join(
            "static",
            "uploads",
            "capas"
        )


        os.makedirs(
            pasta_capas,
            exist_ok=True
        )


        caminho_arquivo = os.path.join(
            pasta_capas,
            nome_arquivo
        )


        with open(
            caminho_arquivo,
            "wb"
        ) as arquivo:

            shutil.copyfileobj(
                capa.file,
                arquivo
            )


        caminho_capa = (
            f"uploads/capas/{nome_arquivo}"
        )


    novo_livro = Livro(
        titulo=titulo,
        autor=autor,
        categoria=categoria,
        isbn=isbn,
        quantidade_total=quantidade_total,
        quantidade_disponivel=quantidade_total,
        capa=caminho_capa
    )


    session.add(novo_livro)

    session.commit()

    session.refresh(novo_livro)

    return novo_livro

def excluir_livro(
    session: Session,
    livro_id: int
):

    livro = livro_repository.buscar_por_id(
        session,
        livro_id
    )

    if not livro:
        raise ValueError(
            "Livro não encontrado."
        )

    emprestimos = (
        emprestimo_repository.listar_por_livro(
            session,
            livro_id
        )
    )

    if emprestimos:
        raise ValueError(
            "Não é possível excluir este livro "
            "porque existem empréstimos "
            "registrados para ele."
        )

    livro_repository.deletar(
        session,
        livro
    )

def atualizar_livro(
    session: Session,
    livro_id: int,
    titulo: str,
    autor: str,
    categoria: str,
    isbn: str,
    quantidade_total: int
):

    livro = livro_repository.buscar_por_id(
        session,
        livro_id
    )

    if not livro:
        raise ValueError(
            "Livro não encontrado."
        )

    if quantidade_total < 1:
        raise ValueError(
            "A quantidade deve ser maior que zero."
        )

    quantidade_emprestada = (
        livro.quantidade_total
        - livro.quantidade_disponivel
    )

    if quantidade_total < quantidade_emprestada:
        raise ValueError(
            "A quantidade total não pode ser menor "
            "que a quantidade de livros emprestados."
        )

    livro.titulo = titulo
    livro.autor = autor
    livro.categoria = categoria
    livro.isbn = isbn

    livro.quantidade_total = quantidade_total

    livro.quantidade_disponivel = (
        quantidade_total
        - quantidade_emprestada
    )

    return livro_repository.salvar(
        session,
        livro
    )