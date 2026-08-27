import { Link, useNavigate } from "react-router-dom"

import "../styles/Header.css"


function Header() {

    const navigate = useNavigate()


    function logout() {

        localStorage.removeItem("token")

        navigate(
            "/login",
            { replace: true }
        )
    }


    return (
        <header className="header">

            <div className="header-conteudo">

                <Link
                    to="/home"
                    className="header-logo"
                >
                    <img
                        src="/images/logo.png"
                        alt="Lumina"
                    />
                </Link>


                <nav className="header-nav">

                    <Link to="/livros">
                        LIVROS
                    </Link>

                    <Link to="/emprestimos">
                        EMPRÉSTIMOS
                    </Link>

                    <Link to="/leitores">
                        LEITORES
                    </Link>

                    <button
                        type="button"
                        onClick={logout}
                        className="header-sair"
                    >
                        SAIR
                    </button>

                </nav>


                <div className="header-pesquisa">

                    <input
                        type="search"
                        aria-label="Pesquisar"
                    />

                    <span>
                        ⌕
                    </span>

                </div>

            </div>

        </header>
    )
}


export default Header