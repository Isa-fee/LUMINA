from sqlmodel import Session, select

from models import Leitor


def listar(session: Session):
    return session.exec(
        select(Leitor)
    ).all()


def buscar_por_id(
    session: Session,
    leitor_id: int
):
    return session.get(
        Leitor,
        leitor_id
    )


def salvar(
    session: Session,
    leitor: Leitor
):
    session.add(leitor)
    session.commit()
    session.refresh(leitor)

    return leitor


def deletar(
    session: Session,
    leitor: Leitor
):
    session.delete(leitor)
    session.commit()