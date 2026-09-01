from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Form,
    File,
    UploadFile
)

from sqlmodel import Session

from database import get_session
from models import LeitorBase, LeitorUpdate
from services import leitor_service

from dependencies.auth import get_current_user

router = APIRouter(
    prefix="/api/leitores",
    tags=["Leitores"],
    dependencies=[
        Depends(get_current_user)
    ]
)


@router.get("/")
def listar_leitores(
    session: Session = Depends(get_session)
):

    return leitor_service.listar_leitores(
        session
    )


@router.get("/{leitor_id}")
def buscar_leitor(
    leitor_id: int,
    session: Session = Depends(get_session)
):

    leitor = leitor_service.buscar_leitor(
        session,
        leitor_id
    )

    if not leitor:

        raise HTTPException(
            status_code=404,
            detail="Leitor não encontrado."
        )

    return leitor


@router.post("/")
async def criar_leitor(
    nome: str = Form(...),
    email: str = Form(...),
    foto: UploadFile | None = File(default=None),
    session: Session = Depends(get_session)
):

    try:

        return await leitor_service.criar_leitor(
            session=session,
            nome=nome,
            email=email,
            foto=foto
        )

    except ValueError as erro:

        raise HTTPException(
            status_code=400,
            detail=str(erro)
        )


@router.put("/{leitor_id}")
def atualizar_leitor(
    leitor_id: int,
    dados: LeitorUpdate,
    session: Session = Depends(get_session)
):

    try:

        return leitor_service.atualizar_leitor(
            session=session,
            leitor_id=leitor_id,
            nome=dados.nome,
            email=dados.email
        )

    except ValueError as erro:

        raise HTTPException(
            status_code=404,
            detail=str(erro)
        )


@router.delete("/{leitor_id}")
def excluir_leitor(
    leitor_id: int,
    session: Session = Depends(get_session)
):

    try:

        leitor_service.excluir_leitor(
            session,
            leitor_id
        )

        return {
            "mensagem": "Leitor excluído com sucesso."
        }

    except ValueError as erro:

        raise HTTPException(
            status_code=404,
            detail=str(erro)
        )


@router.get("/{leitor_id}/detalhes")
def detalhes_leitor(
    leitor_id: int,
    session: Session = Depends(get_session)
):

    try:

        return leitor_service.obter_detalhes_leitor(
            session,
            leitor_id
        )

    except ValueError as erro:

        raise HTTPException(
            status_code=404,
            detail=str(erro)
        )