import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom"

import Login from "./pages/Login"
import Home from "./pages/Home"
import Livros from "./pages/Livros"
import CadastroLivro from "./pages/CadastroLivro"

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

                </Route>

            </Routes>

        </BrowserRouter>
    )
}


export default App