from fastapi import FastAPI, Depends
from contextlib import asynccontextmanager
from sqlmodel import SQLModel, Session

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
    EmprestimoUpdate
)


@asynccontextmanager
async def lifespan(app: FastAPI):

    SQLModel.metadata.create_all(engine)

    yield


app = FastAPI(lifespan=lifespan)

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
# =========================

@app.post("/livros")
def criar_livro(
    livro: LivroBase,
    session: Session = Depends(get_session)
):
    return crud.criar_livro(session, livro)


@app.get("/livros")
def listar_livros(
    session: Session = Depends(get_session)
):
    return crud.listar_livros(session)


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
# EMPRESTIMOS
# =========================

# =========================
# EMPRESTIMOS
# =========================

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