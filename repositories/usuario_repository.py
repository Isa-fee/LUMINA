from sqlmodel import Session, select

from models import Usuario


def listar(session: Session):

    return session.exec(
        select(Usuario)
    ).all()


def buscar_por_id(
    session: Session,
    usuario_id: int
):

    return session.get(
        Usuario,
        usuario_id
    )


def buscar_por_email(
    session: Session,
    email: str
):

    return session.exec(
        select(Usuario).where(
            Usuario.email == email
        )
    ).first()


def salvar(
    session: Session,
    usuario: Usuario
):

    session.add(usuario)
    session.commit()
    session.refresh(usuario)

    return usuario


def deletar(
    session: Session,
    usuario: Usuario
):

    session.delete(usuario)
    session.commit()