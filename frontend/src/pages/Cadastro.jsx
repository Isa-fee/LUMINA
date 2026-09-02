import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { cadastrar } from "../services/authService"

import "../styles/Login.css"


function Cadastro() {

    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")

    const [mensagem, setMensagem] = useState("")
    const [carregando, setCarregando] = useState(false)

    const navigate = useNavigate()


    async function handleSubmit(event) {

        event.preventDefault()

        setMensagem("")
        setCarregando(true)

        try {

            await cadastrar(
                nome,
                email,
                senha
            )

            navigate(
                "/login",
                { replace: true }
            )

        } catch (erro) {

            setMensagem(
                erro.message
            )

        } finally {

            setCarregando(false)
        }
    }


    return (

        <main className="login-page">

            {/* ========================================
                IDENTIDADE DO LUMINA
            ======================================== */}

            <section className="login-identidade">

                <img
                    src="/images/logo-lumina.png"
                    alt="Lumina"
                    className="login-logo"
                />

            </section>


            {/* ========================================
                ÁREA DE CADASTRO
            ======================================== */}

            <section className="login-area">

                <div className="login-card">

                    <h1>FAÇA SEU CADASTRO</h1>


                    <form onSubmit={handleSubmit}>

                        {/* NOME */}

                        <div className="login-campo">

                            <label htmlFor="nome">
                                NOME
                            </label>

                            <input
                                id="nome"
                                type="text"
                                value={nome}
                                onChange={
                                    (event) =>
                                        setNome(
                                            event.target.value
                                        )
                                }
                                required
                            />

                        </div>


                        {/* E-MAIL */}

                        <div className="login-campo">

                            <label htmlFor="email">
                                E-MAIL
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={
                                    (event) =>
                                        setEmail(
                                            event.target.value
                                        )
                                }
                                required
                            />

                        </div>


                        {/* SENHA */}

                        <div className="login-campo">

                            <label htmlFor="senha">
                                CRIE UMA SENHA
                            </label>

                            <input
                                id="senha"
                                type="password"
                                value={senha}
                                onChange={
                                    (event) =>
                                        setSenha(
                                            event.target.value
                                        )
                                }
                                required
                            />

                        </div>


                        {/* ERRO */}

                        {mensagem && (

                            <p className="login-erro">
                                {mensagem}
                            </p>

                        )}


                        {/* BOTÃO */}

                        <button
                            type="submit"
                            disabled={carregando}
                        >

                            {
                                carregando
                                    ? "CADASTRANDO..."
                                    : "CADASTRAR"
                            }

                        </button>

                    </form>


                    {/* LOGIN */}

                    <p className="login-cadastro">

                        Já possui uma conta?{" "}

                        <Link to="/login">
                            Entrar
                        </Link>

                    </p>

                </div>

            </section>

        </main>
    )
}


export default Cadastro