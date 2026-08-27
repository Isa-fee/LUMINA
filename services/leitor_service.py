from sqlmodel import Session

from datetime import date


from models import Leitor

from repositories import (
    leitor_repository,
    emprestimo_repository,
    livro_repository
)


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


def obter_detalhes_leitor(
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

    emprestimos = (
        emprestimo_repository.listar_por_leitor(
            session,
            leitor_id
        )
    )

    historico = []

    hoje = date.today()

    for emprestimo in emprestimos:

        livro = livro_repository.buscar_por_id(
            session,
            emprestimo.livro_id
        )

        status = "No prazo"

        if (
            emprestimo.data_devolucao
            and hoje > emprestimo.data_devolucao
        ):
            status = "Atrasado"

        historico.append({
            "id": emprestimo.id,
            "livro_id": emprestimo.livro_id,
            "livro": livro.titulo if livro else "Livro não encontrado",
            "data_emprestimo": emprestimo.data_emprestimo,
            "data_devolucao": emprestimo.data_devolucao,
            "status": status
        })

    return {
        "id": leitor.id,
        "nome": leitor.nome,
        "email": leitor.email,
        "emprestimos": historico
    }