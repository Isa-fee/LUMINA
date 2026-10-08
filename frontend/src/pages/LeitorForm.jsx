import { useEffect, useState } from 'react';

import { Link, useNavigate, useParams } from 'react-router-dom';

import {
    cadastrarLeitor,
    buscarLeitor,
    editarLeitor,
} from '../services/leitorService';

import { API_URL } from '../services/api';

import '../styles/CadastroLeitor.css';

function LeitorForm() {
    const { id } = useParams();

    const navigate = useNavigate();

    const modoEdicao = Boolean(id);

    const [formulario, setFormulario] = useState({
        nome: '',
        email: '',
        telefone: '',
        endereco: '',
        foto: null,
    });

    const [fotoAtual, setFotoAtual] = useState(null);

    const [previewFoto, setPreviewFoto] = useState(null);

    const [carregando, setCarregando] = useState(modoEdicao);

    const [salvando, setSalvando] = useState(false);

    const [erro, setErro] = useState('');

    useEffect(() => {
        if (!modoEdicao) {
            return;
        }

        async function carregarLeitor() {
            try {
                setErro('');

                const leitor = await buscarLeitor(id);

                setFormulario({
                    nome: leitor.nome || '',
                    email: leitor.email || '',
                    telefone: leitor.telefone || '',
                    endereco: leitor.endereco || '',
                    foto: null,
                });

                setFotoAtual(leitor.foto || null);
            } catch (erro) {
                setErro(erro.message);
            } finally {
                setCarregando(false);
            }
        }

        carregarLeitor();
    }, [id, modoEdicao]);

    useEffect(() => {
        return () => {
            if (previewFoto) {
                URL.revokeObjectURL(previewFoto);
            }
        };
    }, [previewFoto]);

    function alterarCampo(event) {
        const { name, value } = event.target;

        setFormulario((anterior) => ({
            ...anterior,
            [name]: value,
        }));
    }

    function alterarFoto(event) {
        const arquivo = event.target.files[0];

        if (!arquivo) {
            return;
        }

        if (previewFoto) {
            URL.revokeObjectURL(previewFoto);
        }

        setFormulario((anterior) => ({
            ...anterior,
            foto: arquivo,
        }));

        setPreviewFoto(URL.createObjectURL(arquivo));
    }

    async function enviarFormulario(event) {
        event.preventDefault();

        setErro('');
        setSalvando(true);

        try {
            if (modoEdicao) {
                await editarLeitor(id, formulario);

                navigate(`/leitores/${id}`);
            } else {
                await cadastrarLeitor(formulario);

                navigate('/leitores');
            }
        } catch (erro) {
            setErro(erro.message);
        } finally {
            setSalvando(false);
        }
    }

    if (carregando) {
        return (
            <main className="cadastro-leitor-page">
                <div className="leitores-estado">
                    Carregando leitor...
                </div>
            </main>
        );
    }

    return (
        <main className="cadastro-leitor-page">

            <section className="cadastro-leitor-cabecalho">

                <span>Leitores</span>

                <h1>
                    {modoEdicao
                        ? 'Editar leitor'
                        : 'Cadastrar leitor'}
                </h1>

                <p>
                    {modoEdicao
                        ? 'Atualize as informações do leitor.'
                        : 'Adicione um novo leitor à biblioteca.'}
                </p>

            </section>

            <Link
                to={
                    modoEdicao
                        ? `/leitores/${id}`
                        : '/leitores'
                }
                className="cadastro-leitor-voltar"
            >
                <span>←</span>

                {modoEdicao
                    ? 'Voltar para detalhes'
                    : 'Voltar para leitores'}
            </Link>

            {erro && (
                <div className="cadastro-leitor-erro">
                    {erro}
                </div>
            )}

            <section className="cadastro-leitor-card">

                <div className="cadastro-leitor-ilustracao">

                    <label
                        htmlFor="foto"
                        className="cadastro-leitor-foto"
                    >

                        {previewFoto ? (
                            <img
                                src={previewFoto}
                                alt="Prévia da foto do leitor"
                            />
                        ) : fotoAtual ? (
                            <img
                                src={`${API_URL}/static/${fotoAtual}`}
                                alt={`Foto de ${formulario.nome}`}
                            />
                        ) : (
                            <div className="cadastro-leitor-sem-foto">
                                <span>
                                    {obterInicial(formulario.nome)}
                                </span>
                            </div>
                        )}

                        <span className="cadastro-leitor-foto-acao">
                            {modoEdicao
                                ? 'Alterar foto'
                                : 'Escolher foto'}
                        </span>

                    </label>

                    <input
                        id="foto"
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={alterarFoto}
                        className="cadastro-leitor-input-foto"
                    />

                    <h2>
                        {modoEdicao
                            ? formulario.nome
                            : 'Novo leitor'}
                    </h2>

                    <p>
                        {modoEdicao
                            ? 'Atualize os dados pessoais do leitor sempre que necessário.'
                            : 'Cadastre as informações básicas do leitor para que ele possa realizar empréstimos na biblioteca.'}
                    </p>

                </div>

                <form
                    className="cadastro-leitor-formulario"
                    onSubmit={enviarFormulario}
                >

                    <div className="cadastro-leitor-form-topo">

                        <span>Informações pessoais</span>

                        <h2>Dados do leitor</h2>

                        <p>
                            {modoEdicao
                                ? 'Altere os campos desejados e salve as modificações.'
                                : 'Preencha os campos abaixo para realizar o cadastro.'}
                        </p>

                    </div>

                    <div className="cadastro-leitor-campos">

                        <div className="cadastro-leitor-campo">

                            <label htmlFor="nome">
                                Nome completo
                            </label>

                            <input
                                id="nome"
                                name="nome"
                                type="text"
                                placeholder="Digite o nome do leitor"
                                value={formulario.nome}
                                onChange={alterarCampo}
                                required
                            />

                        </div>

                        <div className="cadastro-leitor-campo">

                            <label htmlFor="email">
                                E-mail
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="exemplo@email.com"
                                value={formulario.email}
                                onChange={alterarCampo}
                                required
                            />

                        </div>

                        <div className="cadastro-leitor-campo-linha">

                            <div className="cadastro-leitor-campo">

                                <label htmlFor="telefone">
                                    Telefone
                                </label>

                                <input
                                    id="telefone"
                                    name="telefone"
                                    type="tel"
                                    placeholder="(00) 00000-0000"
                                    value={formulario.telefone}
                                    onChange={alterarCampo}
                                />

                            </div>

                            <div className="cadastro-leitor-campo">

                                <label htmlFor="endereco">
                                    Endereço
                                </label>

                                <input
                                    id="endereco"
                                    name="endereco"
                                    type="text"
                                    placeholder="Digite o endereço"
                                    value={formulario.endereco}
                                    onChange={alterarCampo}
                                />

                            </div>

                        </div>

                    </div>

                    <div className="cadastro-leitor-acoes">

                        <Link
                            to={
                                modoEdicao
                                    ? `/leitores/${id}`
                                    : '/leitores'
                            }
                            className="btn-cancelar-leitor"
                        >
                            Cancelar
                        </Link>

                        <button
                            type="submit"
                            className="btn-cadastrar-leitor"
                            disabled={salvando}
                        >
                            {salvando
                                ? 'Salvando...'
                                : modoEdicao
                                    ? 'Salvar alterações'
                                    : 'Cadastrar leitor'}
                        </button>

                    </div>

                </form>

            </section>

        </main>
    );
}

function obterInicial(nome) {
    if (!nome) {
        return 'L';
    }

    return nome.trim().charAt(0).toUpperCase();
}

export default LeitorForm;