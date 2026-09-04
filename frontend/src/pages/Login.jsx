import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { login } from "../services/authService"

import "../styles/Login.css"


function Login() {

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

            await login(
                email,
                senha
            )

            navigate(
                "/home",
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

            <section className="login-identidade">

                <img
                    src="/images/logo-lumina.png"
                    alt="Lumina"
                    className="login-logo"
                />

            </section>


            <section className="login-area">

                <div className="login-card">

                    <h1>FAÇA LOGIN</h1>

                    <form onSubmit={handleSubmit}>

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


                        <div className="login-campo">

                            <label htmlFor="senha">
                                SENHA
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

                        <div className="login-esqueceu">
                            <Link to="/recuperar-senha">
                                Esqueceu sua senha?
                            </Link>
                        </div>

                        {mensagem && (
                            <p className="login-erro">
                                {mensagem}
                            </p>
                        )}


                        <button
                            type="submit"
                            disabled={carregando}
                        >
                            {carregando
                                ? "ENTRANDO..."
                                : "ENTRAR"
                            }
                        </button>

                    </form>


                    <p className="login-cadastro">
                        Não possui conta?{" "}

                        <Link to="/cadastro">
                            Cadastre-se
                        </Link>
                    </p>

                </div>

            </section>

        </main>
    )
}


export default Login