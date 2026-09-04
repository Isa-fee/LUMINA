import { useState } from "react"
import { Link } from "react-router-dom"

import "../styles/RecuperarSenha.css"


function RecuperarSenha() {

    const [email, setEmail] = useState("")
    const [mensagem, setMensagem] = useState("")
    const [carregando, setCarregando] = useState(false)


    async function handleSubmit(event) {

        event.preventDefault()

        setMensagem("")
        setCarregando(true)

        try {

            /*
                Depois vamos chamar o back-end aqui.

                Exemplo futuro:

                await solicitarRecuperacao(email)
            */

            console.log(
                "Solicitar recuperação para:",
                email
            )

            setMensagem(
                "Se este e-mail estiver cadastrado, você receberá as instruções para recuperar sua senha."
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
        <main className="recuperar-page">

            <section className="recuperar-identidade">

                <img
                    src="/images/logo-lumina.png"
                    alt="Lumina"
                    className="recuperar-logo"
                />

            </section>


            <section className="recuperar-area">

                <div className="recuperar-card">

                    <h1>
                        RECUPERAR SENHA
                    </h1>

                    <p className="recuperar-descricao">
                        Informe o e-mail cadastrado na sua conta
                        para receber as instruções de recuperação.
                    </p>


                    <form onSubmit={handleSubmit}>

                        <div className="recuperar-campo">

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


                        {mensagem && (

                            <p className="recuperar-mensagem">
                                {mensagem}
                            </p>

                        )}


                        <button
                            type="submit"
                            disabled={carregando}
                        >
                            {
                                carregando
                                    ? "ENVIANDO..."
                                    : "ENVIAR"
                            }
                        </button>

                    </form>


                    <p className="recuperar-voltar">

                        <Link to="/login">
                            ← Voltar para o login
                        </Link>

                    </p>

                </div>

            </section>

        </main>
    )
}


export default RecuperarSenha