import {
    useEffect,
    useMemo,
    useState
} from "react"

import {
    Link,
    useNavigate
} from "react-router-dom"

import {
    listarLeitores
} from "../services/leitorService"

import {
    listarLivros
} from "../services/livroService"

import {
    cadastrarEmprestimo
} from "../services/emprestimoService"

import { API_URL } from "../services/api"

import "../styles/NovoEmprestimo.css"


function NovoEmprestimo() {

    const navigate = useNavigate()


    // ========================================
    // DADOS
    // ========================================

    const [leitores, setLeitores] =
        useState([])

    const [livros, setLivros] =
        useState([])


    // ========================================
    // SELEÇÕES
    // ========================================

    const [leitorSelecionado, setLeitorSelecionado] =
        useState(null)

    const [livroSelecionado, setLivroSelecionado] =
        useState(null)


    // ========================================
    // BUSCAS
    // ========================================

    const [buscaLeitor, setBuscaLeitor] =
        useState("")

    const [buscaLivro, setBuscaLivro] =
        useState("")


    // ========================================
    // ESTADOS
    // ========================================

    const [carregando, setCarregando] =
        useState(true)

    const [salvando, setSalvando] =
        useState(false)

    const [erro, setErro] =
        useState("")


    // ========================================
    // CARREGAR LEITORES E LIVROS
    // ========================================

    useEffect(() => {

        async function carregarDados() {

            try {

                setCarregando(true)
                setErro("")

                const [
                    dadosLeitores,
                    dadosLivros
                ] = await Promise.all([
                    listarLeitores(),
                    listarLivros()
                ])

                setLeitores(
                    dadosLeitores
                )

                setLivros(
                    dadosLivros
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

    }, [])


    // ========================================
    // FILTRAR LEITORES
    // ========================================

    const leitoresFiltrados =
        useMemo(() => {

            const termo =
                buscaLeitor
                    .trim()
                    .toLowerCase()

            if (!termo) {

                return leitores
                    .slice(0, 6)
            }

            return leitores
                .filter((leitor) => {

                    return (
                        leitor.nome
                            ?.toLowerCase()
                            .includes(termo) ||

                        leitor.email
                            ?.toLowerCase()
                            .includes(termo)
                    )
                })
                .slice(0, 6)

        }, [
            buscaLeitor,
            leitores
        ])


    // ========================================
    // FILTRAR LIVROS
    // ========================================

    const livrosFiltrados =
        useMemo(() => {

            const termo =
                buscaLivro
                    .trim()
                    .toLowerCase()

            const livrosDisponiveis =
                livros.filter(
                    (livro) =>
                        livro.quantidade_disponivel > 0
                )

            if (!termo) {

                return livrosDisponiveis
                    .slice(0, 6)
            }

            return livrosDisponiveis
                .filter((livro) => {

                    return (
                        livro.titulo
                            ?.toLowerCase()
                            .includes(termo) ||

                        livro.autor
                            ?.toLowerCase()
                            .includes(termo) ||

                        livro.isbn
                            ?.toLowerCase()
                            .includes(termo)
                    )
                })
                .slice(0, 6)

        }, [
            buscaLivro,
            livros
        ])


    // ========================================
    // DATAS
    // ========================================

    const dataEmprestimo =
        new Date()

    const dataPrevista =
        new Date()

    dataPrevista.setDate(
        dataPrevista.getDate() + 5
    )


    // ========================================
    // SALVAR
    // ========================================

    async function salvarEmprestimo(
        event
    ) {

        event.preventDefault()

        if (!leitorSelecionado) {

            setErro(
                "Selecione um leitor."
            )

            return
        }

        if (!livroSelecionado) {

            setErro(
                "Selecione um livro."
            )

            return
        }


        try {

            setSalvando(true)
            setErro("")

            await cadastrarEmprestimo({
                leitor_id:
                    leitorSelecionado.id,

                livro_id:
                    livroSelecionado.id
            })

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


    if (carregando) {

        return (
            <main className="novo-emprestimo-page">

                <div className="novo-emprestimo-estado">
                    Carregando informações...
                </div>

            </main>
        )
    }


    return (
        <main className="novo-emprestimo-page">

            {/* ========================================
                CABEÇALHO
            ======================================== */}

            <section className="novo-emprestimo-cabecalho">

                <span>
                    Empréstimos
                </span>

                <h1>
                    Novo empréstimo
                </h1>

                <p>
                    Registre a retirada de um livro
                    por um leitor da biblioteca.
                </p>

            </section>


            {/* ========================================
                VOLTAR
            ======================================== */}

            <Link
                to="/emprestimos"
                className="novo-emprestimo-voltar"
            >
                <span>
                    ←
                </span>

                Voltar para empréstimos
            </Link>


            {/* ========================================
                ERRO
            ======================================== */}

            {erro && (

                <div className="novo-emprestimo-erro">
                    {erro}
                </div>

            )}


            {/* ========================================
                FORMULÁRIO
            ======================================== */}

            <form
                className="novo-emprestimo-card"
                onSubmit={salvarEmprestimo}
            >

                {/* ====================================
                    LEITOR
                ==================================== */}

                <section className="novo-emprestimo-secao">

                    <div className="novo-emprestimo-secao-titulo">

                        <span>
                            01
                        </span>

                        <div>

                            <h2>
                                Selecione o leitor
                            </h2>

                            <p>
                                Escolha quem realizará
                                o empréstimo.
                            </p>

                        </div>

                    </div>


                    {leitorSelecionado ? (

                        <div className="emprestimo-selecionado">

                            <div className="emprestimo-avatar">

                                {leitorSelecionado.foto ? (

                                    <img
                                        src={
                                            `${API_URL}/static/${leitorSelecionado.foto}`
                                        }
                                        alt=""
                                    />

                                ) : (

                                    <span>
                                        {
                                            obterInicial(
                                                leitorSelecionado.nome
                                            )
                                        }
                                    </span>

                                )}

                            </div>


                            <div className="emprestimo-selecionado-info">

                                <span>
                                    Leitor selecionado
                                </span>

                                <strong>
                                    {
                                        leitorSelecionado.nome
                                    }
                                </strong>

                                <p>
                                    {
                                        leitorSelecionado.email
                                    }
                                </p>

                            </div>


                            <button
                                type="button"
                                className="btn-alterar-selecao"
                                onClick={() => {

                                    setLeitorSelecionado(
                                        null
                                    )

                                    setBuscaLeitor("")
                                }}
                            >
                                Alterar
                            </button>

                        </div>

                    ) : (

                        <>

                            <div className="emprestimo-busca">

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
                                />

                                <span>
                                    ⌕
                                </span>

                            </div>


                            <div className="emprestimo-resultados">

                                {leitoresFiltrados.length > 0 ? (

                                    leitoresFiltrados.map(
                                        (leitor) => (

                                        <button
                                            type="button"
                                            className="resultado-leitor"
                                            key={leitor.id}
                                            onClick={() =>
                                                setLeitorSelecionado(
                                                    leitor
                                                )
                                            }
                                        >

                                            <div className="resultado-leitor-avatar">

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


                                            <div>

                                                <strong>
                                                    {leitor.nome}
                                                </strong>

                                                <span>
                                                    {leitor.email}
                                                </span>

                                            </div>

                                        </button>

                                        )
                                    )

                                ) : (

                                    <div className="resultado-vazio">
                                        Nenhum leitor encontrado.
                                    </div>

                                )}

                            </div>

                        </>

                    )}

                </section>


                <div className="novo-emprestimo-divisor" />


                {/* ====================================
                    LIVRO
                ==================================== */}

                <section className="novo-emprestimo-secao">

                    <div className="novo-emprestimo-secao-titulo">

                        <span>
                            02
                        </span>

                        <div>

                            <h2>
                                Selecione o livro
                            </h2>

                            <p>
                                Apenas livros disponíveis
                                podem ser emprestados.
                            </p>

                        </div>

                    </div>


                    {livroSelecionado ? (

                        <div className="emprestimo-selecionado livro-selecionado">

                            <div className="emprestimo-capa">

                                {livroSelecionado.capa ? (

                                    <img
                                        src={
                                            `${API_URL}/static/${livroSelecionado.capa}`
                                        }
                                        alt=""
                                    />

                                ) : (

                                    <span>
                                        L
                                    </span>

                                )}

                            </div>


                            <div className="emprestimo-selecionado-info">

                                <span>
                                    Livro selecionado
                                </span>

                                <strong>
                                    {
                                        livroSelecionado.titulo
                                    }
                                </strong>

                                <p>
                                    {
                                        livroSelecionado.autor
                                    }
                                </p>

                                <small>
                                    {
                                        livroSelecionado.quantidade_disponivel
                                    } {
                                        livroSelecionado.quantidade_disponivel === 1
                                            ? "exemplar disponível"
                                            : "exemplares disponíveis"
                                    }
                                </small>

                            </div>


                            <button
                                type="button"
                                className="btn-alterar-selecao"
                                onClick={() => {

                                    setLivroSelecionado(
                                        null
                                    )

                                    setBuscaLivro("")
                                }}
                            >
                                Alterar
                            </button>

                        </div>

                    ) : (

                        <>

                            <div className="emprestimo-busca">

                                <input
                                    type="search"
                                    placeholder="Buscar livro por título, autor ou ISBN..."
                                    value={buscaLivro}
                                    onChange={
                                        (event) =>
                                            setBuscaLivro(
                                                event.target.value
                                            )
                                    }
                                />

                                <span>
                                    ⌕
                                </span>

                            </div>


                            <div className="emprestimo-resultados livros">

                                {livrosFiltrados.length > 0 ? (

                                    livrosFiltrados.map(
                                        (livro) => (

                                        <button
                                            type="button"
                                            className="resultado-livro"
                                            key={livro.id}
                                            onClick={() =>
                                                setLivroSelecionado(
                                                    livro
                                                )
                                            }
                                        >

                                            <div className="resultado-livro-capa">

                                                {livro.capa ? (

                                                    <img
                                                        src={
                                                            `${API_URL}/static/${livro.capa}`
                                                        }
                                                        alt=""
                                                    />

                                                ) : (

                                                    <span>
                                                        L
                                                    </span>

                                                )}

                                            </div>


                                            <div className="resultado-livro-info">

                                                <strong>
                                                    {livro.titulo}
                                                </strong>

                                                <span>
                                                    {livro.autor}
                                                </span>

                                                <small>
                                                    {livro.quantidade_disponivel}
                                                    {
                                                        livro.quantidade_disponivel === 1
                                                            ? " disponível"
                                                            : " disponíveis"
                                                    }
                                                </small>

                                            </div>

                                        </button>

                                        )
                                    )

                                ) : (

                                    <div className="resultado-vazio">
                                        Nenhum livro disponível encontrado.
                                    </div>

                                )}

                            </div>

                        </>

                    )}

                </section>


                <div className="novo-emprestimo-divisor" />


                {/* ====================================
                    PRAZO
                ==================================== */}

                <section className="novo-emprestimo-secao">

                    <div className="novo-emprestimo-secao-titulo">

                        <span>
                            03
                        </span>

                        <div>

                            <h2>
                                Prazo do empréstimo
                            </h2>

                            <p>
                                O prazo de devolução é
                                calculado automaticamente.
                            </p>

                        </div>

                    </div>


                    <div className="emprestimo-datas">

                        <div>

                            <span>
                                Data do empréstimo
                            </span>

                            <strong>
                                {
                                    formatarData(
                                        dataEmprestimo
                                    )
                                }
                            </strong>

                        </div>


                        <span className="emprestimo-data-seta">
                            →
                        </span>


                        <div>

                            <span>
                                Devolução prevista
                            </span>

                            <strong>
                                {
                                    formatarData(
                                        dataPrevista
                                    )
                                }
                            </strong>

                        </div>

                    </div>

                </section>


                {/* ====================================
                    AÇÕES
                ==================================== */}

                <div className="novo-emprestimo-acoes">

                    <Link
                        to="/emprestimos"
                        className="btn-cancelar-emprestimo"
                    >
                        Cancelar
                    </Link>


                    <button
                        type="submit"
                        className="btn-confirmar-emprestimo"
                        disabled={
                            salvando ||
                            !leitorSelecionado ||
                            !livroSelecionado
                        }
                    >
                        {
                            salvando
                                ? "Registrando..."
                                : "Confirmar empréstimo"
                        }
                    </button>

                </div>

            </form>

        </main>
    )
}


function obterInicial(nome) {

    if (!nome) {
        return "L"
    }

    return nome
        .trim()
        .charAt(0)
        .toUpperCase()
}


function formatarData(data) {

    return data.toLocaleDateString(
        "pt-BR"
    )
}


export default NovoEmprestimo