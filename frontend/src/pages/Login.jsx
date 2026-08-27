import { useState } from "react"

import { useNavigate } from "react-router-dom"

import { login } from "../services/authService"


function Login() {

    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [mensagem, setMensagem] = useState("")

    const navigate = useNavigate()

    async function handleSubmit(event) {

        event.preventDefault()

        setMensagem("Entrando...")

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
        }
    }


    return (
        <main>

            <h1>Lumina</h1>

            <h2>Entrar</h2>

            <form onSubmit={handleSubmit}>

                <div>
                    <label htmlFor="email">
                        E-mail
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

                <div>
                    <label htmlFor="senha">
                        Senha
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

                <button type="submit">
                    Entrar
                </button>

            </form>

            {mensagem && (
                <p>{mensagem}</p>
            )}

        </main>
    )
}


export default Login