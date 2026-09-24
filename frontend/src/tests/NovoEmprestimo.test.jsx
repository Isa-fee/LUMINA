import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
    render,
    screen,
    fireEvent,
    waitFor,
    within,
} from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom';

import NovoEmprestimo from '../pages/NovoEmprestimo';

import { listarLeitores } from '../services/leitorService';
import { listarLivros } from '../services/livroService';
import { cadastrarEmprestimo } from '../services/emprestimoService';

// Simular os serviços, sem acessar o backend.

vi.mock('../services/leitorService', () => ({
    listarLeitores: vi.fn(),
}));

vi.mock('../services/livroService', () => ({
    listarLivros: vi.fn(),
}));

vi.mock('../services/emprestimoService', () => ({
    cadastrarEmprestimo: vi.fn(),
}));

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const original = await vi.importActual('react-router-dom');

    return {
        ...original,
        useNavigate: () => mockNavigate,
    };
});

// Dados fictícios para os testes.

const leitores = [
    {
        id: 1,
        nome: 'Ana Silva',
        email: 'ana@exemplo.com',
        foto: null,
    },
    {
        id: 2,
        nome: 'Pedro Oliveira',
        email: 'pedro@exemplo.com',
        foto: null,
    },
];

const livros = [
    {
        id: 10,
        titulo: 'Dom Casmurro',
        autor: 'Machado de Assis',
        isbn: '9788535914849',
        quantidade_disponivel: 2,
        capa: null,
    },
    {
        id: 20,
        titulo: 'O Cortiço',
        autor: 'Aluísio Azevedo',
        isbn: '9788525406958',
        quantidade_disponivel: 1,
        capa: null,
    },
    {
        id: 30,
        titulo: 'Livro Indisponível',
        autor: 'Autor Exemplo',
        isbn: '0000000000000',
        quantidade_disponivel: 0,
        capa: null,
    },
];

function renderizarEmprestimo(rota = '/emprestimos/novo') {
    return render(
        <MemoryRouter initialEntries={[rota]}>
            <NovoEmprestimo />
        </MemoryRouter>,
    );
}

async function aguardarCarregamento() {
    return screen.findByRole('heading', {
        name: /novo empréstimo/i,
    });
}

async function selecionarLeitor(nome = 'Ana Silva') {
    fireEvent.click(
        await screen.findByRole('button', {
            name: new RegExp(nome, 'i'),
        }),
    );
}

async function selecionarLivro(titulo = 'Dom Casmurro') {
    fireEvent.click(
        await screen.findByRole('button', {
            name: new RegExp(titulo, 'i'),
        }),
    );
}

function botaoConfirmar() {
    return screen.getByRole('button', {
        name: /confirmar empréstimo/i,
    });
}

describe('Testes de novo empréstimo', () => {
    beforeEach(() => {
        vi.resetAllMocks();

        listarLeitores.mockResolvedValue(leitores);
        listarLivros.mockResolvedValue(livros);
    });

    // TESTE 1
    it('deve carregar leitores e livros', async () => {
        renderizarEmprestimo();

        await aguardarCarregamento();

        expect(listarLeitores).toHaveBeenCalled();
        expect(listarLivros).toHaveBeenCalled();

        expect(
            screen.getByRole('button', {
                name: /Ana Silva/i,
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole('button', {
                name: /Dom Casmurro/i,
            }),
        ).toBeInTheDocument();
    });

    // TESTE 2
    it('deve exibir o prazo de devolução', async () => {
        renderizarEmprestimo();

        await aguardarCarregamento();

        expect(screen.getByText('Data do empréstimo')).toBeInTheDocument();

        expect(screen.getByText('Devolução prevista')).toBeInTheDocument();

        const hoje = new Date();
        const devolucao = new Date();

        devolucao.setDate(devolucao.getDate() + 5);

        const datas = document.querySelector('.emprestimo-datas');

        expect(datas).toHaveTextContent(hoje.toLocaleDateString('pt-BR'));

        expect(datas).toHaveTextContent(devolucao.toLocaleDateString('pt-BR'));
    });

    // TESTE 3
    it('deve pesquisar leitores por nome ou e-mail', async () => {
        renderizarEmprestimo();

        await aguardarCarregamento();

        const busca = screen.getByPlaceholderText(
            /buscar leitor por nome ou e-mail/i,
        );

        fireEvent.change(busca, {
            target: { value: 'PEDRO' },
        });

        expect(
            screen.getByRole('button', {
                name: /Pedro Oliveira/i,
            }),
        ).toBeInTheDocument();

        expect(
            screen.queryByRole('button', {
                name: /Ana Silva/i,
            }),
        ).not.toBeInTheDocument();

        fireEvent.change(busca, {
            target: { value: 'ana@exemplo.com' },
        });

        expect(
            screen.getByRole('button', {
                name: /Ana Silva/i,
            }),
        ).toBeInTheDocument();
    });

    // TESTE 4
    it('deve pesquisar livros por título, autor ou ISBN', async () => {
        renderizarEmprestimo();

        await aguardarCarregamento();

        const busca = screen.getByPlaceholderText(
            /buscar livro por título, autor ou ISBN/i,
        );

        fireEvent.change(busca, {
            target: { value: 'CORTIÇO' },
        });

        expect(
            screen.getByRole('button', {
                name: /O Cortiço/i,
            }),
        ).toBeInTheDocument();

        fireEvent.change(busca, {
            target: { value: 'Machado' },
        });

        expect(
            screen.getByRole('button', {
                name: /Dom Casmurro/i,
            }),
        ).toBeInTheDocument();

        fireEvent.change(busca, {
            target: { value: '9788525406958' },
        });

        expect(
            screen.getByRole('button', {
                name: /O Cortiço/i,
            }),
        ).toBeInTheDocument();
    });

    // TESTE 5
    it('não deve permitir selecionar livros indisponíveis', async () => {
        renderizarEmprestimo();

        await aguardarCarregamento();

        expect(
            screen.queryByRole('button', {
                name: /Livro Indisponível/i,
            }),
        ).not.toBeInTheDocument();

        const busca = screen.getByPlaceholderText(
            /buscar livro por título, autor ou ISBN/i,
        );

        fireEvent.change(busca, {
            target: { value: 'Livro Indisponível' },
        });

        expect(
            screen.getByText('Nenhum livro disponível encontrado.'),
        ).toBeInTheDocument();
    });

    // TESTE 6
    it('deve exigir a seleção do leitor e do livro', async () => {
        renderizarEmprestimo();

        await aguardarCarregamento();

        expect(botaoConfirmar()).toBeDisabled();

        await selecionarLeitor();

        expect(botaoConfirmar()).toBeDisabled();

        await selecionarLivro();

        expect(botaoConfirmar()).toBeEnabled();
    });

    // TESTE 7
    it('deve permitir alterar as seleções', async () => {
        renderizarEmprestimo();

        await aguardarCarregamento();

        await selecionarLeitor();
        await selecionarLivro();

        const botoesAlterar = screen.getAllByRole('button', {
            name: /alterar/i,
        });

        fireEvent.click(botoesAlterar[0]);

        await selecionarLeitor('Pedro Oliveira');

        const selecionados = document.querySelectorAll(
            '.emprestimo-selecionado',
        );

        expect(
            within(selecionados[0]).getByText('Pedro Oliveira'),
        ).toBeInTheDocument();

        fireEvent.click(
            screen.getAllByRole('button', {
                name: /alterar/i,
            })[1],
        );

        await selecionarLivro('O Cortiço');

        expect(screen.getByText('Livro selecionado')).toBeInTheDocument();

        expect(botaoConfirmar()).toBeEnabled();
    });

    // TESTE 8
    it('deve selecionar automaticamente o livro pela URL', async () => {
        renderizarEmprestimo('/emprestimos/novo?livro=10');

        await aguardarCarregamento();

        expect(screen.getByText('Livro selecionado')).toBeInTheDocument();

        const livroSelecionado = document.querySelector('.livro-selecionado');

        expect(
            within(livroSelecionado).getByText('Dom Casmurro'),
        ).toBeInTheDocument();

        expect(botaoConfirmar()).toBeDisabled();

        await selecionarLeitor();

        expect(botaoConfirmar()).toBeEnabled();
    });

    // TESTE 9
    it('deve registrar o empréstimo e redirecionar', async () => {
        let concluirCadastro;

        cadastrarEmprestimo.mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    concluirCadastro = resolve;
                }),
        );

        renderizarEmprestimo();

        await aguardarCarregamento();

        await selecionarLeitor();
        await selecionarLivro();

        fireEvent.click(botaoConfirmar());

        expect(cadastrarEmprestimo).toHaveBeenCalledWith({
            leitor_id: 1,
            livro_id: 10,
        });

        expect(
            screen.getByRole('button', {
                name: /registrando/i,
            }),
        ).toBeDisabled();

        concluirCadastro({ id: 100 });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/emprestimos');
        });
    });

    // TESTE 10
    it('deve exibir erros de carregamento e cadastro', async () => {
        listarLeitores.mockRejectedValueOnce(
            new Error('Erro ao carregar leitores'),
        );

        renderizarEmprestimo();

        expect(
            await screen.findByText('Erro ao carregar leitores'),
        ).toBeInTheDocument();

        // O erro de cadastro será verificado
        // em uma nova renderização.
    });

    // TESTE 11
    it('deve mostrar erro quando o registro falhar', async () => {
        cadastrarEmprestimo.mockRejectedValueOnce(
            new Error('Não foi possível registrar o empréstimo'),
        );

        renderizarEmprestimo();

        await aguardarCarregamento();

        await selecionarLeitor();
        await selecionarLivro();

        fireEvent.click(botaoConfirmar());

        expect(
            await screen.findByText('Não foi possível registrar o empréstimo'),
        ).toBeInTheDocument();

        expect(mockNavigate).not.toHaveBeenCalled();

        expect(botaoConfirmar()).toBeEnabled();
    });
});
