import { useEffect, useState } from 'react';

import { Link, useNavigate, useParams } from 'react-router-dom';

import {
    cadastrarLivro,
    buscarLivro,
    atualizarLivro,
} from '../services/livroService';

import { API_URL } from '../services/api';

import '../styles/CadastroLivro.css';

function LivroForm() {
    const { id } = useParams();

    const navigate = useNavigate();

    const modoEdicao = Boolean(id);

    const [formulario, setFormulario] = useState({
        titulo: '',
        autor: '',
        categoria: '',
        isbn: '',
        quantidade_total: 1,
        editora: '',
        ano_publicacao: '',
        edicao: '',
        numero_paginas: '',
        descricao: '',
    });

    const [capa, setCapa] = useState(null);

    const [preview, setPreview] = useState(null);

    const [capaAtual, setCapaAtual] = useState('');

    const [carregando, setCarregando] = useState(modoEdicao);

    const [erro, setErro] = useState('');

    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        if (!modoEdicao) {
            return;
        }

        async function carregarLivro() {
            try {
                setErro('');

                const livro = await buscarLivro(id);

                setFormulario({
                    titulo: livro.titulo || '',
                    autor: livro.autor || '',
                    categoria: livro.categoria || '',
                    isbn: livro.isbn || '',
                    quantidade_total: livro.quantidade_total || 1,
                    editora: livro.editora || '',
                    ano_publicacao: livro.ano_publicacao || '',
                    edicao: livro.edicao || '',
                    numero_paginas: livro.numero_paginas || '',
                    descricao: livro.descricao || '',
                });

                setCapaAtual(livro.capa || '');
            } catch (erro) {
                setErro(erro.message);
            } finally {
                setCarregando(false);
            }
        }

        carregarLivro();
    }, [id, modoEdicao]);

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    function alterarCampo(event) {
        const { name, value } = event.target;

        setFormulario((anterior) => ({
            ...anterior,
            [name]: value,
        }));
    }

    function selecionarCapa(event) {
        const arquivo = event.target.files[0];

        if (!arquivo) {
            return;
        }

        if (preview) {
            URL.revokeObjectURL(preview);
        }

        setCapa(arquivo);

        setPreview(URL.createObjectURL(arquivo));
    }

    async function enviarFormulario(event) {
        event.preventDefault();

        setErro('');
        setSalvando(true);

        try {
            if (modoEdicao) {
                await atualizarLivro(id, formulario);

                navigate(`/livros/${id}`);
            } else {
                await cadastrarLivro({
                    ...formulario,
                    capa,
                });

                navigate('/livros');
            }
        } catch (erro) {
            setErro(erro.message);
        } finally {
            setSalvando(false);
        }
    }

    if (carregando) {
        return (
            <main className="cadastro-livro-page">
                <div className="editar-estado">
                    Carregando livro...
                </div>
            </main>
        );
    }

    return (
        <main className="cadastro-livro-page">

            <div className="cadastro-livro-topo">
                <div>
                    <span className="cadastro-identificacao">
                        Acervo
                    </span>

                    <h1>
                        {modoEdicao
                            ? 'Editar livro'
                            : 'Cadastrar novo livro'}
                    </h1>

                    <p>
                        {modoEdicao
                            ? 'Atualize as informações cadastradas desta obra.'
                            : 'Adicione um novo título ao acervo da biblioteca.'}
                    </p>
                </div>

                <Link
                    to={
                        modoEdicao
                            ? `/livros/${id}`
                            : '/livros'
                    }
                    className="cadastro-voltar"
                >
                    ←{' '}
                    {modoEdicao
                        ? 'Voltar para os detalhes'
                        : 'Voltar para livros'}
                </Link>
            </div>

            {erro && (
                <div className="cadastro-livro-erro">
                    {erro}
                </div>
            )}

            <form
                className="cadastro-livro-form"
                onSubmit={enviarFormulario}
            >

                <section className="cadastro-capa">

                    <h2>
                        {modoEdicao
                            ? 'Capa do livro'
                            : 'Capa do livro'}
                    </h2>

                    {modoEdicao ? (
                        <>
                            <div className="upload-capa">
                                {capaAtual ? (
                                    <img
                                        src={`${API_URL}/static/${capaAtual}`}
                                        alt="Capa atual do livro"
                                    />
                                ) : (
                                    <div className="capa-placeholder">
                                        <span>📖</span>

                                        <strong>
                                            Sem capa cadastrada
                                        </strong>

                                        <small>
                                            A capa atual será mantida
                                        </small>
                                    </div>
                                )}
                            </div>

                            <small>
                                A capa cadastrada será mantida após a edição.
                            </small>
                        </>
                    ) : (
                        <>
                            <label
                                className="upload-capa"
                                htmlFor="capa"
                            >
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="Pré-visualização da capa"
                                    />
                                ) : (
                                    <div className="capa-placeholder">
                                        <span>+</span>

                                        <strong>
                                            Adicionar capa
                                        </strong>

                                        <small>
                                            JPG, PNG ou WEBP
                                        </small>
                                    </div>
                                )}
                            </label>

                            <input
                                id="capa"
                                type="file"
                                accept=".jpg,.jpeg,.png,.webp"
                                onChange={selecionarCapa}
                                hidden
                            />

                            {preview && (
                                <label
                                    htmlFor="capa"
                                    className="trocar-capa"
                                >
                                    Trocar imagem
                                </label>
                            )}
                        </>
                    )}

                </section>

                <section className="cadastro-dados">

                    <h2>Informações do livro</h2>

                    <div className="campo-livro campo-livro-grande">
                        <label htmlFor="titulo">
                            Título
                        </label>

                        <input
                            id="titulo"
                            name="titulo"
                            type="text"
                            placeholder="Digite o título do livro"
                            value={formulario.titulo}
                            onChange={alterarCampo}
                            required
                        />
                    </div>

                    <div className="campos-livro-linha">

                        <div className="campo-livro">
                            <label htmlFor="autor">
                                Autor
                            </label>

                            <input
                                id="autor"
                                name="autor"
                                type="text"
                                placeholder="Nome do autor"
                                value={formulario.autor}
                                onChange={alterarCampo}
                                required
                            />
                        </div>

                        <div className="campo-livro">
                            <label htmlFor="categoria">
                                Categoria
                            </label>

                            <input
                                id="categoria"
                                name="categoria"
                                type="text"
                                placeholder="Ex.: Fantasia"
                                value={formulario.categoria}
                                onChange={alterarCampo}
                                required
                            />
                        </div>

                    </div>

                    <div className="campos-livro-linha">

                        <div className="campo-livro">
                            <label htmlFor="isbn">
                                ISBN
                            </label>

                            <input
                                id="isbn"
                                name="isbn"
                                type="text"
                                placeholder="Digite o ISBN"
                                value={formulario.isbn}
                                onChange={alterarCampo}
                                required
                            />
                        </div>

                        <div className="campo-livro">
                            <label htmlFor="quantidade_total">
                                Quantidade
                            </label>

                            <input
                                id="quantidade_total"
                                name="quantidade_total"
                                type="number"
                                min="1"
                                value={formulario.quantidade_total}
                                onChange={alterarCampo}
                                required
                            />
                        </div>

                    </div>

                    <div className="campos-livro-linha">

                        <div className="campo-livro">
                            <label htmlFor="editora">
                                Editora
                            </label>

                            <input
                                id="editora"
                                name="editora"
                                type="text"
                                placeholder="Ex.: Galera Record"
                                value={formulario.editora}
                                onChange={alterarCampo}
                            />
                        </div>

                        <div className="campo-livro">
                            <label htmlFor="ano_publicacao">
                                Ano de publicação
                            </label>

                            <input
                                id="ano_publicacao"
                                name="ano_publicacao"
                                type="number"
                                min="1"
                                placeholder="Ex.: 2013"
                                value={formulario.ano_publicacao}
                                onChange={alterarCampo}
                            />
                        </div>

                    </div>

                    <div className="campos-livro-linha">

                        <div className="campo-livro">
                            <label htmlFor="edicao">
                                Edição
                            </label>

                            <input
                                id="edicao"
                                name="edicao"
                                type="text"
                                placeholder="Ex.: 1ª edição"
                                value={formulario.edicao}
                                onChange={alterarCampo}
                            />
                        </div>

                        <div className="campo-livro">
                            <label htmlFor="numero_paginas">
                                Número de páginas
                            </label>

                            <input
                                id="numero_paginas"
                                name="numero_paginas"
                                type="number"
                                min="1"
                                placeholder="Ex.: 392"
                                value={formulario.numero_paginas}
                                onChange={alterarCampo}
                            />
                        </div>

                    </div>

                    <div className="campo-livro campo-livro-grande">
                        <label htmlFor="descricao">
                            Descrição / Sinopse
                        </label>

                        <textarea
                            id="descricao"
                            name="descricao"
                            placeholder="Digite uma breve descrição da obra"
                            value={formulario.descricao}
                            onChange={alterarCampo}
                            rows="5"
                        />
                    </div>

                    <div className="cadastro-livro-acoes">

                        <Link
                            to={
                                modoEdicao
                                    ? `/livros/${id}`
                                    : '/livros'
                            }
                            className="btn-cancelar-cadastro"
                        >
                            Cancelar
                        </Link>

                        <button
                            type="submit"
                            className="btn-salvar-livro"
                            disabled={salvando}
                        >
                            {salvando
                                ? 'Salvando...'
                                : modoEdicao
                                    ? 'Salvar alterações'
                                    : 'Cadastrar livro'}
                        </button>

                    </div>

                </section>

            </form>

        </main>
    );
}

export default LivroForm;