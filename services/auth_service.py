import os
import jwt

from datetime import (
    datetime,
    timedelta,
    timezone
)

from pwdlib import PasswordHash
from sqlmodel import Session

from repositories import usuario_repository


SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "chave-lumina"
)

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60

password_hash = PasswordHash.recommended()


def autenticar_usuario(
    session: Session,
    email: str,
    senha: str
):

    usuario = usuario_repository.buscar_por_email(
        session,
        email
    )

    if not usuario:
        raise ValueError(
            "E-mail ou senha incorretos."
        )

    senha_correta = password_hash.verify(
        senha,
        usuario.senha
    )

    if not senha_correta:
        raise ValueError(
            "E-mail ou senha incorretos."
        )

    return usuario


def criar_token(
    usuario_id: int
):

    expiracao = (
        datetime.now(timezone.utc)
        + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    dados = {
        "sub": str(usuario_id),
        "exp": expiracao
    }

    return jwt.encode(
        dados,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def decodificar_token(
    token: str
):

    try:

        dados = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        usuario_id = dados.get("sub")

        if usuario_id is None:
            raise ValueError(
                "Token inválido."
            )

        return int(usuario_id)

    except jwt.ExpiredSignatureError:

        raise ValueError(
            "Token expirado."
        )

    except jwt.InvalidTokenError:

        raise ValueError(
            "Token inválido."
        )

def obter_usuario_atual(
    session: Session,
    token: str
):

    usuario_id = decodificar_token(
        token
    )

    usuario = usuario_repository.buscar_por_id(
        session,
        usuario_id
    )

    if not usuario:
        raise ValueError(
            "Usuário não encontrado."
        )

    return usuario