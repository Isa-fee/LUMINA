import {
    useEffect,
    useState
} from "react"

import {
    Link,
    useNavigate
} from "react-router-dom"

import { cadastrarLivro } from "../services/livroService"

import "../styles/CadastroLivro.css"


function CadastroLivro() {

    const navigate = useNavigate()

    const [formulario, setFormulario] = useState({
        titulo: "",
        autor: "",
        categoria: "",
        isbn: "",
        quantidade_total: 1
    })

    const [capa, setCapa] = useState(null)
    const [preview, setPreview] = useState(null)

    const [erro, setErro] = useState("")
    const [salvando, setSalvando] = useState(false)


    useEffect(() => {

        return () => {

            if (preview) {
                URL.revokeObjectURL(preview)
            }
        }

    }, [preview])


    function alterarCampo(event) {

        const {
            name,
            value
        } = event.target


        setFormulario({
            ...formulario,
            [name]: value
        })
    }


    function selecionarCapa(event) {

        const arquivo = event.target.files[0]


        if (!arquivo) {
            return
        }


        if (preview) {
            URL.revokeObjectURL(preview)
        }


        setCapa(arquivo)

        setPreview(
            URL.createObjectURL(arquivo)
        )
    }


    async function enviarFormulario(event) {

        event.preventDefault()

        setErro("")
        setSalvando(true)


        try {

            await cadastrarLivro({
                ...formulario,
                capa
            })


            navigate("/livros")

        } catch (erro) {

            setErro(erro.message)

        } finally {

            setSalvando(false)
        }
    }


    return (
        <main className="cadastro-livro-page">

            <div className="cadastro-livro-topo">

                <div>

                    <span className="cadastro-identificacao">
                        Acervo
                    </span>

                    <h1>
                        Cadastrar novo livro
                    </h1>

                    <p>
                        Adicione um novo título ao
                        acervo da biblioteca.
                    </p>

                </div>


                <Link
                    to="/livros"
                    className="cadastro-voltar"
                >
                    ← Voltar para livros
                </Link>

            </div>


            <form
                className="cadastro-livro-form"
                onSubmit={enviarFormulario}
            >

                <section className="cadastro-capa">

                    <h2>
                        Capa do livro
                    </h2>


                    <label
                        className="upload-capa"
                        htmlFor="capa"
                    >

                        {preview ? (

                            <img
                                src={preview}
                                alt="Pré-visualização da capa"
                            />

                        ) : (

                            <div className="capa-placeholder">

                                <span>+</span>

                                <strong>
                                    Adicionar capa
                                </strong>

                                <small>
                                    JPG, PNG ou WEBP
                                </small>

                            </div>

                        )}

                    </label>


                    <input
                        id="capa"
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={selecionarCapa}
                        hidden
                    />


                    {preview && (

                        <label
                            htmlFor="capa"
                            className="trocar-capa"
                        >
                            Trocar imagem
                        </label>

                    )}

                </section>


                <section className="cadastro-dados">

                    <h2>
                        Informações do livro
                    </h2>


                    <div className="campo-livro campo-livro-grande">

                        <label htmlFor="titulo">
                            Título
                        </label>

                        <input
                            id="titulo"
                            name="titulo"
                            type="text"
                            placeholder="Digite o título do livro"
                            value={formulario.titulo}
                            onChange={alterarCampo}
                            required
                        />

                    </div>


                    <div className="campos-livro-linha">

                        <div className="campo-livro">

                            <label htmlFor="autor">
                                Autor
                            </label>

                            <input
                                id="autor"
                                name="autor"
                                type="text"
                                placeholder="Nome do autor"
                                value={formulario.autor}
                                onChange={alterarCampo}
                                required
                            />

                        </div>


                        <div className="campo-livro">

                            <label htmlFor="categoria">
                                Categoria
                            </label>

                            <input
                                id="categoria"
                                name="categoria"
                                type="text"
                                placeholder="Ex.: Fantasia"
                                value={formulario.categoria}
                                onChange={alterarCampo}
                                required
                            />

                        </div>

                    </div>


                    <div className="campos-livro-linha">

                        <div className="campo-livro">

                            <label htmlFor="isbn">
                                ISBN
                            </label>

                            <input
                                id="isbn"
                                name="isbn"
                                type="text"
                                placeholder="Digite o ISBN"
                                value={formulario.isbn}
                                onChange={alterarCampo}
                                required
                            />

                        </div>


                        <div className="campo-livro">

                            <label htmlFor="quantidade_total">
                                Quantidade
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


                    {erro && (

                        <div className="cadastro-livro-erro">
                            {erro}
                        </div>

                    )}


                    <div className="cadastro-livro-acoes">

                        <Link
                            to="/livros"
                            className="btn-cancelar-cadastro"
                        >
                            Cancelar
                        </Link>


                        <button
                            type="submit"
                            className="btn-salvar-livro"
                            disabled={salvando}
                        >
                            {salvando
                                ? "Salvando..."
                                : "Cadastrar livro"
                            }
                        </button>

                    </div>

                </section>

            </form>

        </main>
    )
}


export default CadastroLivro