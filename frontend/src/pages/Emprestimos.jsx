import {
    useEffect,
    useState
} from "react"

import { Link } from "react-router-dom"

import {
    listarEmprestimos,
    devolverEmprestimo,
    excluirEmprestimo
} from "../services/emprestimoService"

import { API_URL } from "../services/api"

import "../styles/Emprestimos.css"


function Emprestimos() {

    const [emprestimos, setEmprestimos] =
        useState([])

    const [busca, setBusca] =
        useState("")

    const [status, setStatus] =
        useState("todos")

    const [ordem, setOrdem] =
        useState("recentes")

    const [carregando, setCarregando] =
        useState(true)

    const [erro, setErro] =
        useState("")

    const [
        emprestimoDevolver,
        setEmprestimoDevolver
    ] = useState(null)

    const [
        emprestimoExcluir,
        setEmprestimoExcluir
    ] = useState(null)

    const [processando, setProcessando] =
        useState(false)


    // ========================================
    // CARREGAR
    // ========================================

    useEffect(() => {

        carregarEmprestimos()

    }, [])


    async function carregarEmprestimos() {

        try {

            setErro("")

            const dados =
                await listarEmprestimos()

            setEmprestimos(dados)

        } catch (erro) {

            setErro(erro.message)

        } finally {

            setCarregando(false)
        }
    }


    // ========================================
    // DEVOLVER
    // ========================================

    async function confirmarDevolucao() {

        if (!emprestimoDevolver) {
            return
        }


        try {

            setProcessando(true)
            setErro("")

            await devolverEmprestimo(
                emprestimoDevolver.id
            )

            await carregarEmprestimos()

            setEmprestimoDevolver(null)

        } catch (erro) {

            setErro(erro.message)

            setEmprestimoDevolver(null)

        } finally {

            setProcessando(false)
        }
    }


    // ========================================
    // EXCLUIR
    // ========================================

    async function confirmarExclusao() {

        if (!emprestimoExcluir) {
            return
        }


        try {

            setProcessando(true)
            setErro("")

            await excluirEmprestimo(
                emprestimoExcluir.id
            )


            setEmprestimos(
                (anteriores) =>
                    anteriores.filter(
                        (emprestimo) =>
                            emprestimo.id !==
                            emprestimoExcluir.id
                    )
            )


            setEmprestimoExcluir(null)

        } catch (erro) {

            setErro(erro.message)

            setEmprestimoExcluir(null)

        } finally {

            setProcessando(false)
        }
    }


    // ========================================
    // FILTROS
    // ========================================

    const emprestimosFiltrados =
        emprestimos
            .filter((emprestimo) => {

                const termo = busca
                    .trim()
                    .toLowerCase()


                const correspondeBusca =
                    !termo ||
                    emprestimo.livro
                        ?.toLowerCase()
                        .includes(termo) ||
                    emprestimo.autor
                        ?.toLowerCase()
                        .includes(termo) ||
                    emprestimo.leitor
                        ?.toLowerCase()
                        .includes(termo)


                const correspondeStatus =
                    status === "todos" ||
                    emprestimo.status
                        ?.toLowerCase() ===
                        status


                return (
                    correspondeBusca &&
                    correspondeStatus
                )
            })
            .sort((a, b) => {

                if (ordem === "antigos") {

                    return new Date(
                        a.data_emprestimo
                    ) - new Date(
                        b.data_emprestimo
                    )
                }


                if (ordem === "devolucao") {

                    if (
                        !a.data_prevista_devolucao
                    ) {
                        return 1
                    }

                    if (
                        !b.data_prevista_devolucao
                    ) {
                        return -1
                    }


                    return new Date(
                        a.data_prevista_devolucao
                    ) - new Date(
                        b.data_prevista_devolucao
                    )
                }


                return new Date(
                    b.data_emprestimo
                ) - new Date(
                    a.data_emprestimo
                )
            })


    if (carregando) {

        return (
            <main className="emprestimos-page">

                <div className="emprestimos-estado">
                    Carregando empréstimos...
                </div>

            </main>
        )
    }


    return (
        <main className="emprestimos-page">

            {/* ==================================
                CABEÇALHO
            ================================== */}

            <section className="emprestimos-cabecalho">

                <div>

                    <span>
                        Empréstimos
                    </span>

                    <h1>
                        Empréstimos da biblioteca
                    </h1>

                    <p>
                        Acompanhe livros emprestados,
                        prazos e devoluções.
                    </p>

                </div>


                <Link
                    to="/emprestimos/novo"
                    className="btn-novo-emprestimo"
                >
                    Novo empréstimo

                    <span>
                        +
                    </span>
                </Link>

            </section>


            {/* ==================================
                FILTROS
            ================================== */}

            <section className="barra-emprestimos">

                <div className="busca-emprestimos">

                    <input
                        type="search"
                        placeholder={
                            "Buscar por livro, autor ou leitor..."
                        }
                        value={busca}
                        onChange={
                            (event) =>
                                setBusca(
                                    event.target.value
                                )
                        }
                    />

                    <span>
                        ⌕
                    </span>

                </div>


                <select
                    value={status}
                    onChange={
                        (event) =>
                            setStatus(
                                event.target.value
                            )
                    }
                >

                    <option value="todos">
                        Todos os status
                    </option>

                    <option value="ativo">
                        Ativos
                    </option>

                    <option value="atrasado">
                        Atrasados
                    </option>

                    <option value="devolvido">
                        Devolvidos
                    </option>

                </select>


                <select
                    value={ordem}
                    onChange={
                        (event) =>
                            setOrdem(
                                event.target.value
                            )
                    }
                >

                    <option value="recentes">
                        Mais recentes
                    </option>

                    <option value="antigos">
                        Mais antigos
                    </option>

                    <option value="devolucao">
                        Próximas devoluções
                    </option>

                </select>

            </section>


            {/* ==================================
                QUANTIDADE
            ================================== */}

            <div className="resultado-emprestimos">

                <strong>
                    {emprestimosFiltrados.length}
                </strong>

                {emprestimosFiltrados.length === 1
                    ? " empréstimo encontrado"
                    : " empréstimos encontrados"
                }

            </div>


            {/* ==================================
                ERRO
            ================================== */}

            {erro && (

                <div className="emprestimos-erro">
                    {erro}
                </div>

            )}


            {/* ==================================
                SEM RESULTADOS
            ================================== */}

            {!erro &&
                emprestimosFiltrados.length === 0 && (

                <section className="emprestimos-vazio">

                    <h2>
                        Nenhum empréstimo encontrado
                    </h2>

                    <p>
                        Não existem empréstimos
                        correspondentes aos filtros.
                    </p>

                </section>

            )}


            {/* ==================================
                LISTA
            ================================== */}

            <section className="lista-emprestimos">

                {emprestimosFiltrados.map(
                    (emprestimo) => (

                    <article
                        className="card-emprestimo"
                        key={emprestimo.id}
                    >

                        {/* LIVRO */}

                        <div className="emprestimo-livro">

                            <div className="emprestimo-capa">

                                {emprestimo.capa ? (

                                    <img
                                        src={
                                            `${API_URL}/static/${emprestimo.capa}`
                                        }
                                        alt={
                                            `Capa de ${emprestimo.livro}`
                                        }
                                    />

                                ) : (

                                    <span>
                                        📖
                                    </span>

                                )}

                            </div>


                            <div className="emprestimo-livro-info">

                                <span className="emprestimo-categoria">
                                    {
                                        emprestimo.categoria ||
                                        "Livro"
                                    }
                                </span>

                                <h2>
                                    {emprestimo.livro}
                                </h2>

                                <p>
                                    {emprestimo.autor}
                                </p>

                            </div>

                        </div>


                        {/* LEITOR */}

                        <div className="emprestimo-coluna">

                            <span className="emprestimo-rotulo">
                                Leitor
                            </span>

                            <strong>
                                {emprestimo.leitor}
                            </strong>

                        </div>


                        {/* EMPRÉSTIMO */}

                        <div className="emprestimo-coluna">

                            <span className="emprestimo-rotulo">
                                Empréstimo
                            </span>

                            <strong>
                                {formatarData(
                                    emprestimo.data_emprestimo
                                )}
                            </strong>

                        </div>


                        {/* DEVOLUÇÃO */}

                        <div className="emprestimo-coluna">

                            <span className="emprestimo-rotulo">
                                {emprestimo.status ===
                                "Devolvido"
                                    ? "Devolvido em"
                                    : "Devolução prevista"
                                }
                            </span>

                            <strong>
                                {formatarData(
                                    emprestimo.status ===
                                    "Devolvido"
                                        ? emprestimo.data_devolucao
                                        : emprestimo.data_prevista_devolucao
                                )}
                            </strong>

                        </div>


                        {/* STATUS */}

                        <div className="emprestimo-status-area">

                            <span
                                className={
                                    `emprestimo-status status-${normalizarStatus(
                                        emprestimo.status
                                    )}`
                                }
                            >
                                <span
                                    className="emprestimo-status-bolinha"
                                />

                                {emprestimo.status}
                            </span>

                        </div>


                        {/* AÇÕES */}

                        <div className="emprestimo-acoes">

                            {emprestimo.status !==
                            "Devolvido" && (

                                <button
                                    type="button"
                                    className="btn-devolver-emprestimo"
                                    onClick={
                                        () =>
                                            setEmprestimoDevolver(
                                                emprestimo
                                            )
                                    }
                                >
                                    Devolver
                                </button>

                            )}


                            {emprestimo.status !==
                            "Devolvido" && (

                                <Link
                                    to={
                                        `/emprestimos/${emprestimo.id}/editar`
                                    }
                                    className="btn-editar-emprestimo"
                                >
                                    Editar
                                </Link>

                            )}


                            <button
                                type="button"
                                className="btn-excluir-emprestimo"
                                onClick={
                                    () =>
                                        setEmprestimoExcluir(
                                            emprestimo
                                        )
                                }
                                title="Excluir empréstimo"
                            >
                                ×
                            </button>

                        </div>

                    </article>

                    )
                )}

            </section>


            {/* ==================================
                MODAL DEVOLUÇÃO
            ================================== */}

            {emprestimoDevolver && (

                <div className="modal-emprestimo-fundo">

                    <div className="modal-emprestimo">

                        <div className="modal-emprestimo-icone">
                            ✓
                        </div>

                        <h2>
                            Registrar devolução?
                        </h2>

                        <p>
                            Deseja registrar a devolução de

                            <strong>
                                {" "}
                                {emprestimoDevolver.livro}
                            </strong>

                            {" "}por{" "}

                            <strong>
                                {emprestimoDevolver.leitor}
                            </strong>?
                        </p>


                        <div className="modal-emprestimo-acoes">

                            <button
                                type="button"
                                className="modal-emprestimo-cancelar"
                                onClick={
                                    () =>
                                        setEmprestimoDevolver(
                                            null
                                        )
                                }
                                disabled={processando}
                            >
                                Cancelar
                            </button>


                            <button
                                type="button"
                                className="modal-emprestimo-confirmar"
                                onClick={confirmarDevolucao}
                                disabled={processando}
                            >
                                {processando
                                    ? "Registrando..."
                                    : "Confirmar devolução"
                                }
                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* ==================================
                MODAL EXCLUSÃO
            ================================== */}

            {emprestimoExcluir && (

                <div className="modal-emprestimo-fundo">

                    <div className="modal-emprestimo">

                        <div className="modal-emprestimo-icone perigo">
                            !
                        </div>

                        <h2>
                            Excluir empréstimo?
                        </h2>

                        <p>
                            Você está prestes a excluir
                            permanentemente o registro de

                            <strong>
                                {" "}
                                {emprestimoExcluir.livro}
                            </strong>.

                            Essa ação não poderá ser
                            desfeita.
                        </p>


                        <div className="modal-emprestimo-acoes">

                            <button
                                type="button"
                                className="modal-emprestimo-cancelar"
                                onClick={
                                    () =>
                                        setEmprestimoExcluir(
                                            null
                                        )
                                }
                                disabled={processando}
                            >
                                Cancelar
                            </button>


                            <button
                                type="button"
                                className="modal-emprestimo-excluir"
                                onClick={confirmarExclusao}
                                disabled={processando}
                            >
                                {processando
                                    ? "Excluindo..."
                                    : "Sim, excluir"
                                }
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </main>
    )
}


// ========================================
// FORMATAR DATA
// ========================================

function formatarData(data) {

    if (!data) {
        return "—"
    }

    const [
        ano,
        mes,
        dia
    ] = data.split("-")


    return `${dia}/${mes}/${ano}`
}


// ========================================
// NORMALIZAR STATUS
// ========================================

function normalizarStatus(status) {

    if (!status) {
        return "ativo"
    }

    return status
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
}


export default Emprestimos