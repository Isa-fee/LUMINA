import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom"

import Login from "./pages/Login"
import Cadastro from "./pages/Cadastro"
import Home from "./pages/Home"
import Livros from "./pages/Livros"
import CadastroLivro from "./pages/CadastroLivro"
import DetalhesLivro from "./pages/DetalhesLivro"
import EditarLivro from "./pages/EditarLivro"
import Leitores from "./pages/Leitores"
import CadastroLeitor from "./pages/CadastroLeitor"
import DetalhesLeitor from "./pages/DetalhesLeitor"

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

                </Route>

            </Routes>

        </BrowserRouter>
    )
}


export default App