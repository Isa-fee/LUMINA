import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom';

import CadastroLeitor from '../pages/CadastroLeitor';

import { cadastrarLeitor } from '../services/leitorService';

// SIMULAR O SERVIÇO

vi.mock('../services/leitorService', () => ({
    cadastrarLeitor: vi.fn(),
}));

// SIMULAR A NAVEGAÇÃO

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const original = await vi.importActual('react-router-dom');

    return {
        ...original,
        useNavigate: () => mockNavigate,
    };
});

// FUNÇÕES AUXILIARES

function renderizarCadastro() {
    return render(
        <MemoryRouter>
            <CadastroLeitor />
        </MemoryRouter>,
    );
}

function preencherCampos() {
    fireEvent.change(screen.getByLabelText('Nome completo'), {
        target: {
            value: 'Ana Silva',
        },
    });

    fireEvent.change(screen.getByLabelText('E-mail'), {
        target: {
            value: 'ana@exemplo.com',
        },
    });

    fireEvent.change(screen.getByLabelText('Telefone'), {
        target: {
            value: '84999999999',
        },
    });

    fireEvent.change(screen.getByLabelText('Endereço'), {
        target: {
            value: 'Rua das Flores, 100',
        },
    });
}

function clicarCadastrar() {
    fireEvent.click(
        screen.getByRole('button', {
            name: /cadastrar leitor/i,
        }),
    );
}

// TESTES

describe('Testes do cadastro de leitores', () => {
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
                name: /cadastrar leitor/i,
            }),
        ).toBeInTheDocument();

        const campos = ['Nome completo', 'E-mail', 'Telefone', 'Endereço'];

        campos.forEach((campo) => {
            expect(screen.getByLabelText(campo)).toBeInTheDocument();
        });

        expect(
            screen.getByRole('button', {
                name: /cadastrar leitor/i,
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole('link', {
                name: /cancelar/i,
            }),
        ).toHaveAttribute('href', '/leitores');
    });

    // TESTE 2
    it('deve permitir preencher os dados pessoais', () => {
        renderizarCadastro();

        preencherCampos();

        expect(screen.getByLabelText('Nome completo')).toHaveValue('Ana Silva');

        expect(screen.getByLabelText('E-mail')).toHaveValue('ana@exemplo.com');

        expect(screen.getByLabelText('Telefone')).toHaveValue('84999999999');

        expect(screen.getByLabelText('Endereço')).toHaveValue(
            'Rua das Flores, 100',
        );
    });

    // TESTE 3
    it('não deve cadastrar com campos obrigatórios vazios', () => {
        renderizarCadastro();

        clicarCadastrar();

        expect(cadastrarLeitor).not.toHaveBeenCalled();

        expect(screen.getByLabelText('Nome completo')).toBeInvalid();
    });

    // TESTE 4
    it('não deve aceitar e-mail inválido', () => {
        renderizarCadastro();

        fireEvent.change(screen.getByLabelText('Nome completo'), {
            target: {
                value: 'Ana Silva',
            },
        });

        const email = screen.getByLabelText('E-mail');

        fireEvent.change(email, {
            target: {
                value: 'email-invalido',
            },
        });

        expect(email).toBeInvalid();

        clicarCadastrar();

        expect(cadastrarLeitor).not.toHaveBeenCalled();
    });

    // TESTE 5
    it('deve cadastrar e redirecionar para leitores', async () => {
        cadastrarLeitor.mockResolvedValueOnce({
            id: 1,
        });

        renderizarCadastro();

        preencherCampos();

        clicarCadastrar();

        await waitFor(() => {
            expect(cadastrarLeitor).toHaveBeenCalledWith({
                nome: 'Ana Silva',
                email: 'ana@exemplo.com',
                telefone: '84999999999',
                endereco: 'Rua das Flores, 100',
                foto: null,
            });

            expect(mockNavigate).toHaveBeenCalledWith('/leitores');
        });
    });

    // TESTE 6
    it('deve mostrar erro quando o cadastro falhar', async () => {
        cadastrarLeitor.mockRejectedValueOnce(
            new Error('Não foi possível cadastrar o leitor'),
        );

        renderizarCadastro();

        preencherCampos();

        clicarCadastrar();

        expect(
            await screen.findByText('Não foi possível cadastrar o leitor'),
        ).toBeInTheDocument();

        expect(mockNavigate).not.toHaveBeenCalled();

        expect(
            screen.getByRole('button', {
                name: /cadastrar leitor/i,
            }),
        ).toBeEnabled();
    });

    // TESTE 7
    it('deve desabilitar o botão durante o cadastro', async () => {
        let concluirCadastro;

        cadastrarLeitor.mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    concluirCadastro = resolve;
                }),
        );

        renderizarCadastro();

        preencherCampos();

        clicarCadastrar();

        expect(
            screen.getByRole('button', {
                name: /cadastrando/i,
            }),
        ).toBeDisabled();

        concluirCadastro({ id: 1 });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/leitores');
        });
    });

    // TESTE 8
    it('deve selecionar e visualizar a foto', () => {
        const criarURL = vi.fn(() => 'blob:foto-teste');

        vi.stubGlobal(
            'URL',
            Object.assign(class extends URL {}, {
                createObjectURL: criarURL,
            }),
        );

        renderizarCadastro();

        const arquivo = new File(['imagem de teste'], 'foto.png', {
            type: 'image/png',
        });

        const input = document.querySelector('input[type="file"]');

        fireEvent.change(input, {
            target: {
                files: [arquivo],
            },
        });

        expect(criarURL).toHaveBeenCalledWith(arquivo);

        expect(screen.getByAltText('Prévia da foto do leitor')).toHaveAttribute(
            'src',
            'blob:foto-teste',
        );

        expect(screen.getByText('Escolher foto')).toBeInTheDocument();
    });
});
