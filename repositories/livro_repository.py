from sqlmodel import Session, select

from models import Livro


def listar(session: Session):
    return session.exec(
        select(Livro)
    ).all()


def buscar_por_id(
    session: Session,
    livro_id: int
):
    return session.get(
        Livro,
        livro_id
    )


def salvar(
    session: Session,
    livro: Livro
):
    session.add(livro)
    session.commit()
    session.refresh(livro)

    return livro


def deletar(
    session: Session,
    livro: Livro
):
    session.delete(livro)
    session.commit()