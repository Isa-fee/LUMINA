from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlmodel import Session
from models import LivroBase, LivroUpdate

from database import get_session
from services import livro_service


router = APIRouter(
    prefix="/api/livros",
    tags=["Livros"]
)


@router.get("/")
def listar_livros(
    session: Session = Depends(get_session)
):

    return livro_service.listar_livros(
        session
    )


@router.get("/{livro_id}")
def buscar_livro(
    livro_id: int,
    session: Session = Depends(get_session)
):

    livro = livro_service.buscar_livro(
        session,
        livro_id
    )

    if not livro:
        raise HTTPException(
            status_code=404,
            detail="Livro não encontrado."
        )

    return livro


@router.post("/")
def criar_livro(
    dados: LivroBase,
    session: Session = Depends(get_session)
):

    try:

        livro = livro_service.criar_livro(
            session=session,
            titulo=dados.titulo,
            autor=dados.autor,
            categoria=dados.categoria,
            isbn=dados.isbn,
            quantidade_total=dados.quantidade_total
        )

        return livro

    except ValueError as erro:

        raise HTTPException(
            status_code=400,
            detail=str(erro)
        )


@router.put("/{livro_id}")
def atualizar_livro(
    livro_id: int,
    dados: LivroUpdate,
    session: Session = Depends(get_session)
):

    try:

        livro = livro_service.atualizar_livro(
            session=session,
            livro_id=livro_id,
            titulo=dados.titulo,
            autor=dados.autor,
            categoria=dados.categoria,
            isbn=dados.isbn,
            quantidade_total=dados.quantidade_total
        )

        return livro

    except ValueError as erro:

        mensagem = str(erro)

        if mensagem == "Livro não encontrado.":

            raise HTTPException(
                status_code=404,
                detail=mensagem
            )

        raise HTTPException(
            status_code=400,
            detail=mensagem
        )


@router.delete("/{livro_id}")
def excluir_livro(
    livro_id: int,
    session: Session = Depends(get_session)
):

    try:

        livro_service.excluir_livro(
            session,
            livro_id
        )

        return {
            "mensagem": "Livro excluído com sucesso."
        }

    except ValueError as erro:

        mensagem = str(erro)

        if mensagem == "Livro não encontrado.":

            raise HTTPException(
                status_code=404,
                detail=mensagem
            )

        raise HTTPException(
            status_code=400,
            detail=mensagem
        )