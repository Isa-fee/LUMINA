import {
    useEffect,
    useState
} from "react"

import {
    Link,
    useParams
} from "react-router-dom"

import {
    buscarDetalhesLeitor
} from "../services/leitorService"

import {
    API_URL
} from "../services/api"

import "../styles/DetalhesLeitor.css"


function DetalhesLeitor() {

    const { id } = useParams()

    const [leitor, setLeitor] =
        useState(null)

    const [carregando, setCarregando] =
        useState(true)

    const [erro, setErro] =
        useState("")


    useEffect(() => {

        async function carregarLeitor() {

            try {

                const dados =
                    await buscarDetalhesLeitor(id)

                setLeitor(dados)

            } catch (erro) {

                setErro(erro.message)

            } finally {

                setCarregando(false)
            }
        }


        carregarLeitor()

    }, [id])


    if (carregando) {

        return (
            <main className="detalhes-leitor-page">

                <div className="detalhes-leitor-estado">
                    Carregando leitor...
                </div>

            </main>
        )
    }


    if (erro) {

        return (
            <main className="detalhes-leitor-page">

                <div className="detalhes-leitor-erro">
                    {erro}
                </div>

                <Link
                    to="/leitores"
                    className="detalhes-leitor-voltar"
                >
                    ← Voltar para leitores
                </Link>

            </main>
        )
    }


    if (!leitor) {
        return null
    }


    return (
        <main className="detalhes-leitor-page">

            {/* =====================================
                CABEÇALHO
            ====================================== */}

            <section className="detalhes-leitor-cabecalho">

                <span>
                    Leitores
                </span>

                <h1>
                    Detalhes do leitor
                </h1>

                <p>
                    Consulte as informações,
                    empréstimos e histórico do leitor.
                </p>

            </section>


            {/* =====================================
                VOLTAR
            ====================================== */}

            <Link
                to="/leitores"
                className="detalhes-leitor-voltar"
            >
                <span>←</span>

                Voltar para leitores
            </Link>


            {/* =====================================
                PERFIL
            ====================================== */}

            <section className="detalhes-leitor-perfil">

                <div className="detalhes-leitor-identidade">

                    <div className="detalhes-leitor-avatar">

                        {leitor.foto ? (

                            <img
                                src={
                                    `${API_URL}/static/${leitor.foto}`
                                }
                                alt={`Foto de ${leitor.nome}`}
                            />

                        ) : (

                            <span>
                                {obterInicial(leitor.nome)}
                            </span>

                        )}

                    </div>


                    <div className="detalhes-leitor-nome">

                        <span>
                            Leitor cadastrado
                        </span>

                        <h2>
                            {leitor.nome}
                        </h2>

                        <p>
                            {leitor.email}
                        </p>

                    </div>

                </div>


                <div className="detalhes-leitor-dados">

                    <div className="detalhes-leitor-info">

                        <span>
                            Telefone
                        </span>

                        <strong>
                            {leitor.telefone || "Não informado"}
                        </strong>

                    </div>


                    <div className="detalhes-leitor-info">

                        <span>
                            Endereço
                        </span>

                        <strong>
                            {leitor.endereco || "Não informado"}
                        </strong>

                    </div>


                    <div className="detalhes-leitor-info">

                        <span>
                            Cadastrado em
                        </span>

                        <strong>
                            {formatarData(
                                leitor.data_cadastro
                            )}
                        </strong>

                    </div>

                </div>

            </section>


            {/* =====================================
                RESUMO
            ====================================== */}

            <section className="detalhes-leitor-resumo">

                <article className="resumo-leitor-card">

                    <span>
                        Total de empréstimos
                    </span>

                    <strong>
                        {leitor.total_emprestimos ?? 0}
                    </strong>

                    <p>
                        Empréstimos registrados
                    </p>

                </article>


                <article className="resumo-leitor-card">

                    <span>
                        Total de devoluções
                    </span>

                    <strong>
                        {leitor.total_devolucoes ?? 0}
                    </strong>

                    <p>
                        Livros já devolvidos
                    </p>

                </article>


                <article className="resumo-leitor-card">

                    <span>
                        Próxima devolução
                    </span>

                    <strong className="resumo-leitor-data">

                        {leitor.proxima_devolucao
                            ? formatarData(
                                leitor.proxima_devolucao
                            )
                            : "—"
                        }

                    </strong>

                    <p>
                        Data prevista mais próxima
                    </p>

                </article>

            </section>


            {/* =====================================
                EMPRÉSTIMOS ATUAIS
            ====================================== */}

            <section className="detalhes-leitor-secao">

                <div className="detalhes-leitor-secao-topo">

                    <div>

                        <span>
                            Empréstimos
                        </span>

                        <h2>
                            Empréstimos atuais
                        </h2>

                    </div>


                    <strong>
                        {
                            leitor.emprestimos_atuais
                                ?.length ?? 0
                        }
                    </strong>

                </div>


                {leitor.emprestimos_atuais?.length > 0 ? (

                    <div className="detalhes-leitor-lista">

                        {leitor.emprestimos_atuais.map(
                            (emprestimo) => (

                            <article
                                className="emprestimo-leitor-card"
                                key={emprestimo.id}
                            >

                                <div className="emprestimo-leitor-livro">

                                    <div className="emprestimo-leitor-capa">

                                        {emprestimo.capa ? (

                                            <img
                                                src={
                                                    `${API_URL}/static/${emprestimo.capa}`
                                                }
                                                alt={`Capa de ${emprestimo.livro}`}
                                            />

                                        ) : (

                                            <span>
                                                📖
                                            </span>

                                        )}

                                    </div>


                                    <div>

                                        <span>
                                            Livro
                                        </span>

                                        <h3>
                                            {emprestimo.livro}
                                        </h3>

                                    </div>

                                </div>


                                <div className="emprestimo-leitor-data">

                                    <span>
                                        Emprestado em
                                    </span>

                                    <strong>
                                        {formatarData(
                                            emprestimo.data_emprestimo
                                        )}
                                    </strong>

                                </div>


                                <div className="emprestimo-leitor-data">

                                    <span>
                                        Devolução prevista
                                    </span>

                                    <strong>
                                        {formatarData(
                                            emprestimo.data_prevista_devolucao
                                        )}
                                    </strong>

                                </div>


                                <div className="emprestimo-leitor-status">

                                    <span
                                        className={
                                            emprestimo.status === "Atrasado"
                                                ? "status-leitor atrasado"
                                                : "status-leitor no-prazo"
                                        }
                                    >
                                        {emprestimo.status}
                                    </span>

                                </div>

                            </article>

                            )
                        )}

                    </div>

                ) : (

                    <div className="detalhes-leitor-vazio">

                        <h3>
                            Nenhum empréstimo atual
                        </h3>

                        <p>
                            Este leitor não possui
                            livros emprestados no momento.
                        </p>

                    </div>

                )}

            </section>


            {/* =====================================
                HISTÓRICO
            ====================================== */}

            <section className="detalhes-leitor-secao">

                <div className="detalhes-leitor-secao-topo">

                    <div>

                        <span>
                            Histórico
                        </span>

                        <h2>
                            Empréstimos anteriores
                        </h2>

                    </div>

                </div>


                {leitor.historico?.length > 0 ? (

                    <div className="historico-leitor">

                        <div className="historico-leitor-cabecalho">

                            <span>
                                Livro
                            </span>

                            <span>
                                Empréstimo
                            </span>

                            <span>
                                Devolução
                            </span>

                            <span>
                                Status
                            </span>

                        </div>


                        {leitor.historico.map(
                            (emprestimo) => (

                            <div
                                className="historico-leitor-linha"
                                key={emprestimo.id}
                            >

                                <div className="historico-leitor-livro">

                                    <div className="historico-leitor-capa">

                                        {emprestimo.capa ? (

                                            <img
                                                src={
                                                    `${API_URL}/static/${emprestimo.capa}`
                                                }
                                                alt=""
                                            />

                                        ) : (

                                            <span>
                                                📖
                                            </span>

                                        )}

                                    </div>


                                    <strong>
                                        {emprestimo.livro}
                                    </strong>

                                </div>


                                <span>
                                    {formatarData(
                                        emprestimo.data_emprestimo
                                    )}
                                </span>


                                <span>
                                    {formatarData(
                                        emprestimo.data_devolucao
                                    )}
                                </span>


                                <span className="status-leitor devolvido">
                                    Devolvido
                                </span>

                            </div>

                            )
                        )}

                    </div>

                ) : (

                    <div className="detalhes-leitor-vazio">

                        <h3>
                            Histórico vazio
                        </h3>

                        <p>
                            Nenhum empréstimo foi
                            devolvido por este leitor ainda.
                        </p>

                    </div>

                )}

            </section>

        </main>
    )
}


/* =========================================
   FUNÇÕES AUXILIARES
========================================= */

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

    if (!data) {
        return "Não informada"
    }


    const partes = data.split("-")

    if (partes.length !== 3) {
        return data
    }


    return (
        `${partes[2]}/${partes[1]}/${partes[0]}`
    )
}


export default DetalhesLeitor