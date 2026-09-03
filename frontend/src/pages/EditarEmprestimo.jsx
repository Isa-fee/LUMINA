import {
    useEffect,
    useState
} from "react"

import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom"

import {
    buscarEmprestimo,
    atualizarEmprestimo
} from "../services/emprestimoService"

import {
    listarLeitores
} from "../services/leitorService"

import {
    listarLivros
} from "../services/livroService"

import { API_URL } from "../services/api"

import "../styles/EditarEmprestimo.css"


function EditarEmprestimo() {

    const { id } = useParams()
    const navigate = useNavigate()


    const [emprestimo, setEmprestimo] =
        useState(null)

    const [leitores, setLeitores] =
        useState([])

    const [livros, setLivros] =
        useState([])


    const [leitorId, setLeitorId] =
        useState("")

    const [livroId, setLivroId] =
        useState("")


    const [buscaLeitor, setBuscaLeitor] =
        useState("")

    const [buscaLivro, setBuscaLivro] =
        useState("")


    const [carregando, setCarregando] =
        useState(true)

    const [salvando, setSalvando] =
        useState(false)

    const [erro, setErro] =
        useState("")


    // ========================================
    // CARREGAR DADOS
    // ========================================

    useEffect(() => {

        async function carregarDados() {

            try {

                setCarregando(true)
                setErro("")


                const [
                    dadosEmprestimo,
                    dadosLeitores,
                    dadosLivros
                ] = await Promise.all([

                    buscarEmprestimo(id),

                    listarLeitores(),

                    listarLivros()

                ])


                setEmprestimo(
                    dadosEmprestimo
                )

                setLeitores(
                    dadosLeitores
                )

                setLivros(
                    dadosLivros
                )


                setLeitorId(
                    String(
                        dadosEmprestimo.leitor_id
                    )
                )

                setLivroId(
                    String(
                        dadosEmprestimo.livro_id
                    )
                )


            } catch (erro) {

                setErro(
                    erro.message
                )

            } finally {

                setCarregando(false)

            }
        }


        carregarDados()

    }, [id])


    // ========================================
    // LEITOR SELECIONADO
    // ========================================

    const leitorSelecionado =
        leitores.find(
            (leitor) =>
                String(leitor.id) ===
                String(leitorId)
        )


    // ========================================
    // LIVRO SELECIONADO
    // ========================================

    const livroSelecionado =
        livros.find(
            (livro) =>
                String(livro.id) ===
                String(livroId)
        )


    // ========================================
    // FILTRAR LEITORES
    // ========================================

    const leitoresFiltrados =
        leitores.filter(
            (leitor) => {

                const termo =
                    buscaLeitor
                        .trim()
                        .toLowerCase()


                if (!termo) {
                    return true
                }


                return (
                    leitor.nome
                        ?.toLowerCase()
                        .includes(termo)
                    ||
                    leitor.email
                        ?.toLowerCase()
                        .includes(termo)
                )
            }
        )


    // ========================================
    // FILTRAR LIVROS
    // ========================================

    const livrosFiltrados =
        livros.filter(
            (livro) => {

                const termo =
                    buscaLivro
                        .trim()
                        .toLowerCase()


                if (!termo) {
                    return true
                }


                return (
                    livro.titulo
                        ?.toLowerCase()
                        .includes(termo)
                    ||
                    livro.autor
                        ?.toLowerCase()
                        .includes(termo)
                )
            }
        )


    // ========================================
    // SALVAR
    // ========================================

    async function salvarAlteracoes(
        event
    ) {

        event.preventDefault()


        if (!leitorId) {

            setErro(
                "Selecione um leitor."
            )

            return
        }


        if (!livroId) {

            setErro(
                "Selecione um livro."
            )

            return
        }


        try {

            setSalvando(true)
            setErro("")


            await atualizarEmprestimo(
                id,
                {
                    leitor_id:
                        leitorId,

                    livro_id:
                        livroId
                }
            )


            navigate(
                "/emprestimos"
            )


        } catch (erro) {

            setErro(
                erro.message
            )

        } finally {

            setSalvando(false)

        }
    }


    // ========================================
    // CARREGANDO
    // ========================================

    if (carregando) {

        return (

            <main className="editar-emprestimo-page">

                <div className="editar-emprestimo-estado">

                    Carregando empréstimo...

                </div>

            </main>
        )
    }


    // ========================================
    // ERRO SEM EMPRÉSTIMO
    // ========================================

    if (
        erro &&
        !emprestimo
    ) {

        return (

            <main className="editar-emprestimo-page">

                <div className="editar-emprestimo-erro">

                    {erro}

                </div>


                <Link
                    to="/emprestimos"
                    className="editar-emprestimo-voltar"
                >

                    ← Voltar para empréstimos

                </Link>

            </main>
        )
    }


    if (!emprestimo) {
        return null
    }


    // ========================================
    // EMPRÉSTIMO DEVOLVIDO
    // ========================================

    const devolvido =
        emprestimo.data_devolucao !== null


    return (

        <main className="editar-emprestimo-page">


            {/* =================================
                CABEÇALHO
            ================================= */}

            <section className="editar-emprestimo-cabecalho">

                <span>
                    Empréstimos
                </span>

                <h1>
                    Editar empréstimo
                </h1>

                <p>
                    Altere o leitor ou o livro
                    associado ao empréstimo.
                </p>

            </section>


            {/* =================================
                VOLTAR
            ================================= */}

            <Link
                to="/emprestimos"
                className="editar-emprestimo-voltar"
            >

                <span>
                    ←
                </span>

                Voltar para empréstimos

            </Link>


            {/* =================================
                DEVOLVIDO
            ================================= */}

            {devolvido && (

                <div className="editar-emprestimo-aviso">

                    <strong>
                        Empréstimo finalizado
                    </strong>

                    <p>
                        Este livro já foi devolvido.
                        Por isso, o empréstimo não
                        pode mais ser alterado.
                    </p>

                </div>

            )}


            {/* =================================
                ERRO
            ================================= */}

            {erro && emprestimo && (

                <div className="editar-emprestimo-erro">

                    {erro}

                </div>

            )}


            {/* =================================
                FORMULÁRIO
            ================================= */}

            <form
                className="editar-emprestimo-form"
                onSubmit={salvarAlteracoes}
            >


                {/* =============================
                    LEITOR
                ============================= */}

                <section className="editar-emprestimo-bloco">

                    <div className="editar-bloco-cabecalho">

                        <span className="editar-numero">
                            1
                        </span>

                        <div>

                            <h2>
                                Leitor
                            </h2>

                            <p>
                                Escolha o leitor
                                responsável pelo
                                empréstimo.
                            </p>

                        </div>

                    </div>


                    <div className="editar-busca">

                        <input
                            type="search"
                            placeholder="Buscar leitor por nome ou e-mail..."
                            value={buscaLeitor}
                            onChange={
                                (event) =>
                                    setBuscaLeitor(
                                        event.target.value
                                    )
                            }
                            disabled={devolvido}
                        />

                        <span>
                            ⌕
                        </span>

                    </div>


                    <div className="editar-lista-opcoes">

                        {leitoresFiltrados.map(
                            (leitor) => (

                            <button
                                type="button"
                                key={leitor.id}
                                className={
                                    String(leitorId) ===
                                    String(leitor.id)

                                        ? "editar-opcao editar-opcao-selecionada"

                                        : "editar-opcao"
                                }
                                onClick={() =>
                                    setLeitorId(
                                        String(
                                            leitor.id
                                        )
                                    )
                                }
                                disabled={devolvido}
                            >

                                <div className="editar-leitor-avatar">

                                    {leitor.foto ? (

                                        <img
                                            src={
                                                `${API_URL}/static/${leitor.foto}`
                                            }
                                            alt=""
                                        />

                                    ) : (

                                        <span>
                                            {
                                                obterInicial(
                                                    leitor.nome
                                                )
                                            }
                                        </span>

                                    )}

                                </div>


                                <div className="editar-opcao-info">

                                    <strong>
                                        {leitor.nome}
                                    </strong>

                                    <span>
                                        {leitor.email}
                                    </span>

                                </div>


                                <div className="editar-radio">

                                    {String(leitorId) ===
                                    String(leitor.id)
                                        ? "✓"
                                        : ""
                                    }

                                </div>

                            </button>

                            )
                        )}

                    </div>


                    {leitorSelecionado && (

                        <div className="editar-selecionado">

                            <span>
                                Leitor selecionado
                            </span>

                            <strong>
                                {
                                    leitorSelecionado.nome
                                }
                            </strong>

                        </div>

                    )}

                </section>


                {/* =============================
                    LIVRO
                ============================= */}

                <section className="editar-emprestimo-bloco">

                    <div className="editar-bloco-cabecalho">

                        <span className="editar-numero">
                            2
                        </span>

                        <div>

                            <h2>
                                Livro
                            </h2>

                            <p>
                                Selecione a obra
                                vinculada ao empréstimo.
                            </p>

                        </div>

                    </div>


                    <div className="editar-busca">

                        <input
                            type="search"
                            placeholder="Buscar livro por título ou autor..."
                            value={buscaLivro}
                            onChange={
                                (event) =>
                                    setBuscaLivro(
                                        event.target.value
                                    )
                            }
                            disabled={devolvido}
                        />

                        <span>
                            ⌕
                        </span>

                    </div>


                    <div className="editar-lista-opcoes">

                        {livrosFiltrados.map(
                            (livro) => {

                            const livroAtual =
                                String(
                                    emprestimo.livro_id
                                ) ===
                                String(
                                    livro.id
                                )


                            /*
                             * O livro atual pode aparecer
                             * mesmo que quantidade_disponivel
                             * seja 0, pois este empréstimo
                             * já ocupa um exemplar dele.
                             */

                            const disponivel =
                                livroAtual ||
                                livro.quantidade_disponivel > 0


                            return (

                                <button
                                    type="button"
                                    key={livro.id}
                                    className={
                                        String(livroId) ===
                                        String(livro.id)

                                            ? "editar-opcao editar-opcao-selecionada"

                                            : "editar-opcao"
                                    }
                                    onClick={() => {

                                        if (
                                            disponivel &&
                                            !devolvido
                                        ) {

                                            setLivroId(
                                                String(
                                                    livro.id
                                                )
                                            )
                                        }
                                    }}
                                    disabled={
                                        !disponivel ||
                                        devolvido
                                    }
                                >


                                    <div className="editar-livro-capa">

                                        {livro.capa ? (

                                            <img
                                                src={
                                                    `${API_URL}/static/${livro.capa}`
                                                }
                                                alt=""
                                            />

                                        ) : (

                                            <span>
                                                📖
                                            </span>

                                        )}

                                    </div>


                                    <div className="editar-opcao-info">

                                        <strong>
                                            {livro.titulo}
                                        </strong>

                                        <span>
                                            {livro.autor}
                                        </span>


                                        <small>

                                            {livroAtual

                                                ? "Livro atual"

                                                : disponivel

                                                    ? `${livro.quantidade_disponivel} disponível`

                                                    : "Indisponível"
                                            }

                                        </small>

                                    </div>


                                    <div className="editar-radio">

                                        {String(livroId) ===
                                        String(livro.id)

                                            ? "✓"
                                            : ""
                                        }

                                    </div>

                                </button>

                            )
                        })}

                    </div>


                    {livroSelecionado && (

                        <div className="editar-selecionado">

                            <span>
                                Livro selecionado
                            </span>

                            <strong>
                                {
                                    livroSelecionado.titulo
                                }
                            </strong>

                        </div>

                    )}

                </section>


                {/* =============================
                    RESUMO
                ============================= */}

                <section className="editar-emprestimo-resumo">

                    <span className="editar-resumo-rotulo">
                        Resumo do empréstimo
                    </span>


                    <div className="editar-resumo-grid">

                        <div>

                            <span>
                                Leitor
                            </span>

                            <strong>
                                {
                                    leitorSelecionado
                                        ?.nome ||
                                    "Não selecionado"
                                }
                            </strong>

                        </div>


                        <div>

                            <span>
                                Livro
                            </span>

                            <strong>
                                {
                                    livroSelecionado
                                        ?.titulo ||
                                    "Não selecionado"
                                }
                            </strong>

                        </div>


                        <div>

                            <span>
                                Empréstimo realizado em
                            </span>

                            <strong>
                                {
                                    formatarData(
                                        emprestimo
                                            .data_emprestimo
                                    )
                                }
                            </strong>

                        </div>


                        <div>

                            <span>
                                Devolução prevista
                            </span>

                            <strong>
                                {
                                    formatarData(
                                        emprestimo
                                            .data_prevista_devolucao
                                    )
                                }
                            </strong>

                        </div>

                    </div>

                </section>


                {/* =============================
                    BOTÕES
                ============================= */}

                <div className="editar-emprestimo-acoes">

                    <Link
                        to="/emprestimos"
                        className="editar-btn-cancelar"
                    >
                        Cancelar
                    </Link>


                    {!devolvido && (

                        <button
                            type="submit"
                            className="editar-btn-salvar"
                            disabled={salvando}
                        >

                            {salvando
                                ? "Salvando..."
                                : "Salvar alterações"
                            }

                        </button>

                    )}

                </div>

            </form>

        </main>
    )
}


// ========================================
// INICIAL
// ========================================

function obterInicial(nome) {

    if (!nome) {
        return "L"
    }

    return nome
        .trim()
        .charAt(0)
        .toUpperCase()
}


// ========================================
// FORMATAR DATA
// ========================================

function formatarData(data) {

    if (!data) {
        return "—"
    }

    const partes =
        data.split("-")

    if (partes.length !== 3) {
        return data
    }

    return (
        `${partes[2]}/${partes[1]}/${partes[0]}`
    )
}


export default EditarEmprestimo