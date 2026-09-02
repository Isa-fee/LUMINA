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
    buscarLeitor,
    editarLeitor
} from "../services/leitorService"

import {
    API_URL
} from "../services/api"

import "../styles/CadastroLeitor.css"


function EditarLeitor() {

    const { id } = useParams()

    const navigate = useNavigate()


    const [formulario, setFormulario] = useState({
        nome: "",
        email: "",
        telefone: "",
        endereco: "",
        foto: null
    })


    const [fotoAtual, setFotoAtual] =
        useState(null)

    const [previewFoto, setPreviewFoto] =
        useState(null)


    const [carregando, setCarregando] =
        useState(true)

    const [salvando, setSalvando] =
        useState(false)

    const [erro, setErro] =
        useState("")


    // ========================================
    // CARREGAR LEITOR
    // ========================================

    useEffect(() => {

        async function carregarLeitor() {

            try {

                setErro("")

                const leitor =
                    await buscarLeitor(id)


                setFormulario({
                    nome: leitor.nome || "",
                    email: leitor.email || "",
                    telefone: leitor.telefone || "",
                    endereco: leitor.endereco || "",
                    foto: null
                })


                setFotoAtual(
                    leitor.foto || null
                )

            } catch (erro) {

                setErro(
                    erro.message
                )

            } finally {

                setCarregando(false)
            }
        }


        carregarLeitor()

    }, [id])


    // ========================================
    // ALTERAR CAMPOS
    // ========================================

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


    // ========================================
    // ALTERAR FOTO
    // ========================================

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


        if (previewFoto) {

            URL.revokeObjectURL(
                previewFoto
            )
        }


        const preview =
            URL.createObjectURL(
                arquivo
            )


        setPreviewFoto(
            preview
        )
    }


    // ========================================
    // LIMPAR PREVIEW
    // ========================================

    useEffect(() => {

        return () => {

            if (previewFoto) {

                URL.revokeObjectURL(
                    previewFoto
                )
            }
        }

    }, [previewFoto])


    // ========================================
    // ENVIAR FORMULÁRIO
    // ========================================

    async function enviarFormulario(event) {

        event.preventDefault()

        setErro("")
        setSalvando(true)


        try {

            await editarLeitor(
                id,
                formulario
            )


            navigate(
                `/leitores/${id}`
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

            <main className="cadastro-leitor-page">

                <div className="leitores-estado">

                    Carregando leitor...

                </div>

            </main>
        )
    }


    // ========================================
    // PÁGINA
    // ========================================

    return (

        <main className="cadastro-leitor-page">


            {/* ========================================
                CABEÇALHO
            ======================================== */}

            <section className="cadastro-leitor-cabecalho">

                <span>
                    Leitores
                </span>

                <h1>
                    Editar leitor
                </h1>

                <p>
                    Atualize as informações
                    do leitor.
                </p>

            </section>


            {/* ========================================
                VOLTAR
            ======================================== */}

            <Link
                to={`/leitores/${id}`}
                className="cadastro-leitor-voltar"
            >

                <span>
                    ←
                </span>

                Voltar para detalhes

            </Link>


            {/* ========================================
                ERRO
            ======================================== */}

            {erro && (

                <div className="cadastro-leitor-erro">

                    {erro}

                </div>

            )}


            {/* ========================================
                CARD
            ======================================== */}

            <section className="cadastro-leitor-card">


                {/* ====================================
                    FOTO
                ==================================== */}

                <div className="cadastro-leitor-ilustracao">


                    <label
                        htmlFor="foto"
                        className="cadastro-leitor-foto"
                    >


                        {previewFoto ? (

                            <img
                                src={previewFoto}
                                alt="Prévia da nova foto"
                            />

                        ) : fotoAtual ? (

                            <img
                                src={
                                    `${API_URL}/static/${fotoAtual}`
                                }
                                alt={`Foto de ${formulario.nome}`}
                            />

                        ) : (

                            <div className="cadastro-leitor-sem-foto">

                                <span>
                                    {obterInicial(
                                        formulario.nome
                                    )}
                                </span>

                            </div>

                        )}


                        <span className="cadastro-leitor-foto-acao">

                            Alterar foto

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
                        {formulario.nome}
                    </h2>


                    <p>
                        Atualize os dados pessoais
                        do leitor sempre que
                        necessário.
                    </p>

                </div>


                {/* ====================================
                    FORMULÁRIO
                ==================================== */}

                <form
                    className="cadastro-leitor-formulario"
                    onSubmit={enviarFormulario}
                >


                    {/* TOPO */}

                    <div className="cadastro-leitor-form-topo">

                        <span>
                            Informações pessoais
                        </span>

                        <h2>
                            Dados do leitor
                        </h2>

                        <p>
                            Altere os campos desejados
                            e salve as modificações.
                        </p>

                    </div>


                    {/* =================================
                        CAMPOS
                    ================================= */}

                    <div className="cadastro-leitor-campos">


                        {/* NOME */}

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


                        {/* EMAIL */}

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


                        {/* TELEFONE + ENDEREÇO */}

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


                    {/* =================================
                        AÇÕES
                    ================================= */}

                    <div className="cadastro-leitor-acoes">


                        <Link
                            to={`/leitores/${id}`}
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


// ========================================
// INICIAL DO LEITOR
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


export default EditarLeitor