from sqlmodel import Session

from models import Leitor
from repositories import leitor_repository


def listar_leitores(
    session: Session
):
    return leitor_repository.listar(
        session
    )


def buscar_leitor(
    session: Session,
    leitor_id: int
):
    return leitor_repository.buscar_por_id(
        session,
        leitor_id
    )


def criar_leitor(
    session: Session,
    nome: str,
    email: str
):

    leitor = Leitor(
        nome=nome,
        email=email
    )

    return leitor_repository.salvar(
        session,
        leitor
    )


def atualizar_leitor(
    session: Session,
    leitor_id: int,
    nome: str,
    email: str
):

    leitor = leitor_repository.buscar_por_id(
        session,
        leitor_id
    )

    if not leitor:
        raise ValueError(
            "Leitor não encontrado."
        )

    leitor.nome = nome
    leitor.email = email

    return leitor_repository.salvar(
        session,
        leitor
    )


def excluir_leitor(
    session: Session,
    leitor_id: int
):

    leitor = leitor_repository.buscar_por_id(
        session,
        leitor_id
    )

    if not leitor:
        raise ValueError(
            "Leitor não encontrado."
        )

    leitor_repository.deletar(
        session,
        leitor
    )