from fastapi import (FastAPI, Depends, Request, Form, UploadFile, File, HTTPException)

import shutil
import os
import jwt

from contextlib import asynccontextmanager
from sqlmodel import SQLModel, Session
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from sqlmodel import select

from database import engine, get_session

import crud

from datetime import timedelta, date, datetime, timezone
from pwdlib import PasswordHash

from models import (
    Usuario,
    UsuarioBase,
    UsuarioUpdate,

    Livro,
    LivroBase,
    LivroUpdate,

    Emprestimo,
    EmprestimoBase,
    EmprestimoUpdate,

    Leitor,
    LeitorBase,
    LeitorUpdate,
)


SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "chave-lumina"
)

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60

password_hash = PasswordHash.recommended()



@asynccontextmanager
async def lifespan(app: FastAPI):

    SQLModel.metadata.create_all(engine)

    yield


app = FastAPI(lifespan=lifespan)

templates = Jinja2Templates(directory="templates")

app.mount(
    "/static",
    StaticFiles(directory="static"),
    name="static"
)

# =========================
# PÁGINA INICIAL
# =========================

# =========================
# AUTENTICAÇÃO JWT
# =========================

def get_usuario_atual(
    request: Request,
    session: Session = Depends(get_session)
):
    token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(
            status_code=303,
            headers={"Location": "/"}
        )

    try:
        dados = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        usuario_id = dados.get("sub")

        if usuario_id is None:
            raise HTTPException(
                status_code=303,
                headers={"Location": "/"}
            )

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=303,
            headers={"Location": "/"}
        )

    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=303,
            headers={"Location": "/"}
        )

    usuario = session.get(
        Usuario,
        int(usuario_id)
    )

    if not usuario:
        raise HTTPException(
            status_code=303,
            headers={"Location": "/"}
        )

    return usuario


# =========================
# PÁGINA INICIAL
# =========================

@app.get("/index")
def home(
    request: Request,
    usuario: Usuario = Depends(get_usuario_atual)
):

    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={
            "request": request,
            "usuario": usuario
        }
    )

# =========================
# USUARIOS
# =========================

def criar_token(usuario_id: int):

    expiracao = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    dados = {
        "sub": str(usuario_id),
        "exp": expiracao
    }

    token = jwt.encode(
        dados,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token

# def get_usuario_atual(
#     request: Request,
#     session: Session = Depends(get_session)
# ):

    token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(
            status_code=303,
            headers={"Location": "/"}
        )

    try:

        dados = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        usuario_id = dados.get("sub")

        if usuario_id is None:
            raise HTTPException(
                status_code=303,
                headers={"Location": "/"}
            )

    except jwt.ExpiredSignatureError:

        raise HTTPException(
            status_code=303,
            headers={"Location": "/"}
        )

    except jwt.InvalidTokenError:

        raise HTTPException(
            status_code=303,
            headers={"Location": "/"}
        )

    usuario = session.get(
        Usuario,
        int(usuario_id)
    )

    if not usuario:
        raise HTTPException(
            status_code=303,
            headers={"Location": "/"}
        )

    return usuario

@app.post("/usuarios")
def criar_usuario(
    nome: str = Form(...),
    email: str = Form(...),
    senha: str = Form(...),
    session: Session = Depends(get_session)
):

    usuario = UsuarioBase(
        nome=nome,
        email=email,
        senha=senha
    )

    crud.criar_usuario(session, usuario)

    return RedirectResponse(
        url="/",
        status_code=303
    )


@app.get("/usuarios")
def listar_usuarios(
    session: Session = Depends(get_session)
):
    return crud.listar_usuarios(session)


@app.put("/usuarios/{usuario_id}")
def atualizar_usuario(
    usuario_id: int,
    dados: UsuarioUpdate,
    session: Session = Depends(get_session)
):
    return crud.atualizar_usuario(session, usuario_id, dados)


@app.delete("/usuarios/{usuario_id}")
def deletar_usuario(
    usuario_id: int,
    session: Session = Depends(get_session)
):
    return crud.deletar_usuario(session, usuario_id)


@app.post("/login")
def login(
    email: str = Form(...),
    senha: str = Form(...),
    session: Session = Depends(get_session)
):

    usuario = session.exec(
        select(Usuario).where(
            Usuario.email == email
        )
    ).first()

    if not usuario:
        return {
            "erro": "Usuário não encontrado"
        }

    senha_correta = password_hash.verify(
        senha,
        usuario.senha
    )

    if not senha_correta:
        return {
            "erro": "Senha incorreta"
        }

    token = criar_token(usuario.id)

    resposta = RedirectResponse(
        url="/index",
        status_code=303
    )

    resposta.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="lax"
    )

    return resposta

@app.get("/logout")
def logout():

    resposta = RedirectResponse(
        url="/",
        status_code=303
    )

    resposta.delete_cookie(
        key="access_token"
    )

    return resposta
    

# =========================
# LIVROS
# ========================

@app.get("/pagina-livros")
def pagina_livros(
    request: Request,
    session: Session = Depends(get_session),
    usuario: Usuario = Depends(get_usuario_atual)
):

    livros = crud.listar_livros(session)

    return templates.TemplateResponse(
        request=request,
        name="livros.html",
        context={
            "request": request,
            "livros": livros
        }
    )

@app.post("/livros")
def criar_livro(
    titulo: str = Form(...),
    autor: str = Form(...),
    categoria: str = Form(...),
    capa: UploadFile = File(...),
    session: Session = Depends(get_session)
):

    caminho_imagem = None

    if capa:

        caminho_imagem = f"static/uploads/{capa.filename}"

        with open(caminho_imagem, "wb") as buffer:
            shutil.copyfileobj(capa.file, buffer)

    livro = Livro(
        titulo=titulo,
        autor=autor,
        categoria=categoria,
        capa=caminho_imagem
    )

    session.add(livro)

    session.commit()

    session.refresh(livro)

    return RedirectResponse(
        url="/pagina-livros",
        status_code=303
    )

@app.put("/livros/{livro_id}")
def atualizar_livro(
    livro_id: int,
    dados: LivroUpdate,
    session: Session = Depends(get_session)
):
    return crud.atualizar_livro(session, livro_id, dados)


@app.delete("/livros/{livro_id}")
def deletar_livro(
    livro_id: int,
    session: Session = Depends(get_session)
):
    return crud.deletar_livro(session, livro_id)
    
@app.get("/editar-livro/{livro_id}")
def editar_livro_tela(
    livro_id: int,
    request: Request,
    session: Session = Depends(get_session)
):

    livro = session.get(Livro, livro_id)

    return templates.TemplateResponse(
        request=request,
        name="editarLivro.html",
        context={
            "request": request,
            "livro": livro
        }
    )


@app.post("/editar-livro/{livro_id}")
def salvar_edicao_livro(
    livro_id: int,
    titulo: str = Form(...),
    autor: str = Form(...),
    categoria: str = Form(...),
    quantidade_disponivel: int = Form(...),
    session: Session = Depends(get_session)
):

    livro = session.get(Livro, livro_id)

    livro.titulo = titulo
    livro.autor = autor
    livro.categoria = categoria
    livro.quantidade_disponivel = quantidade_disponivel

    session.add(livro)
    session.commit()

    return RedirectResponse(
        url="/pagina-livros",
        status_code=303
    )


@app.post("/excluir-livro/{livro_id}")
def excluir_livro(
    livro_id: int,
    session: Session = Depends(get_session)
):

    crud.deletar_livro(session, livro_id)

    return RedirectResponse(
        url="/pagina-livros",
        status_code=303
    )

# =========================
# LOGIN
# =========================

@app.get("/")
def pagina_login(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="login.html",
        context={"request": request}
    )

# =========================
# CADASTRO
# =========================

@app.get("/cadastro")
def pagina_cadastro(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="cadastro.html",
        context={"request": request}
    )

# =========================
# CADASTRO DE LIVROS
# =========================

@app.get("/cadastro-livro")
def pagina_cadastro_livro(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="cadastroLivro.html",
        context={"request": request}
    )


# =========================
# EMPRESTIMOS
# =========================

@app.get("/pagina-emprestimos")
def pagina_emprestimos(
    request: Request,
    session: Session = Depends(get_session),
    usuario: Usuario = Depends(get_usuario_atual)
):

    emprestimos_db = crud.listar_emprestimos(session)

    emprestimos = []

    for emprestimo in emprestimos_db:

        leitor = session.get(Leitor, emprestimo.leitor_id)
        livro = session.get(Livro, emprestimo.livro_id)

        emprestimos.append({
            "id": emprestimo.id,
            "leitor": leitor.nome if leitor else "Leitor removido",
            "livro": livro.titulo if livro else "Livro removido",
            "data_emprestimo": emprestimo.data_emprestimo,
            "data_devolucao": emprestimo.data_devolucao,
            "atrasado": (
                emprestimo.data_devolucao is not None
                and date.today() > emprestimo.data_devolucao
            )
        })

    return templates.TemplateResponse(
        request=request,
        name="emprestimos.html",
        context={
            "request": request,
            "emprestimos": emprestimos
        }
    )

@app.post("/emprestimos")
def criar_emprestimo(
    emprestimo: EmprestimoBase,
    session: Session = Depends(get_session)
):
    return crud.criar_emprestimo(session, emprestimo)


@app.get("/emprestimos")
def listar_emprestimos(
    session: Session = Depends(get_session)
):
    return crud.listar_emprestimos(session)


@app.put("/emprestimos/{emprestimo_id}")
def atualizar_emprestimo(
    emprestimo_id: int,
    dados: EmprestimoUpdate,
    session: Session = Depends(get_session)
):
    return crud.atualizar_emprestimo(session, emprestimo_id, dados)


@app.delete("/emprestimos/{emprestimo_id}")
def devolver_livro(
    emprestimo_id: int,
    session: Session = Depends(get_session)
):
    return crud.devolver_livro(session, emprestimo_id)

@app.post("/excluir-emprestimo/{emprestimo_id}")
def excluir_emprestimo(
    emprestimo_id: int,
    session: Session = Depends(get_session)
):

    crud.devolver_livro(session, emprestimo_id)

    return RedirectResponse(
        url="/pagina-emprestimos",
        status_code=303
    )

# =========================
# CADASTRO DE EMPRÉSTIMO
# =========================

@app.get("/cadastro-emprestimo")
def tela_cadastro_emprestimo(
    request: Request,
    session: Session = Depends(get_session)
):

    leitores = crud.listar_leitores(session)
    livros = crud.listar_livros(session)

    return templates.TemplateResponse(
        request=request,
        name="cadastroemprestimo.html",
        context={
            "request": request,
            "leitores": leitores,
            "livros": livros
        }
    )

@app.post("/cadastro-emprestimo")
def cadastrar_emprestimo(
    request: Request,
    leitor_id: int = Form(...),
    livro_id: int = Form(...),
    session: Session = Depends(get_session)
):

    emprestimo = EmprestimoBase(
        leitor_id=leitor_id,
        livro_id=livro_id
    )

    resultado = crud.criar_emprestimo(session, emprestimo)

    if isinstance(resultado, dict):

        leitores = crud.listar_leitores(session)
        livros = crud.listar_livros(session)

        return templates.TemplateResponse(
            request=request,
            name="cadastroemprestimo.html",
            context={
                "request": request,
                "erro": resultado["mensagem"],
                "leitores": leitores,
                "livros": livros
            }
        )

    return RedirectResponse(
        url="/pagina-emprestimos",
        status_code=303
    )

@app.get("/editar-emprestimo/{emprestimo_id}")
def editar_emprestimo_tela(
    emprestimo_id: int,
    request: Request,
    session: Session = Depends(get_session)
):

    emprestimo = session.get(Emprestimo, emprestimo_id)

    leitores = crud.listar_leitores(session)

    livros = crud.listar_livros(session)

    return templates.TemplateResponse(
        request=request,
        name="editarEmprestimo.html",
        context={
            "request": request,
            "emprestimo": emprestimo,
            "leitores": leitores,
            "livros": livros
        }
    )

@app.post("/editar-emprestimo/{emprestimo_id}")
def salvar_edicao_emprestimo(
    emprestimo_id: int,
    leitor_id: int = Form(...),
    livro_id: int = Form(...),
    session: Session = Depends(get_session)
):

    emprestimo = session.get(Emprestimo, emprestimo_id)

    emprestimo.leitor_id = leitor_id
    emprestimo.livro_id = livro_id

    session.add(emprestimo)

    session.commit()

    return RedirectResponse(
        url="/pagina-emprestimos",
        status_code=303
    )

# =========================
# LEITORES
# =========================


@app.get("/pagina-leitores")
def pagina_leitores(
    request: Request,
    session: Session = Depends(get_session),
    usuario: Usuario = Depends(get_usuario_atual)
):

    leitores = crud.listar_leitores(session)

    return templates.TemplateResponse(
        request=request,
        name="leitores.html",
        context={
            "request": request,
            "leitores": leitores
        }
    )

@app.get("/cadastro-leitor")
def pagina_cadastro_leitor(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="cadastroLeitor.html",
        context={"request": request}
    )

@app.post("/leitores")
def criar_leitor(
    nome: str = Form(...),
    email: str = Form(...),
    session: Session = Depends(get_session)
):

    leitor = LeitorBase(
        nome=nome,
        email=email
    )

    crud.criar_leitor(session, leitor)

    return RedirectResponse(
        url="/pagina-leitores",
        status_code=303
    )

@app.put("/leitores/{leitor_id}")
def atualizar_leitor(
    leitor_id:int,
    dados:LeitorUpdate,
    session:Session = Depends(get_session)
):

    return crud.atualizar_leitor(
        session,
        leitor_id,
        dados
    )



@app.delete("/leitores/{leitor_id}")
def deletar_leitor(
    leitor_id:int,
    session:Session = Depends(get_session)
):

    return crud.deletar_leitor(
        session,
        leitor_id
    )

@app.get("/leitor/{leitor_id}/detalhes")
def detalhes_leitor(
    leitor_id:int,
    request:Request,
    session:Session = Depends(get_session)
):

    leitor = session.get(Leitor, leitor_id)


    emprestimos = session.exec(
        select(Emprestimo)
        .where(Emprestimo.leitor_id == leitor_id)
    ).all()


    lista = []


    for emprestimo in emprestimos:

        livro = session.get(
            Livro,
            emprestimo.livro_id
        )


        lista.append({

            "livro": livro.titulo if livro else "Livro removido",

            "data_emprestimo":
            emprestimo.data_emprestimo,

            "data_devolucao":
            emprestimo.data_devolucao,


            "status":
            (
                "Atrasado"
                if emprestimo.data_devolucao
                and date.today() > emprestimo.data_devolucao

                else "Em andamento"
            )

        })


    return templates.TemplateResponse(

        request=request,

        name="detalhesLeitor.html",

        context={

            "request":request,

            "leitor":leitor,

            "emprestimos":lista

        }

    )


#EDIÇÃO DE LEITORES

@app.get("/editar-leitor/{leitor_id}")
def editar_leitor_tela(
    leitor_id:int,
    request:Request,
    session:Session = Depends(get_session)
):

    leitor = session.get(Leitor, leitor_id)


    return templates.TemplateResponse(
        request=request,
        name="editarLeitor.html",
        context={
            "request":request,
            "leitor":leitor
        }
    )

@app.post("/editar-leitor/{leitor_id}")
def salvar_edicao_leitor(
    leitor_id:int,
    nome:str = Form(...),
    email:str = Form(...),
    session:Session = Depends(get_session)
):

    leitor = session.get(Leitor, leitor_id)


    leitor.nome = nome
    leitor.email = email


    session.add(leitor)

    session.commit()


    return RedirectResponse(
        url="/pagina-leitores",
        status_code=303
    )


@app.post("/excluir-leitor/{leitor_id}")
def excluir_leitor(
    leitor_id:int,
    session:Session = Depends(get_session)
):

    crud.deletar_leitor(session, leitor_id)


    return RedirectResponse(
        url="/pagina-leitores",
        status_code=303
    )