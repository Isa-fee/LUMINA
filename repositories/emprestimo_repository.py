from sqlmodel import Session, select

from models import Emprestimo


def listar(session: Session):

    return session.exec(
        select(Emprestimo)
    ).all()


def buscar_por_id(
    session: Session,
    emprestimo_id: int
):

    return session.get(
        Emprestimo,
        emprestimo_id
    )


def listar_por_leitor(
    session: Session,
    leitor_id: int
):

    return session.exec(
        select(Emprestimo).where(
            Emprestimo.leitor_id == leitor_id
        )
    ).all()


def listar_por_livro(
    session: Session,
    livro_id: int
):

    return session.exec(
        select(Emprestimo).where(
            Emprestimo.livro_id == livro_id
        )
    ).all()


def salvar(
    session: Session,
    emprestimo: Emprestimo
):

    session.add(emprestimo)
    session.commit()
    session.refresh(emprestimo)

    return emprestimo


def deletar(
    session: Session,
    emprestimo: Emprestimo
):

    session.delete(emprestimo)
    session.commit()