import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom"

import Login from "./pages/Login"
import Cadastro from "./pages/Cadastro"
import RecuperarSenha from "./pages/Recuperarsenha"
import Home from "./pages/Home"
import Livros from "./pages/Livros"
import CadastroLivro from "./pages/CadastroLivro"
import DetalhesLivro from "./pages/DetalhesLivro"
import EditarLivro from "./pages/EditarLivro"
import Emprestimos from "./pages/Emprestimos"
import NovoEmprestimo from "./pages/NovoEmprestimo"
import EditarEmprestimo from "./pages/EditarEmprestimo"
import Leitores from "./pages/Leitores"
import CadastroLeitor from "./pages/CadastroLeitor"
import DetalhesLeitor from "./pages/DetalhesLeitor"
import EditarLeitor from "./pages/EditarLeitor"

import Layout from "./components/Layout"


function App() {

    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />


                <Route
                    path="/login"
                    element={<Login />}
                />
                
                <Route
                    path="/cadastro"
                    element={<Cadastro />}
                />

                <Route
                    path="/recuperar-senha"
                    element={<RecuperarSenha />}
                />

                <Route element={<Layout />}>

                    <Route
                        path="/home"
                        element={<Home />}
                    />

                    <Route
                        path="/livros"
                        element={<Livros />}
                    />

                    <Route
                        path="/livros/novo"
                        element={<CadastroLivro />}
                    />

                    <Route
                        path="/livros/:id"
                        element={<DetalhesLivro />}
                    />

                    <Route
                        path="/livros/:id/editar"
                        element={<EditarLivro />}
                    />
                    
                    <Route
                        path="/emprestimos"
                        element={<Emprestimos />}
                    />
                    <Route
                        path="/emprestimos/novo"
                        element={<NovoEmprestimo />}
                    />
                    <Route
                        path="/emprestimos/:id/editar"
                        element={<EditarEmprestimo />}
                    />
                    <Route
                        path="/leitores"
                        element={<Leitores />}
                    />

                    <Route
                        path="/leitores/novo"
                        element={<CadastroLeitor />}
                    />

                    <Route
                        path="/leitores/:id"
                        element={<DetalhesLeitor />}
                    />
                    
                    <Route
                        path="/leitores/:id/editar"
                        element={<EditarLeitor />}
                    />

                </Route>

            </Routes>

        </BrowserRouter>
    )
}


export default App