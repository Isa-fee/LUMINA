from datetime import date, timedelta

from sqlmodel import Session

from models import Emprestimo

from repositories import (
    emprestimo_repository,
    livro_repository,
    leitor_repository
)

def listar_emprestimos(
    session: Session
):
    emprestimos = (
        emprestimo_repository.listar(
            session
        )
    )
    resultado = []
    hoje = date.today()

    for emprestimo in emprestimos:
        livro = livro_repository.buscar_por_id(
            session,
            emprestimo.livro_id
        )
        leitor = leitor_repository.buscar_por_id(
            session,
            emprestimo.leitor_id
        )
        # =====================================
        # STATUS
        # =====================================
        if emprestimo.data_devolucao is not None:
            status = "Devolvido"
        elif (
            emprestimo.data_prevista_devolucao
            and
            hoje > emprestimo.data_prevista_devolucao
        ):
            status = "Atrasado"
        else:
            status = "Ativo"
        # =====================================
        # RESULTADO
        # =====================================
        resultado.append({
            "id": emprestimo.id,
            "livro_id": emprestimo.livro_id,
            "livro": (
                livro.titulo
                if livro
                else "Livro não encontrado"
            ),
            "autor": (
                livro.autor
                if livro
                else ""
            ),
            "categoria": (
                livro.categoria
                if livro
                else ""
            ),
            "capa": (
                livro.capa
                if livro
                else None
            ),
            "leitor_id": emprestimo.leitor_id,
            "leitor": (
                leitor.nome
                if leitor
                else "Leitor não encontrado"
            ),
            "data_emprestimo":
                emprestimo.data_emprestimo,
            "data_prevista_devolucao":
                emprestimo.data_prevista_devolucao,
            "data_devolucao":
                emprestimo.data_devolucao,
            "status": status
        })


    return resultado

def buscar_emprestimo(
    session: Session,
    emprestimo_id: int
):

    return emprestimo_repository.buscar_por_id(
        session,
        emprestimo_id
    )

def criar_emprestimo(
    session: Session,
    leitor_id: int,
    livro_id: int
):

    leitor = leitor_repository.buscar_por_id(
        session,
        leitor_id
    )

    if not leitor:
        raise ValueError(
            "Leitor não encontrado."
        )

    livro = livro_repository.buscar_por_id(
        session,
        livro_id
    )

    if not livro:
        raise ValueError(
            "Livro não encontrado."
        )

    if livro.quantidade_disponivel <= 0:
        raise ValueError(
            "Livro indisponível."
        )

    livro.quantidade_disponivel -= 1

    novo_emprestimo = Emprestimo(
        leitor_id=leitor_id,
        livro_id=livro_id
    )

    novo_emprestimo.data_prevista_devolucao = (
        novo_emprestimo.data_emprestimo
        + timedelta(days=5)
    )

    novo_emprestimo.data_devolucao = None

    livro_repository.salvar(
        session,
        livro
    )

    return emprestimo_repository.salvar(
        session,
        novo_emprestimo
    )

def devolver_livro(
    session: Session,
    emprestimo_id: int
):

    emprestimo = (
        emprestimo_repository.buscar_por_id(
            session,
            emprestimo_id
        )
    )

    if not emprestimo:
        raise ValueError(
            "Empréstimo não encontrado."
        )

    if emprestimo.data_devolucao is not None:
        raise ValueError(
            "Este empréstimo já foi devolvido."
        )

    livro = livro_repository.buscar_por_id(
        session,
        emprestimo.livro_id
    )

    if livro:
        livro.quantidade_disponivel += 1
        livro_repository.salvar(
            session,
            livro
        )

    emprestimo.data_devolucao = date.today()

    return emprestimo_repository.salvar(
        session,
        emprestimo
    )

def excluir_emprestimo(
    session: Session,
    emprestimo_id: int
):
    emprestimo = (
        emprestimo_repository.buscar_por_id(
            session,
            emprestimo_id
        )
    )
    if not emprestimo:
        raise ValueError(
            "Empréstimo não encontrado."
        )
    # Se o empréstimo ainda estiver ativo,
    # o exemplar precisa voltar ao estoque.
    if emprestimo.data_devolucao is None:
        livro = livro_repository.buscar_por_id(
            session,
            emprestimo.livro_id
        )
        if livro:
            livro.quantidade_disponivel += 1
            livro_repository.salvar(
                session,
                livro
            )

    emprestimo_repository.deletar(
        session,
        emprestimo
    )

def atualizar_emprestimo(
    session: Session,
    emprestimo_id: int,
    leitor_id: int,
    livro_id: int
):

    emprestimo = (
        emprestimo_repository.buscar_por_id(
            session,
            emprestimo_id
        )
    )

    if not emprestimo:
        raise ValueError(
            "Empréstimo não encontrado."
        )

    leitor = leitor_repository.buscar_por_id(
        session,
        leitor_id
    )

    if not leitor:
        raise ValueError(
            "Leitor não encontrado."
        )

    # Só precisamos mexer no estoque
    # caso o livro tenha sido alterado.
    if emprestimo.livro_id != livro_id:

        livro_antigo = livro_repository.buscar_por_id(
            session,
            emprestimo.livro_id
        )

        livro_novo = livro_repository.buscar_por_id(
            session,
            livro_id
        )

        if not livro_novo:
            raise ValueError(
                "Livro não encontrado."
            )

        if livro_novo.quantidade_disponivel <= 0:
            raise ValueError(
                "Livro indisponível."
            )

        # Devolve o exemplar do livro anterior
        if livro_antigo:

            livro_antigo.quantidade_disponivel += 1

            livro_repository.salvar(
                session,
                livro_antigo
            )

        # Retira um exemplar do livro novo
        livro_novo.quantidade_disponivel -= 1

        livro_repository.salvar(
            session,
            livro_novo
        )

        emprestimo.livro_id = livro_id

    emprestimo.leitor_id = leitor_id

    return emprestimo_repository.salvar(
        session,
        emprestimo
    )