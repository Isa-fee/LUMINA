import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import RecuperarSenha from './pages/Recuperarsenha';
import Home from './pages/Home';
import Livros from './pages/Livros';
import LivroForm from './pages/LivroForm';
import DetalhesLivro from './pages/DetalhesLivro';
import Emprestimos from './pages/Emprestimos';
import NovoEmprestimo from './pages/NovoEmprestimo';
import EditarEmprestimo from './pages/EditarEmprestimo';
import Leitores from './pages/Leitores';
import LeitorForm from './pages/LeitorForm';
import DetalhesLeitor from './pages/DetalhesLeitor';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route path="/login" element={<Login />} />

                <Route path="/cadastro" element={<Cadastro />} />

                <Route path="/recuperar-senha" element={<RecuperarSenha />} />

                <Route
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/home" element={<Home />} />

                    <Route path="/livros" element={<Livros />} />

                    <Route path="/livros/novo" element={<LivroForm />} />

                    <Route path="/livros/:id" element={<DetalhesLivro />} />

                    <Route path="/livros/:id/editar" element={<LivroForm />} />

                    <Route path="/emprestimos" element={<Emprestimos />} />
                    <Route
                        path="/emprestimos/novo"
                        element={<NovoEmprestimo />}
                    />
                    <Route
                        path="/emprestimos/:id/editar"
                        element={<EditarEmprestimo />}
                    />
                    <Route path="/leitores" element={<Leitores />} />

                    <Route path="/leitores/novo" element={<LeitorForm />} />

                    <Route path="/leitores/:id" element={<DetalhesLeitor />} />

                    <Route path="/leitores/:id/editar" element={<LeitorForm />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
