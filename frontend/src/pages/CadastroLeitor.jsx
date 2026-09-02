import {
    useState
} from "react"

import {
    Link,
    useNavigate
} from "react-router-dom"

import {
    cadastrarLeitor
} from "../services/leitorService"

import "../styles/CadastroLeitor.css"


function CadastroLeitor() {

    const navigate = useNavigate()


    const [formulario, setFormulario] = useState({
        nome: "",
        email: "",
        telefone: "",
        endereco: "",
        foto: null
    })
    
    
    const [previewFoto, setPreviewFoto] =
        useState(null)


    const [salvando, setSalvando] =
        useState(false)

    const [erro, setErro] =
        useState("")


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

    function alterarFoto(event) {

        const arquivo =
            event.target.files[0]
    
    
        if (!arquivo) {
            return
        }
    
    
        setFormulario(
            (anterior) => ({
                ...anterior,
                foto: arquivo
            })
        )
    
    
        const preview =
            URL.createObjectURL(arquivo)
    
        setPreviewFoto(preview)
    }


    async function enviarFormulario(event) {

        event.preventDefault()

        setErro("")
        setSalvando(true)


        try {

            await cadastrarLeitor(
                formulario
            )

            navigate("/leitores")

        } catch (erro) {

            setErro(erro.message)

        } finally {

            setSalvando(false)
        }
    }


    return (
        <main className="cadastro-leitor-page">

            {/* CABEÇALHO */}

            <section className="cadastro-leitor-cabecalho">

                <span>
                    Leitores
                </span>

                <h1>
                    Cadastrar leitor
                </h1>

                <p>
                    Adicione um novo leitor
                    à biblioteca.
                </p>

            </section>


            {/* VOLTAR */}

            <Link
                to="/leitores"
                className="cadastro-leitor-voltar"
            >
                <span>←</span>

                Voltar para leitores
            </Link>


            {/* ERRO */}

            {erro && (

                <div className="cadastro-leitor-erro">
                    {erro}
                </div>

            )}


            {/* CARD */}

            <section className="cadastro-leitor-card">

                <div className="cadastro-leitor-ilustracao">

                    <label
                        htmlFor="foto"
                        className="cadastro-leitor-foto"
                    >

                        {previewFoto ? (

                            <img
                                src={previewFoto}
                                alt="Prévia da foto do leitor"
                            />

                        ) : (

                            <div className="cadastro-leitor-sem-foto">

                                <span>
                                    +
                                </span>

                            </div>

                        )}


                        <span className="cadastro-leitor-foto-acao">
                            Escolher foto
                        </span>

                    </label>


                    <input
                        id="foto"
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={alterarFoto}
                        className="cadastro-leitor-input-foto"
                    />


                    <h2>
                        Novo leitor
                    </h2>

                    <p>
                        Cadastre as informações
                        básicas do leitor para que
                        ele possa realizar empréstimos
                        na biblioteca.
                    </p>

                </div>


                <form
                    className="cadastro-leitor-formulario"
                    onSubmit={enviarFormulario}
                >

                    <div className="cadastro-leitor-form-topo">

                        <span>
                            Informações pessoais
                        </span>

                        <h2>
                            Dados do leitor
                        </h2>

                        <p>
                            Preencha os campos abaixo
                            para realizar o cadastro.
                        </p>

                    </div>


                    <div className="cadastro-leitor-campos">

                        <div className="cadastro-leitor-campo">

                            <label htmlFor="nome">
                                Nome completo
                            </label>

                            <input
                                id="nome"
                                name="nome"
                                type="text"
                                placeholder="Digite o nome do leitor"
                                value={formulario.nome}
                                onChange={alterarCampo}
                                required
                            />

                        </div>


                        <div className="cadastro-leitor-campo">

                            <label htmlFor="email">
                                E-mail
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="exemplo@email.com"
                                value={formulario.email}
                                onChange={alterarCampo}
                                required
                            />

                        </div>
                        <div className="cadastro-leitor-campo-linha">
                            <div className="cadastro-leitor-campo">
                                <label htmlFor="telefone">
                                    Telefone
                                </label>
                                <input
                                    id="telefone"
                                    name="telefone"
                                    type="tel"
                                    placeholder="(00) 00000-0000"
                                    value={formulario.telefone}
                                    onChange={alterarCampo}
                                />

                            </div>

                            <div className="cadastro-leitor-campo">

                                <label htmlFor="endereco">
                                    Endereço
                                </label>

                                <input
                                    id="endereco"
                                    name="endereco"
                                    type="text"
                                    placeholder="Digite o endereço"
                                    value={formulario.endereco}
                                    onChange={alterarCampo}
                                />

                            </div>

                        </div>
                    </div>
                    <div className="cadastro-leitor-acoes">

                        <Link
                            to="/leitores"
                            className="btn-cancelar-leitor"
                        >
                            Cancelar
                        </Link>


                        <button
                            type="submit"
                            className="btn-cadastrar-leitor"
                            disabled={salvando}
                        >
                            {salvando
                                ? "Cadastrando..."
                                : "Cadastrar leitor"
                            }
                        </button>

                    </div>

                </form>

            </section>

        </main>
    )
}


export default CadastroLeitor