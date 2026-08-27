from sqlmodel import Session
from pwdlib import PasswordHash

from models import Usuario
from repositories import usuario_repository


password_hash = PasswordHash.recommended()


def listar_usuarios(
    session: Session
):

    return usuario_repository.listar(
        session
    )


def buscar_usuario(
    session: Session,
    usuario_id: int
):

    return usuario_repository.buscar_por_id(
        session,
        usuario_id
    )


def criar_usuario(
    session: Session,
    nome: str,
    email: str,
    senha: str
):

    usuario_existente = (
        usuario_repository.buscar_por_email(
            session,
            email
        )
    )

    if usuario_existente:

        raise ValueError(
            "Já existe um usuário com este e-mail."
        )

    senha_hash = password_hash.hash(
        senha
    )

    usuario = Usuario(
        nome=nome,
        email=email,
        senha=senha_hash
    )

    return usuario_repository.salvar(
        session,
        usuario
    )


def atualizar_usuario(
    session: Session,
    usuario_id: int,
    nome: str,
    email: str
):

    usuario = usuario_repository.buscar_por_id(
        session,
        usuario_id
    )

    if not usuario:

        raise ValueError(
            "Usuário não encontrado."
        )

    usuario_com_email = (
        usuario_repository.buscar_por_email(
            session,
            email
        )
    )

    if (
        usuario_com_email
        and usuario_com_email.id != usuario_id
    ):

        raise ValueError(
            "Já existe um usuário com este e-mail."
        )

    usuario.nome = nome
    usuario.email = email

    return usuario_repository.salvar(
        session,
        usuario
    )


def excluir_usuario(
    session: Session,
    usuario_id: int
):

    usuario = usuario_repository.buscar_por_id(
        session,
        usuario_id
    )

    if not usuario:

        raise ValueError(
            "Usuário não encontrado."
        )

    usuario_repository.deletar(
        session,
        usuario
    )