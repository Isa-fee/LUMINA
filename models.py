from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import date

# =====================
# USUARIOS
# =====================

class UsuarioBase(SQLModel):
    nome: str
    email: str
    senha: str


class Usuario(UsuarioBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)


class UsuarioUpdate(SQLModel):
    nome: str
    email: str


# =====================
# LIVROS
# =====================

class LivroBase(SQLModel):
    titulo: str
    autor: str
    categoria: str


class Livro(LivroBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    disponivel: bool = True
    capa: Optional[str] = None


class LivroUpdate(SQLModel):
    titulo: str
    autor: str
    categoria: str


# =====================
# EMPRESTIMOS
# =====================

class EmprestimoBase(SQLModel):
    leitor_id: int
    livro_id: int


class Emprestimo(EmprestimoBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    data_emprestimo: date = Field(default_factory=date.today)
    data_devolucao: Optional[date] = Field(default=None)


class EmprestimoUpdate(SQLModel):
    leitor_id: Optional[int] = None
    livro_id: Optional[int] = None
    data_devolucao: Optional[date] = None

# =====================
# LEITORES
# =====================

class LeitorBase(SQLModel):
    nome: str
    email: str


class Leitor(LeitorBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)


class LeitorUpdate(SQLModel):
    nome: str
    email: str