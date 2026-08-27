import {
    useEffect,
    useState
} from "react"

import {
    Link,
    useNavigate
} from "react-router-dom"


import { apiFetch } from "../services/api"
import { carregarResumoHome } from "../services/homeService"

import "../styles/Home.css"


function Home() {

    const [usuario, setUsuario] = useState(null)

    const [resumo, setResumo] = useState({
        livros: 0,
        emprestimos: 0,
        leitores: 0,
        atrasados: 0
    })

    const [carregando, setCarregando] = useState(true)

    const navigate = useNavigate()


    useEffect(() => {

        async function carregarHome() {

            try {

                const usuarioResponse = await apiFetch(
                    "/api/auth/me"
                )


                if (!usuarioResponse.ok) {

                    localStorage.removeItem("token")

                    navigate(
                        "/login",
                        { replace: true }
                    )

                    return
                }


                const dadosUsuario =
                    await usuarioResponse.json()

                setUsuario(dadosUsuario)


                const dadosResumo =
                    await carregarResumoHome()

                setResumo(dadosResumo)

            } catch (erro) {

                console.error(
                    "Erro ao carregar Home:",
                    erro
                )

            } finally {

                setCarregando(false)
            }
        }


        carregarHome()

    }, [navigate])


    if (carregando) {

        return (
            <div className="home-carregando">
                Carregando...
            </div>
        )
    }


    return (
        <div className="home-layout">

            


            <main className="home-main">

                <section className="home-boas-vindas">

                    <div>

                        <h1>
                            Bem-vinda(o), {usuario?.nome}!
                        </h1>

                        <p>
                            Gerencie seu acervo e acompanhe
                            os empréstimos da biblioteca.
                        </p>

                    </div>


                    <img
                        src="/images/home-raposa.png"
                        alt=""
                        className="home-raposa"
                    />

                </section>


                <TituloSecao>
                    Resumo do sistema
                </TituloSecao>


                <section className="resumo-grid">

                    <ResumoCard
                        imagem="/images/icone-livros.png"
                        numero={resumo.livros}
                        texto="Livros Cadastrados"
                    />

                    <ResumoCard
                        imagem="/images/icone-emprestimos.png"
                        numero={resumo.emprestimos}
                        texto="Empréstimos Ativos"
                    />

                    <ResumoCard
                        imagem="/images/icone-leitores.png"
                        numero={resumo.leitores}
                        texto="Leitores Registrados"
                    />

                    <ResumoCard
                        imagem="/images/icone-atrasados.png"
                        numero={resumo.atrasados}
                        texto="Empréstimos Atrasados"
                    />

                </section>


                <TituloSecao>
                    Acesso rápido
                </TituloSecao>


                <section className="acesso-rapido">

                    <Atalho
                        to="/livros"
                        imagem="/images/atalho-livros.png"
                        texto="Livros Cadastrados"
                    />

                    <Atalho
                        to="/emprestimos"
                        imagem="/images/atalho-emprestimos.png"
                        texto="Empréstimos Ativos"
                    />

                    <Atalho
                        to="/leitores"
                        imagem="/images/atalho-leitores.png"
                        texto="Leitores Registrados"
                    />

                </section>


                <div className="home-divisor" />


                <section className="acoes-home">

                    <AcaoHome
                        to="/livros/novo"
                        imagem="/images/cadastrar-livro.png"
                        titulo="Cadastrar novo livro"
                        descricao="Adicione um novo livro ao acervo da biblioteca"
                    />

                    <AcaoHome
                        to="/leitores/novo"
                        imagem="/images/cadastrar-leitor.png"
                        titulo="Cadastrar novo leitor"
                        descricao="Adicione um novo leitor ao sistema"
                    />

                </section>

            </main>


            

        </div>
    )
}


function TituloSecao({ children }) {

    return (
        <div className="titulo-secao">

            <span>{children}</span>

            <div />

        </div>
    )
}


function ResumoCard({
    imagem,
    numero,
    texto
}) {

    return (
        <article className="resumo-card">

            <img
                src={imagem}
                alt=""
            />

            <div>
                <strong>{numero}</strong>
                <span>{texto}</span>
            </div>

        </article>
    )
}


function Atalho({
    to,
    imagem,
    texto
}) {

    return (
        <Link
            to={to}
            className="atalho-card"
        >

            <img
                src={imagem}
                alt=""
            />

            <span>{texto}</span>

        </Link>
    )
}


function AcaoHome({
    to,
    imagem,
    titulo,
    descricao
}) {

    return (
        <Link
            to={to}
            className="acao-home-card"
        >

            <div>

                <img
                    src={imagem}
                    alt=""
                />

                <strong>
                    {titulo}
                </strong>

                <p>
                    {descricao}
                </p>

            </div>

            <span className="acao-seta">
                →
            </span>

        </Link>
    )
}


export default Home