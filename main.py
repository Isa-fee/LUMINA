from fastapi import FastAPI, Depends, Request, Form, UploadFile, File
import shutil
import os

from contextlib import asynccontextmanager
from sqlmodel import SQLModel, Session
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse


from database import engine, get_session

import crud

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

@app.get("/index")
def home(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={"request": request}
    )

# =========================
# USUARIOS
# =========================

@app.post("/usuarios")
def criar_usuario(
    usuario: UsuarioBase,
    session: Session = Depends(get_session)
):
    return crud.criar_usuario(session, usuario)


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


# =========================
# LIVROS
# ========================

@app.get("/pagina-livros")
def pagina_livros(
    request: Request,
    session: Session = Depends(get_session)
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
def pagina_emprestimos(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="emprestimos.html",
        context={"request": request}
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

# =========================
# CADASTRO DE EMPRÉSTIMO
# =========================

@app.get("/cadastro-emprestimo")
def tela_cadastro_emprestimo(request: Request):
    return templates.TemplateResponse(
        "cadastroemprestimo.html",
        {
            "request": request
        }
    )


@app.post("/cadastro-emprestimo")
def cadastrar_emprestimo(
    leitor_id: int = Form(...),
    livro_id: int = Form(...),
    session: Session = Depends(get_session)
):

    novo_emprestimo = EmprestimoBase(
        leitor_id=leitor_id,
        livro_id=livro_id
    )

    crud.criar_emprestimo(session, novo_emprestimo)

    return RedirectResponse(
        "/pagina-emprestimos",
        status_code=303
    )



# =========================
# LEITORES
# =========================


@app.get("/pagina-leitores")
def pagina_leitores(
    request: Request,
    session: Session = Depends(get_session)
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