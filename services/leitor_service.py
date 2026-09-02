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
    telefone: str | None = None,
    endereco: str | None = None,
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
        telefone=telefone,
        endereco=endereco,
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


    emprestimos_atuais = []
    historico = []

    hoje = date.today()


    for emprestimo in emprestimos:

        livro = livro_repository.buscar_por_id(
            session,
            emprestimo.livro_id
        )


        dados_emprestimo = {
            "id": emprestimo.id,
            "livro_id": emprestimo.livro_id,
            "livro": (
                livro.titulo
                if livro
                else "Livro não encontrado"
            ),
            "capa": (
                livro.capa
                if livro
                else None
            ),
            "data_emprestimo":
                emprestimo.data_emprestimo,
            "data_prevista_devolucao":
                emprestimo.data_prevista_devolucao,
            "data_devolucao":
                emprestimo.data_devolucao
        }


        # Ainda não foi devolvido
        if emprestimo.data_devolucao is None:

            if (
                emprestimo.data_prevista_devolucao
                and hoje >
                emprestimo.data_prevista_devolucao
            ):
                dados_emprestimo["status"] = "Atrasado"

            else:
                dados_emprestimo["status"] = "No prazo"


            emprestimos_atuais.append(
                dados_emprestimo
            )


        # Já foi devolvido
        else:

            dados_emprestimo["status"] = "Devolvido"

            historico.append(
                dados_emprestimo
            )


    # Próxima devolução
    datas_previstas = [
        emprestimo.data_prevista_devolucao

        for emprestimo in emprestimos

        if (
            emprestimo.data_devolucao is None
            and
            emprestimo.data_prevista_devolucao
            is not None
        )
    ]


    proxima_devolucao = (
        min(datas_previstas)
        if datas_previstas
        else None
    )


    return {
        "id": leitor.id,
        "nome": leitor.nome,
        "email": leitor.email,
        "telefone": leitor.telefone,
        "endereco": leitor.endereco,
        "data_cadastro": leitor.data_cadastro,
        "foto": leitor.foto,

        "total_emprestimos":
            len(emprestimos),

        "total_devolucoes":
            len(historico),

        "proxima_devolucao":
            proxima_devolucao,

        "emprestimos_atuais":
            emprestimos_atuais,

        "historico":
            historico
    }