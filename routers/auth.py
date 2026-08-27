from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from fastapi.security import (
    HTTPBearer,
    HTTPAuthorizationCredentials
)

from sqlmodel import Session

from database import get_session
from models import LoginRequest, TokenResponse, UsuarioResponse
from services import auth_service


router = APIRouter(
    prefix="/api/auth",
    tags=["Autenticação"]
)

security = HTTPBearer()

@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    dados: LoginRequest,
    session: Session = Depends(get_session)
):

    try:

        usuario = auth_service.autenticar_usuario(
            session=session,
            email=dados.email,
            senha=dados.senha
        )

        token = auth_service.criar_token(
            usuario.id
        )

        return TokenResponse(
            access_token=token
        )

    except ValueError as erro:

        raise HTTPException(
            status_code=401,
            detail=str(erro)
        )


@router.get(
    "/me",
    response_model=UsuarioResponse
)
def obter_usuario_atual(
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