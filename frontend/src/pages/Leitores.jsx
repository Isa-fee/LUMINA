import {
    useEffect,
    useState
} from "react"

import { Link } from "react-router-dom"

import {
    listarLeitores,
    excluirLeitor
} from "../services/leitorService"

import "../styles/Leitores.css"

import { API_URL } from "../services/api"

import iconeDetalhes from "../assets/icons/detalhes.png"
import iconeEditar from "../assets/icons/editar.png"
import iconeExcluir from "../assets/icons/excluir.png"


function Leitores() {

    const [leitores, setLeitores] = useState([])
    const [busca, setBusca] = useState("")
    const [ordem, setOrdem] = useState("recentes")

    const [carregando, setCarregando] =
        useState(true)

    const [erro, setErro] =
        useState("")

    const [leitorExcluir, setLeitorExcluir] =
        useState(null)
    
    const [excluindo, setExcluindo] =
        useState(false)


    useEffect(() => {

        async function carregarLeitores() {

            try {

                const dados =
                    await listarLeitores()

                setLeitores(dados)

            } catch (erro) {

                setErro(erro.message)

            } finally {

                setCarregando(false)
            }
        }

        carregarLeitores()

    }, [])

    async function confirmarExclusao() {
        if (!leitorExcluir) {
            return
        }
    
        try {
    
            setExcluindo(true)
            setErro("")
    
            await excluirLeitor(
                leitorExcluir.id
            )
    
            setLeitores(
                (anteriores) =>
                    anteriores.filter(
                        (leitor) =>
                            leitor.id !== leitorExcluir.id
                    )
            )
    
            setLeitorExcluir(null)
    
        } catch (erro) {
    
            setErro(
                erro.message
            )
    
            setLeitorExcluir(null)
    
        } finally {
    
            setExcluindo(false)
        }
    }


    const leitoresFiltrados = leitores
        .filter((leitor) => {

            const termo = busca
                .trim()
                .toLowerCase()

            if (!termo) {
                return true
            }

            return (
                leitor.nome
                    ?.toLowerCase()
                    .includes(termo) ||

                leitor.email
                    ?.toLowerCase()
                    .includes(termo)
            )
        })
        .sort((a, b) => {

            if (ordem === "nome") {

                return a.nome.localeCompare(
                    b.nome
                )
            }


            if (ordem === "emprestimos") {

                return (
                    b.total_emprestimos -
                    a.total_emprestimos
                )
            }


            /*
             * IDs maiores normalmente representam
             * cadastros mais recentes.
             */
            return b.id - a.id
        })


    if (carregando) {

        return (
            <main className="leitores-page">

                <div className="leitores-estado">
                    Carregando leitores...
                </div>

            </main>
        )
    }


    return (
        <main className="leitores-page">

            {/* CABEÇALHO */}

            <section className="leitores-cabecalho">

                <span>
                    Leitores
                </span>

                <h1>
                    Leitores cadastrados
                </h1>

                <p>
                    Gerencie os leitores da biblioteca.
                </p>

            </section>


            {/* FILTROS */}

            <section className="barra-leitores">

                <div className="busca-leitores">

                    <input
                        type="search"
                        placeholder="Buscar por nome ou e-mail..."
                        value={busca}
                        onChange={
                            (event) =>
                                setBusca(
                                    event.target.value
                                )
                        }
                    />

                    <span className="icone-busca-leitor">
                        ⌕
                    </span>

                </div>


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

                    <option value="nome">
                        Nome (A–Z)
                    </option>

                    <option value="emprestimos">
                        Mais empréstimos
                    </option>

                </select>


                <Link
                    to="/leitores/novo"
                    className="btn-novo-leitor"
                >
                    Novo leitor

                    <span>
                        +
                    </span>
                </Link>

            </section>


            {/* QUANTIDADE */}

            <div className="resultado-leitores">

                <strong>
                    {leitoresFiltrados.length}
                </strong>

                {leitoresFiltrados.length === 1
                    ? " leitor encontrado"
                    : " leitores encontrados"
                }

            </div>


            {/* ERRO */}

            {erro && (

                <p className="leitores-erro">
                    {erro}
                </p>

            )}


            {/* VAZIO */}

            {!erro &&
                leitoresFiltrados.length === 0 && (

                <section className="leitores-vazio">

                    <h2>
                        Nenhum leitor encontrado
                    </h2>

                    <p>
                        Tente alterar a busca utilizada.
                    </p>

                </section>

            )}


            {/* LISTAGEM */}

            <section className="lista-leitores">

                {leitoresFiltrados.map(
                    (leitor) => (

                    <article
                        className="card-leitor"
                        key={leitor.id}
                    >

                        {/* LEITOR */}

                        <div className="leitor-identidade">

                            <div className="leitor-avatar">

                                {leitor.foto ? (

                                    <img
                                        src={
                                            `${API_URL}/static/${leitor.foto}`
                                        }
                                        alt={`Foto de ${leitor.nome}`}
                                    />

                                    ) : (

                                    <span>
                                        {obterInicial(
                                            leitor.nome
                                        )}
                                    </span>

                                    )}

                            </div>


                            <div className="leitor-dados">

                                <h2>
                                    {leitor.nome}
                                </h2>

                                <p>
                                    {leitor.email}
                                </p>

                            </div>

                        </div>


                        {/* EMPRÉSTIMOS */}

                        <div className="leitor-emprestimos">

                            <span>
                                Total de empréstimos
                            </span>

                            <strong>
                                {
                                    leitor.total_emprestimos
                                    ?? 0
                                }
                            </strong>

                        </div>


                        {/* AÇÕES */}

                        <div className="leitor-acoes">

                            <span className="leitor-acoes-titulo">
                                Ações
                            </span>


                            <div className="leitor-acoes-botoes">

                                <Link
                                    to={`/leitores/${leitor.id}`}
                                    className="acao-leitor"
                                >

                                    <span className="acao-leitor-icone">
                                        <img
                                            src={iconeDetalhes}
                                            alt=""
                                        />
                                    </span>

                                    <span>
                                        Detalhes
                                    </span>

                                </Link>


                                <Link
                                    to={`/leitores/${leitor.id}/editar`}
                                    className="acao-leitor"
                                >

                                    <span className="acao-leitor-icone">
                                        <img
                                            src={iconeEditar}
                                            alt=""
                                        />
                                    </span>

                                    <span>
                                        Editar
                                    </span>

                                </Link>


                                <button
                                    type="button"
                                    className="acao-leitor"
                                    onClick={() =>
                                        setLeitorExcluir(leitor)
                                    }
                                >

                                    <span className="acao-leitor-icone">
                                        <img
                                            src={iconeExcluir}
                                            alt=""
                                        />
                                    </span>

                                    <span>
                                        Excluir
                                    </span>

                                </button>

                            </div>

                        </div>

                    </article>

                    )
                )}

            </section>
                    {/* MODAL DE EXCLUSÃO */}

                    {leitorExcluir && (

                <div className="modal-excluir-fundo">

                    <div className="modal-excluir">

                        <div className="modal-excluir-icone">
                            !
                        </div>


                        <h2>
                            Excluir leitor?
                        </h2>


                        <p>
                            Você está prestes a excluir

                            <strong>
                                {" "}{leitorExcluir.nome}
                            </strong>.

                            Essa ação não poderá ser desfeita.
                        </p>


                        <div className="modal-excluir-acoes">

                            <button
                                type="button"
                                className="modal-btn-cancelar"
                                onClick={() =>
                                    setLeitorExcluir(null)
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


function obterInicial(nome) {

    if (!nome) {
        return "L"
    }

    return nome
        .trim()
        .charAt(0)
        .toUpperCase()
}


export default Leitores