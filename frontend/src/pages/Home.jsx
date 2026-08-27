import {
    useEffect,
    useState
} from "react"

import { useNavigate } from "react-router-dom"

import { apiFetch } from "../services/api"


function Home() {

    const [usuario, setUsuario] = useState(null)
    const [carregando, setCarregando] = useState(true)

    const navigate = useNavigate()


    useEffect(() => {

        async function carregarUsuario() {

            try {

                const response = await apiFetch(
                    "/api/auth/me"
                )

                if (!response.ok) {

                    localStorage.removeItem("token")

                    navigate(
                        "/login",
                        { replace: true }
                    )

                    return
                }

                const dados = await response.json()

                setUsuario(dados)

            } catch (erro) {

                console.error(
                    "Erro ao carregar usuário:",
                    erro
                )

            } finally {

                setCarregando(false)
            }
        }

        carregarUsuario()

    }, [navigate])


    function logout() {

        localStorage.removeItem("token")

        navigate(
            "/login",
            { replace: true }
        )
    }


    if (carregando) {
        return <p>Carregando...</p>
    }


    return (
        <main>

            <h1>Lumina</h1>

            {usuario && (
                <>
                    <h2>
                        Olá, {usuario.nome}!
                    </h2>

                    <p>
                        {usuario.email}
                    </p>
                </>
            )}

            <button onClick={logout}>
                Sair
            </button>

        </main>
    )
}


export default Home