from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlmodel import Session

from database import get_session
from models import UsuarioBase, UsuarioUpdate
from services import usuario_service


router = APIRouter(
    prefix="/api/usuarios",
    tags=["Usuários"]
)


@router.get("/")
def listar_usuarios(
    session: Session = Depends(get_session)
):

    return usuario_service.listar_usuarios(
        session
    )


@router.get("/{usuario_id}")
def buscar_usuario(
    usuario_id: int,
    session: Session = Depends(get_session)
):

    usuario = usuario_service.buscar_usuario(
        session,
        usuario_id
    )

    if not usuario:

        raise HTTPException(
            status_code=404,
            detail="Usuário não encontrado."
        )

    return usuario


@router.post("/")
def criar_usuario(
    dados: UsuarioBase,
    session: Session = Depends(get_session)
):

    try:

        return usuario_service.criar_usuario(
            session=session,
            nome=dados.nome,
            email=dados.email,
            senha=dados.senha
        )

    except ValueError as erro:

        raise HTTPException(
            status_code=400,
            detail=str(erro)
        )


@router.put("/{usuario_id}")
def atualizar_usuario(
    usuario_id: int,
    dados: UsuarioUpdate,
    session: Session = Depends(get_session)
):

    try:

        return usuario_service.atualizar_usuario(
            session=session,
            usuario_id=usuario_id,
            nome=dados.nome,
            email=dados.email
        )

    except ValueError as erro:

        mensagem = str(erro)

        if mensagem == "Usuário não encontrado.":

            raise HTTPException(
                status_code=404,
                detail=mensagem
            )

        raise HTTPException(
            status_code=400,
            detail=mensagem
        )


@router.delete("/{usuario_id}")
def excluir_usuario(
    usuario_id: int,
    session: Session = Depends(get_session)
):

    try:

        usuario_service.excluir_usuario(
            session,
            usuario_id
        )

        return {
            "mensagem": "Usuário excluído com sucesso."
        }

    except ValueError as erro:

        raise HTTPException(
            status_code=404,
            detail=str(erro)
        )