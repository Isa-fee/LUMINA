from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlmodel import Session

from database import get_session
from models import EmprestimoBase, EmprestimoUpdate
from services import emprestimo_service


router = APIRouter(
    prefix="/api/emprestimos",
    tags=["Empréstimos"]
)


@router.get("/")
def listar_emprestimos(
    session: Session = Depends(get_session)
):

    return emprestimo_service.listar_emprestimos(
        session
    )


@router.get("/{emprestimo_id}")
def buscar_emprestimo(
    emprestimo_id: int,
    session: Session = Depends(get_session)
):

    emprestimo = (
        emprestimo_service.buscar_emprestimo(
            session,
            emprestimo_id
        )
    )

    if not emprestimo:

        raise HTTPException(
            status_code=404,
            detail="Empréstimo não encontrado."
        )

    return emprestimo


@router.post("/")
def criar_emprestimo(
    dados: EmprestimoBase,
    session: Session = Depends(get_session)
):

    try:

        return emprestimo_service.criar_emprestimo(
            session=session,
            leitor_id=dados.leitor_id,
            livro_id=dados.livro_id
        )

    except ValueError as erro:

        raise HTTPException(
            status_code=400,
            detail=str(erro)
        )


@router.delete("/{emprestimo_id}")
def devolver_livro(
    emprestimo_id: int,
    session: Session = Depends(get_session)
):

    try:

        emprestimo_service.devolver_livro(
            session,
            emprestimo_id
        )

        return {
            "mensagem": "Livro devolvido com sucesso."
        }

    except ValueError as erro:

        raise HTTPException(
            status_code=404,
            detail=str(erro)
        )


@router.put("/{emprestimo_id}")
def atualizar_emprestimo(
    emprestimo_id: int,
    dados: EmprestimoUpdate,
    session: Session = Depends(get_session)
):

    try:

        return emprestimo_service.atualizar_emprestimo(
            session=session,
            emprestimo_id=emprestimo_id,
            leitor_id=dados.leitor_id,
            livro_id=dados.livro_id
        )

    except ValueError as erro:

        mensagem = str(erro)

        if mensagem == "Empréstimo não encontrado.":

            raise HTTPException(
                status_code=404,
                detail=mensagem
            )

        raise HTTPException(
            status_code=400,
            detail=mensagem
        )