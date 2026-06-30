from sqlmodel import select
from models import Usuario, Livro, Emprestimo, Leitor


# =========================
# USUARIOS
# =========================

def criar_usuario(session, usuario):

    novo_usuario = Usuario(
        nome=usuario.nome,
        email=usuario.email,
        senha=usuario.senha
    )

    session.add(novo_usuario)

    session.commit()

    session.refresh(novo_usuario)

    return novo_usuario


def listar_usuarios(session):

    usuarios = session.exec(select(Usuario)).all()

    return usuarios


def atualizar_usuario(session, usuario_id, dados):

    usuario = session.get(Usuario, usuario_id)

    if not usuario:
        return {"mensagem": "Usuário não encontrado"}

    for chave, valor in dados.dict().items():
        setattr(usuario, chave, valor)

    session.add(usuario)

    session.commit()

    session.refresh(usuario)

    return usuario


def deletar_usuario(session, usuario_id):

    usuario = session.get(Usuario, usuario_id)

    if not usuario:
        return {"mensagem": "Usuário não encontrado"}

    session.delete(usuario)

    session.commit()

    return {"mensagem": "Usuário deletado"}


# =========================
# LIVROS
# =========================

def criar_livro(session, livro):

    novo_livro = Livro(
        titulo=livro.titulo,
        autor=livro.autor,
        categoria=livro.categoria
    )

    session.add(novo_livro)

    session.commit()

    session.refresh(novo_livro)

    return novo_livro


def listar_livros(session):

    livros = session.exec(select(Livro)).all()

    return livros


def atualizar_livro(session, livro_id, dados):

    livro = session.get(Livro, livro_id)

    if not livro:
        return {"mensagem": "Livro não encontrado"}

    for chave, valor in dados.dict().items():
        setattr(livro, chave, valor)

    session.add(livro)

    session.commit()

    session.refresh(livro)

    return livro


def deletar_livro(session, livro_id):

    livro = session.get(Livro, livro_id)

    if not livro:
        return {"mensagem": "Livro não encontrado"}

    session.delete(livro)

    session.commit()

    return {"mensagem": "Livro deletado"}


# =========================
# EMPRESTIMOS
# =========================

def criar_emprestimo(session, emprestimo):

    livro = session.get(Livro, emprestimo.livro_id)

    if not livro:
        return {"mensagem": "Livro não encontrado"}

    if livro.disponivel == False:
        return {"mensagem": "Livro indisponível"}

    novo_emprestimo = Emprestimo(
        leitor_id=emprestimo.leitor_id,
        livro_id=emprestimo.livro_id
    )

    livro.disponivel = False

    session.add(novo_emprestimo)

    session.add(livro)

    session.commit()

    session.refresh(novo_emprestimo)

    return novo_emprestimo

def atualizar_emprestimo(session, emprestimo_id, dados):

    emprestimo = session.get(Emprestimo, emprestimo_id)

    if not emprestimo:
        return {"mensagem": "Empréstimo não encontrado"}

    for chave, valor in dados.dict().items():
        setattr(emprestimo, chave, valor)

    session.add(emprestimo)

    session.commit()

    session.refresh(emprestimo)

    return emprestimo
    
def listar_emprestimos(session):

    emprestimos = session.exec(select(Emprestimo)).all()

    return emprestimos


def devolver_livro(session, emprestimo_id):

    emprestimo = session.get(Emprestimo, emprestimo_id)

    if not emprestimo:
        return {"mensagem": "Empréstimo não encontrado"}

    livro = session.get(Livro, emprestimo.livro_id)

    livro.disponivel = True

    session.add(livro)

    session.delete(emprestimo)

    session.commit()

    return {"mensagem": "Livro devolvido"}



# =========================
# LEITORES
# =========================




def criar_leitor(session, leitor):

    novo_leitor = Leitor(
        nome=leitor.nome,
        email=leitor.email
    )

    session.add(novo_leitor)

    session.commit()

    session.refresh(novo_leitor)

    return novo_leitor

def listar_leitores(session):

    leitores = session.exec(select(Leitor)).all()

    return leitores

def atualizar_leitor(session, leitor_id, dados):

    leitor = session.get(Leitor, leitor_id)

    if not leitor:
        return {"mensagem": "Leitor não encontrado"}

    for chave, valor in dados.dict().items():
        setattr(leitor, chave, valor)

    session.add(leitor)

    session.commit()

    session.refresh(leitor)

    return leitor



def deletar_leitor(session, leitor_id):

    leitor = session.get(Leitor, leitor_id)

    if not leitor:
        return {"mensagem": "Leitor não encontrado"}

    session.delete(leitor)

    session.commit()

    return {"mensagem": "Leitor deletado"}