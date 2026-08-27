from sqlmodel import Session

from models import Livro
from repositories import livro_repository, emprestimo_repository


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


def criar_livro(
    session: Session,
    titulo: str,
    autor: str,
    categoria: str,
    isbn: str,
    quantidade_total: int,
    capa: str | None = None
):

    if quantidade_total < 1:
        raise ValueError(
            "A quantidade deve ser maior que zero."
        )

    livro = Livro(
        titulo=titulo,
        autor=autor,
        categoria=categoria,
        isbn=isbn,
        quantidade_total=quantidade_total,
        quantidade_disponivel=quantidade_total,
        capa=capa
    )

    return livro_repository.salvar(
        session,
        livro
    )


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