import {
    useEffect,
    useState
} from "react"

import { Link } from "react-router-dom"

import { listarLivros } from "../services/livroService"

import "../styles/Livros.css"

import { API_URL } from "../services/api"


function Livros() {

    const [livros, setLivros] = useState([])
    const [busca, setBusca] = useState("")
    const [categoria, setCategoria] = useState("")
    const [disponibilidade, setDisponibilidade] = useState("")
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState("")


    useEffect(() => {

        async function carregarLivros() {

            try {

                const dados = await listarLivros()

                setLivros(dados)

            } catch (erro) {

                setErro(erro.message)

            } finally {

                setCarregando(false)
            }
        }

        carregarLivros()

    }, [])


    const categorias = [
        ...new Set(
            livros
                .map((livro) => livro.categoria)
                .filter(Boolean)
        )
    ]


    const livrosFiltrados = livros.filter(
        (livro) => {

            const termo = busca
                .trim()
                .toLowerCase()

            const correspondeBusca =
                !termo ||
                livro.titulo
                    ?.toLowerCase()
                    .includes(termo) ||
                livro.autor
                    ?.toLowerCase()
                    .includes(termo) ||
                livro.categoria
                    ?.toLowerCase()
                    .includes(termo)


            const correspondeCategoria =
                !categoria ||
                livro.categoria === categoria


            const correspondeDisponibilidade =
                !disponibilidade ||

                (
                    disponibilidade === "disponivel" &&
                    livro.quantidade_disponivel > 0
                ) ||

                (
                    disponibilidade === "indisponivel" &&
                    livro.quantidade_disponivel === 0
                )


            return (
                correspondeBusca &&
                correspondeCategoria &&
                correspondeDisponibilidade
            )
        }
    )


    if (carregando) {

        return (
            <div className="livros-estado">
                Carregando livros...
            </div>
        )
    }


    return (
        <main className="livros-page">

            <section className="livros-cabecalho">

                <span>Acervo</span>

                <h1>
                    Livros cadastrados
                </h1>

                <p>
                    Consulte e gerencie os livros
                    disponíveis na biblioteca.
                </p>

            </section>


            <section className="barra-livros">

                <div className="busca-livros">

                    <input
                        type="search"
                        placeholder="Buscar por título, autor ou categoria..."
                        value={busca}
                        onChange={
                            (event) =>
                                setBusca(event.target.value)
                        }
                    />

                    <span className="icone-busca">
                        ⌕
                    </span>

                </div>


                <select
                    value={categoria}
                    onChange={
                        (event) =>
                            setCategoria(event.target.value)
                    }
                >
                    <option value="">
                        Categoria
                    </option>

                    {categorias.map(
                        (item) => (

                            <option
                                key={item}
                                value={item}
                            >
                                {item}
                            </option>

                        )
                    )}

                </select>


                <select
                    value={disponibilidade}
                    onChange={
                        (event) =>
                            setDisponibilidade(
                                event.target.value
                            )
                    }
                >
                    <option value="">
                        Disponibilidade
                    </option>

                    <option value="disponivel">
                        Disponível
                    </option>

                    <option value="indisponivel">
                        Indisponível
                    </option>

                </select>


                <Link
                    to="/livros/novo"
                    className="btn-novo-livro"
                >
                    Novo livro

                    <span>+</span>
                </Link>

            </section>


            <div className="resultado-livros">

                <strong>
                    {livrosFiltrados.length}
                </strong>

                {livrosFiltrados.length === 1
                    ? " livro encontrado"
                    : " livros encontrados"
                }

            </div>


            {erro && (
                <p className="livros-erro">
                    {erro}
                </p>
            )}


            {!erro &&
                livrosFiltrados.length === 0 && (

                <section className="livros-vazio">

                    <h2>
                        Nenhum livro encontrado
                    </h2>

                    <p>
                        Tente alterar os filtros
                        utilizados.
                    </p>

                </section>
            )}


            <section className="grade-livros">

                {livrosFiltrados.map(
                    (livro) => (

                    <article
                        className="card-livro"
                        key={livro.id}
                    >
                    
                        <div className="livro-capa-area">
                    
                            <div className="livro-capa">

                                {livro.capa ? (

                                    <img
                                        src={`${API_URL}/static/${livro.capa}`}
                                        alt={`Capa de ${livro.titulo}`}
                                    />

                                ) : (

                                    <span className="livro-sem-capa">
                                        📖
                                    </span>

                                )}

                            </div>
                        
                            <span
                                className={
                                    `categoria-tag categoria-${normalizarCategoria(
                                        livro.categoria
                                    )}`
                                }
                            >
                                {livro.categoria}
                            </span>
                    
                        </div>
                    
                    
                        <div className="livro-info">
                    
                            <h2>
                                {livro.titulo}
                            </h2>
                    
                            <p className="livro-autor">
                                {livro.autor}
                            </p>
                    
                        </div>
                    
                    
                        <div className="livro-quantidades">
                    
                            <p>
                                Disponíveis:
                                {" "}
                                <strong>
                                    {livro.quantidade_disponivel}
                                </strong>
                            </p>
                    
                            <p>
                                Total:
                                {" "}
                                <strong>
                                    {livro.quantidade_total}
                                </strong>
                            </p>
                    
                        </div>
                    
                    
                        <div className="acoes-livro">
                    
                            <Link
                                to={`/livros/${livro.id}`}
                                className="acao-livro"
                            >
                                <span className="acao-icone">
                                    ◉
                                </span>
                    
                                <span>
                                    Detalhes
                                </span>
                            </Link>
                    
                    
                            <Link
                                to={`/livros/${livro.id}/editar`}
                                className="acao-livro"
                            >
                                <span className="acao-icone">
                                    ✎
                                </span>
                    
                                <span>
                                    Editar
                                </span>
                            </Link>
                    
                    
                            <button
                                type="button"
                                className="acao-livro"
                            >
                                <span className="acao-icone">
                                    ♲
                                </span>
                    
                                <span>
                                    Excluir
                                </span>
                            </button>
                    
                        </div>
                    
                    </article>

                    )
                )}

            </section>

        </main>
    )
}


function normalizarCategoria(categoria) {

    if (!categoria) {
        return "outra"
    }

    return categoria
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, "-")
}


export default Livros