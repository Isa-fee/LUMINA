import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom';

import CadastroLivro from '../pages/CadastroLivro';
import { cadastrarLivro } from '../services/livroService';

// Simula o serviço de cadastro.
vi.mock('../services/livroService', () => ({
    cadastrarLivro: vi.fn(),
}));

// Simula a navegação.
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const original = await vi.importActual('react-router-dom');

    return {
        ...original,
        useNavigate: () => mockNavigate,
    };
});

function renderizarCadastro() {
    return render(
        <MemoryRouter>
            <CadastroLivro />
        </MemoryRouter>,
    );
}

// Preenche os campos obrigatórios.
function preencherCamposObrigatorios() {
    fireEvent.change(screen.getByLabelText('Título'), {
        target: { value: 'Dom Casmurro' },
    });

    fireEvent.change(screen.getByLabelText('Autor'), {
        target: { value: 'Machado de Assis' },
    });

    fireEvent.change(screen.getByLabelText('Categoria'), {
        target: { value: 'Romance' },
    });

    fireEvent.change(screen.getByLabelText('ISBN'), {
        target: { value: '9788535914849' },
    });
}

function clicarCadastrar() {
    fireEvent.click(
        screen.getByRole('button', {
            name: /cadastrar livro/i,
        }),
    );
}

describe('Testes do cadastro de livros', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    // TESTE 1
    it('deve exibir os campos do formulário', () => {
        renderizarCadastro();

        expect(
            screen.getByRole('heading', {
                name: /cadastrar novo livro/i,
            }),
        ).toBeInTheDocument();

        const campos = [
            'Título',
            'Autor',
            'Categoria',
            'ISBN',
            'Quantidade',
            'Editora',
            'Ano de publicação',
            'Edição',
            'Número de páginas',
            'Descrição / Sinopse',
        ];

        campos.forEach((campo) => {
            expect(screen.getByLabelText(campo)).toBeInTheDocument();
        });

        expect(
            screen.getByRole('button', {
                name: /cadastrar livro/i,
            }),
        ).toBeInTheDocument();
    });

    // TESTE 2
    it('deve permitir preencher os dados do livro', () => {
        renderizarCadastro();

        preencherCamposObrigatorios();

        fireEvent.change(screen.getByLabelText('Editora'), {
            target: { value: 'Editora Exemplo' },
        });

        fireEvent.change(screen.getByLabelText('Ano de publicação'), {
            target: { value: '2020' },
        });

        fireEvent.change(screen.getByLabelText('Número de páginas'), {
            target: { value: '256' },
        });

        expect(screen.getByLabelText('Título')).toHaveValue('Dom Casmurro');

        expect(screen.getByLabelText('Editora')).toHaveValue('Editora Exemplo');

        expect(screen.getByLabelText('Ano de publicação')).toHaveValue(2020);

        expect(screen.getByLabelText('Número de páginas')).toHaveValue(256);
    });

    // TESTE 3
    it('não deve cadastrar com campos vazios', () => {
        renderizarCadastro();

        clicarCadastrar();

        expect(cadastrarLivro).not.toHaveBeenCalled();

        expect(screen.getByLabelText('Título')).toBeInvalid();
    });

    // TESTE 4
    it('não deve aceitar quantidade menor que 1', () => {
        renderizarCadastro();

        preencherCamposObrigatorios();

        const quantidade = screen.getByLabelText('Quantidade');

        fireEvent.change(quantidade, {
            target: { value: '0' },
        });

        expect(quantidade).toBeInvalid();

        clicarCadastrar();

        expect(cadastrarLivro).not.toHaveBeenCalled();
    });

    // TESTE 5
    it('deve cadastrar e redirecionar para livros', async () => {
        cadastrarLivro.mockResolvedValueOnce({
            id: 1,
        });

        renderizarCadastro();

        preencherCamposObrigatorios();
        clicarCadastrar();

        await waitFor(() => {
            expect(cadastrarLivro).toHaveBeenCalledWith(
                expect.objectContaining({
                    titulo: 'Dom Casmurro',
                    autor: 'Machado de Assis',
                    categoria: 'Romance',
                    isbn: '9788535914849',
                    quantidade_total: 1,
                    capa: null,
                }),
            );

            expect(mockNavigate).toHaveBeenCalledWith('/livros');
        });
    });

    // TESTE 6
    it('deve exibir mensagem quando o cadastro falhar', async () => {
        cadastrarLivro.mockRejectedValueOnce(
            new Error('Não foi possível cadastrar o livro'),
        );

        renderizarCadastro();

        preencherCamposObrigatorios();
        clicarCadastrar();

        expect(
            await screen.findByText('Não foi possível cadastrar o livro'),
        ).toBeInTheDocument();

        expect(mockNavigate).not.toHaveBeenCalled();

        expect(
            screen.getByRole('button', {
                name: /cadastrar livro/i,
            }),
        ).toBeEnabled();
    });

    // TESTE 7
    it('deve desabilitar o botão durante o cadastro', async () => {
        let concluirCadastro;

        cadastrarLivro.mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    concluirCadastro = resolve;
                }),
        );

        renderizarCadastro();

        preencherCamposObrigatorios();
        clicarCadastrar();

        expect(
            screen.getByRole('button', {
                name: /salvando/i,
            }),
        ).toBeDisabled();

        concluirCadastro({ id: 1 });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/livros');
        });
    });

    // TESTE 8
    it('deve selecionar e visualizar a capa', () => {
        const criarURL = vi.fn(() => 'blob:capa-teste');

        const revogarURL = vi.fn();

        vi.stubGlobal(
            'URL',
            Object.assign(class extends URL {}, {
                createObjectURL: criarURL,
                revokeObjectURL: revogarURL,
            }),
        );

        renderizarCadastro();

        const arquivo = new File(['imagem de teste'], 'capa.png', {
            type: 'image/png',
        });

        const input = document.querySelector('input[type="file"]');

        fireEvent.change(input, {
            target: {
                files: [arquivo],
            },
        });

        expect(criarURL).toHaveBeenCalledWith(arquivo);

        expect(screen.getByAltText('Pré-visualização da capa')).toHaveAttribute(
            'src',
            'blob:capa-teste',
        );

        expect(screen.getByText('Trocar imagem')).toBeInTheDocument();
    });
});
