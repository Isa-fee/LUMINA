from fastapi import (
    Depends,
    HTTPException
)

from fastapi.security import (
    HTTPBearer,
    HTTPAuthorizationCredentials
)

from sqlmodel import Session

from database import get_session
from services import auth_service


security = HTTPBearer()


def get_current_user(
    credenciais: HTTPAuthorizationCredentials = Depends(
        security
    ),
    session: Session = Depends(get_session)
):

    try:

        usuario = auth_service.obter_usuario_atual(
            session=session,
            token=credenciais.credentials
        )

        return usuario

    except ValueError as erro:

        raise HTTPException(
            status_code=401,
            detail=str(erro)
        )