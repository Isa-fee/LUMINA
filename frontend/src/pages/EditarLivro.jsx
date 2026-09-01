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
    atualizarLivro
} from "../services/livroService"

import { API_URL } from "../services/api"

import "../styles/EditarLivro.css"


function EditarLivro() {

    const { id } = useParams()

    const navigate = useNavigate()


    const [formulario, setFormulario] = useState({
        titulo: "",
        autor: "",
        categoria: "",
        isbn: "",
        quantidade_total: 1
    })


    const [capaAtual, setCapaAtual] = useState("")

    const [carregando, setCarregando] =
        useState(true)

    const [salvando, setSalvando] =
        useState(false)

    const [erro, setErro] =
        useState("")


    useEffect(() => {

        async function carregarLivro() {

            try {

                const livro =
                    await buscarLivro(id)


                setFormulario({
                    titulo: livro.titulo || "",
                    autor: livro.autor || "",
                    categoria:
                        livro.categoria || "",
                    isbn: livro.isbn || "",
                    quantidade_total:
                        livro.quantidade_total || 1
                })


                setCapaAtual(
                    livro.capa || ""
                )

            } catch (erro) {

                setErro(erro.message)

            } finally {

                setCarregando(false)
            }
        }


        carregarLivro()

    }, [id])


    function alterarCampo(event) {

        const {
            name,
            value
        } = event.target


        setFormulario(
            (anterior) => ({
                ...anterior,

                [name]: value
            })
        )
    }


    async function enviarFormulario(event) {

        event.preventDefault()

        setErro("")
        setSalvando(true)


        try {

            await atualizarLivro(
                id,
                formulario
            )


            navigate(
                `/livros/${id}`
            )

        } catch (erro) {

            setErro(erro.message)

        } finally {

            setSalvando(false)
        }
    }


    if (carregando) {

        return (
            <main className="editar-livro-page">

                <div className="editar-estado">
                    Carregando livro...
                </div>

            </main>
        )
    }


    return (
        <main className="editar-livro-page">

            <section className="editar-cabecalho">

                <span>
                    Acervo
                </span>

                <h1>
                    Editar livro
                </h1>

                <p>
                    Atualize as informações
                    cadastradas desta obra.
                </p>

            </section>


            <Link
                to={`/livros/${id}`}
                className="editar-voltar"
            >
                <span>←</span>

                Voltar para os detalhes
            </Link>


            {erro && (

                <div className="editar-erro">
                    {erro}
                </div>

            )}


            <section className="editar-card">

                {/* CAPA */}

                <div className="editar-capa-area">

                    <span className="editar-capa-titulo">
                        Capa atual
                    </span>


                    <div className="editar-capa">

                        {capaAtual ? (

                            <img
                                src={
                                    `${API_URL}/static/${capaAtual}`
                                }
                                alt="Capa atual do livro"
                            />

                        ) : (

                            <span>
                                📖
                            </span>

                        )}

                    </div>


                    <p>
                        A capa cadastrada será
                        mantida após a edição.
                    </p>

                </div>


                {/* FORMULÁRIO */}

                <form
                    className="editar-formulario"
                    onSubmit={enviarFormulario}
                >

                    <div className="editar-form-topo">

                        <span>
                            Informações da obra
                        </span>

                        <h2>
                            Dados do livro
                        </h2>

                    </div>


                    <div className="editar-campos">

                        <div className="editar-campo campo-grande">

                            <label htmlFor="titulo">
                                Título
                            </label>

                            <input
                                id="titulo"
                                name="titulo"
                                type="text"
                                value={formulario.titulo}
                                onChange={alterarCampo}
                                required
                            />

                        </div>


                        <div className="editar-campo campo-grande">

                            <label htmlFor="autor">
                                Autor
                            </label>

                            <input
                                id="autor"
                                name="autor"
                                type="text"
                                value={formulario.autor}
                                onChange={alterarCampo}
                                required
                            />

                        </div>


                        <div className="editar-campo">

                            <label htmlFor="categoria">
                                Categoria
                            </label>

                            <input
                                id="categoria"
                                name="categoria"
                                type="text"
                                value={
                                    formulario.categoria
                                }
                                onChange={alterarCampo}
                                required
                            />

                        </div>


                        <div className="editar-campo">

                            <label htmlFor="isbn">
                                ISBN
                            </label>

                            <input
                                id="isbn"
                                name="isbn"
                                type="text"
                                value={formulario.isbn}
                                onChange={alterarCampo}
                                required
                            />

                        </div>


                        <div className="editar-campo">

                            <label htmlFor="quantidade_total">
                                Total de exemplares
                            </label>

                            <input
                                id="quantidade_total"
                                name="quantidade_total"
                                type="number"
                                min="1"
                                value={
                                    formulario.quantidade_total
                                }
                                onChange={alterarCampo}
                                required
                            />

                        </div>

                    </div>


                    <div className="editar-acoes">

                        <Link
                            to={`/livros/${id}`}
                            className="btn-cancelar-edicao"
                        >
                            Cancelar
                        </Link>


                        <button
                            type="submit"
                            className="btn-salvar-edicao"
                            disabled={salvando}
                        >
                            {salvando
                                ? "Salvando..."
                                : "Salvar alterações"
                            }
                        </button>

                    </div>

                </form>

            </section>

        </main>
    )
}


export default EditarLivro