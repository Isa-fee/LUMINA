from sqlmodel import Session

from datetime import date


from models import Leitor

from repositories import (
    leitor_repository,
    emprestimo_repository,
    livro_repository
)

import os
import uuid
import shutil

def listar_leitores(
    session: Session
):

    leitores = leitor_repository.listar(
        session
    )

    resultado = []

    for leitor in leitores:

        emprestimos = (
            emprestimo_repository.listar_por_leitor(
                session,
                leitor.id
            )
        )

        resultado.append({
            "id": leitor.id,
            "nome": leitor.nome,
            "email": leitor.email,
            "foto": leitor.foto,
            "total_emprestimos": len(emprestimos)
        })

    return resultado

def buscar_leitor(
    session: Session,
    leitor_id: int
):
    return leitor_repository.buscar_por_id(
        session,
        leitor_id
    )


async def criar_leitor(
    session: Session,
    nome: str,
    email: str,
    foto=None
):

    caminho_foto = None


    if foto:

        extensoes_permitidas = {
            ".jpg",
            ".jpeg",
            ".png",
            ".webp"
        }


        _, extensao = os.path.splitext(
            foto.filename
        )

        extensao = extensao.lower()


        if extensao not in extensoes_permitidas:

            raise ValueError(
                "Formato de imagem não permitido."
            )


        nome_arquivo = (
            f"{uuid.uuid4()}{extensao}"
        )


        pasta_fotos = os.path.join(
            "static",
            "uploads",
            "leitores"
        )


        os.makedirs(
            pasta_fotos,
            exist_ok=True
        )


        caminho_arquivo = os.path.join(
            pasta_fotos,
            nome_arquivo
        )


        with open(
            caminho_arquivo,
            "wb"
        ) as arquivo:

            shutil.copyfileobj(
                foto.file,
                arquivo
            )


        caminho_foto = (
            f"uploads/leitores/{nome_arquivo}"
        )


    leitor = Leitor(
        nome=nome,
        email=email,
        foto=caminho_foto
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


    emprestimos = (
        emprestimo_repository.listar_por_leitor(
            session,
            leitor_id
        )
    )


    if emprestimos:

        raise ValueError(
            "Não é possível excluir este leitor "
            "porque existem empréstimos "
            "registrados para ele."
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