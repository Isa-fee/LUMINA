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
    buscarLivro,
    excluirLivro
} from "../services/livroService"

import { API_URL } from "../services/api"

import "../styles/DetalhesLivro.css"


function DetalhesLivro() {

    const { id } = useParams()
    const navigate = useNavigate()

    const [livro, setLivro] = useState(null)
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState("")
    const [modalExcluir, setModalExcluir] = useState(false)
    const [excluindo, setExcluindo] = useState(false)


    useEffect(() => {

        async function carregarLivro() {

            try {

                const dados = await buscarLivro(id)

                setLivro(dados)

            } catch (erro) {

                setErro(erro.message)

            } finally {

                setCarregando(false)
            }
        }

        carregarLivro()

    }, [id])

    async function confirmarExclusao() {

        try {
    
            setExcluindo(true)
            setErro("")
    
            await excluirLivro(id)
    
            navigate("/livros")
    
        } catch (erro) {
    
            setErro(erro.message)
    
            setModalExcluir(false)
    
        } finally {
    
            setExcluindo(false)
        }
    }


    if (carregando) {

        return (
            <main className="detalhes-livro-page">

                <div className="detalhes-estado">
                    Carregando livro...
                </div>

            </main>
        )
    }


    if (erro) {

        return (
            <main className="detalhes-livro-page">

                <div className="detalhes-erro">
                    {erro}
                </div>

                <Link
                    to="/livros"
                    className="detalhes-voltar"
                >
                    ← Voltar para livros
                </Link>

            </main>
        )
    }


    if (!livro) {
        return null
    }


    const disponivel =
        livro.quantidade_disponivel > 0


    return (
        <main className="detalhes-livro-page">

            {/* CABEÇALHO */}

            <section className="detalhes-cabecalho">

                <span>
                    Acervo
                </span>

                <h1>
                    Detalhes do livro
                </h1>

                <p>
                    Consulte as informações e a
                    disponibilidade da obra.
                </p>

            </section>


            {/* VOLTAR */}

            <Link
                to="/livros"
                className="detalhes-voltar"
            >
                <span>←</span>

                Voltar para o acervo
            </Link>


            {/* CONTEÚDO */}

            <section className="detalhes-card">

                {/* CAPA */}

                <div className="detalhes-capa-coluna">

                    <div className="detalhes-capa">

                        {livro.capa ? (

                            <img
                                src={
                                    `${API_URL}/static/${livro.capa}`
                                }
                                alt={`Capa de ${livro.titulo}`}
                            />

                        ) : (

                            <span className="detalhes-sem-capa">
                                📖
                            </span>

                        )}

                    </div>


                    <span
                        className={
                            `detalhes-categoria categoria-${normalizarCategoria(
                                livro.categoria
                            )}`
                        }
                    >
                        {livro.categoria}
                    </span>

                </div>


                {/* INFORMAÇÕES */}

                <div className="detalhes-conteudo">

                    <div className="detalhes-titulo-area">

                        <span className="detalhes-rotulo">
                            Informações da obra
                        </span>

                        <h2>
                            {livro.titulo}
                        </h2>

                        <p>
                            {livro.autor}
                        </p>

                    </div>


                    <div className="detalhes-divisor" />


                    {/* DADOS */}

                    <div className="detalhes-informacoes">

                        <div className="detalhes-info-item">

                            <span>
                                ISBN
                            </span>

                            <strong>
                                {livro.isbn}
                            </strong>

                        </div>


                        <div className="detalhes-info-item">

                            <span>
                                Categoria
                            </span>

                            <strong>
                                {livro.categoria}
                            </strong>

                        </div>


                        <div className="detalhes-info-item">

                            <span>
                                Total de exemplares
                            </span>

                            <strong>
                                {livro.quantidade_total}
                            </strong>

                        </div>


                        <div className="detalhes-info-item">

                            <span>
                                Exemplares disponíveis
                            </span>

                            <strong>
                                {livro.quantidade_disponivel}
                            </strong>

                        </div>

                    </div>


                    {/* DISPONIBILIDADE */}

                    <div
                        className={
                            disponivel
                                ? "detalhes-disponibilidade disponivel"
                                : "detalhes-disponibilidade indisponivel"
                        }
                    >

                        <span className="status-bolinha" />

                        <div>

                            <strong>
                                {disponivel
                                    ? "Livro disponível"
                                    : "Livro indisponível"
                                }
                            </strong>

                            <p>
                                {disponivel
                                    ? `${livro.quantidade_disponivel} ${
                                        livro.quantidade_disponivel === 1
                                            ? "exemplar disponível"
                                            : "exemplares disponíveis"
                                    } para empréstimo.`
                                    : "Todos os exemplares estão emprestados."
                                }
                            </p>

                        </div>

                    </div>


                    {/* AÇÕES */}

                    <div className="detalhes-acoes">

                        <Link
                            to={`/livros/${livro.id}/editar`}
                            className="btn-editar-detalhes"
                        >
                            <span>✎</span>

                            Editar livro
                        </Link>


                        <button
                            type="button"
                            className="btn-excluir-detalhes"
                            onClick={() => setModalExcluir(true)}
                        >
                            Excluir livro
                        </button>
                    </div>

                </div>

            </section>

            {modalExcluir && (

                <div className="modal-excluir-fundo">

                    <div className="modal-excluir">

                        <div className="modal-excluir-icone">
                            !
                        </div>

                        <h2>
                            Excluir livro?
                        </h2>

                        <p>
                            Você está prestes a excluir
                            <strong>
                                {" "}{livro.titulo}
                            </strong>.
                            Essa ação não poderá ser desfeita.
                        </p>


                        <div className="modal-excluir-acoes">

                            <button
                                type="button"
                                className="modal-btn-cancelar"
                                onClick={
                                    () => setModalExcluir(false)
                                }
                                disabled={excluindo}
                            >
                                Cancelar
                            </button>


                            <button
                                type="button"
                                className="modal-btn-confirmar"
                                onClick={confirmarExclusao}
                                disabled={excluindo}
                            >
                                {excluindo
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


export default DetalhesLivro