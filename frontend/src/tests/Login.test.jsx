import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import Login from '../pages/Login';
import { login } from '../services/authService';

// Simula a autenticação sem acessar o backend.
vi.mock('../services/authService', () => ({
    login: vi.fn(),
}));

// Simula a navegação após o login.
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const original = await vi.importActual('react-router-dom');

    return {
        ...original,
        useNavigate: () => mockNavigate,
    };
});

function renderizarLogin() {
    return render(
        <MemoryRouter>
            <Login />
        </MemoryRouter>,
    );
}

describe('Testes da página de Login', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    // TESTE 1
    it('deve exibir os elementos da página', () => {
        renderizarLogin();

        expect(
            screen.getByRole('heading', {
                name: /faça login/i,
            }),
        ).toBeInTheDocument();

        expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();

        expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();

        expect(
            screen.getByRole('button', {
                name: /entrar/i,
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole('link', {
                name: /esqueceu sua senha/i,
            }),
        ).toHaveAttribute('href', '/recuperar-senha');
    });

    // TESTE 2
    it('deve permitir preencher e-mail e senha', () => {
        renderizarLogin();

        const email = screen.getByLabelText(/e-mail/i);
        const senha = screen.getByLabelText(/senha/i);

        fireEvent.change(email, {
            target: {
                value: 'teste@lumina.com',
            },
        });

        fireEvent.change(senha, {
            target: {
                value: 'senha123',
            },
        });

        expect(email).toHaveValue('teste@lumina.com');

        expect(senha).toHaveValue('senha123');
    });

    // TESTE 3
    it('não deve enviar o formulário com campos vazios', () => {
        renderizarLogin();

        const botao = screen.getByRole('button', { name: /entrar/i });

        fireEvent.click(botao);

        expect(login).not.toHaveBeenCalled();
    });

    // TESTE 4
    it('deve realizar login e navegar para home', async () => {
        login.mockResolvedValueOnce({
            access_token: 'token-teste',
        });

        renderizarLogin();

        fireEvent.change(screen.getByLabelText(/e-mail/i), {
            target: {
                value: 'teste@lumina.com',
            },
        });

        fireEvent.change(screen.getByLabelText(/senha/i), {
            target: {
                value: 'senha123',
            },
        });

        fireEvent.click(
            screen.getByRole('button', {
                name: /entrar/i,
            }),
        );

        await waitFor(() => {
            expect(login).toHaveBeenCalledWith('teste@lumina.com', 'senha123');

            expect(mockNavigate).toHaveBeenCalledWith('/home', {
                replace: true,
            });
        });
    });

    // TESTE 5
    it('deve mostrar mensagem quando o login falhar', async () => {
        login.mockRejectedValueOnce(new Error('E-mail ou senha incorretos'));

        renderizarLogin();

        fireEvent.change(screen.getByLabelText(/e-mail/i), {
            target: {
                value: 'teste@lumina.com',
            },
        });

        fireEvent.change(screen.getByLabelText(/senha/i), {
            target: {
                value: 'senhaerrada',
            },
        });

        fireEvent.click(
            screen.getByRole('button', {
                name: /entrar/i,
            }),
        );

        expect(
            await screen.findByText('E-mail ou senha incorretos'),
        ).toBeInTheDocument();

        expect(mockNavigate).not.toHaveBeenCalled();
    });

    // TESTE 6
    it('deve desabilitar o botão durante o login', async () => {
        let concluirLogin;

        login.mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    concluirLogin = resolve;
                }),
        );

        renderizarLogin();

        fireEvent.change(screen.getByLabelText(/e-mail/i), {
            target: {
                value: 'teste@lumina.com',
            },
        });

        fireEvent.change(screen.getByLabelText(/senha/i), {
            target: {
                value: 'senha123',
            },
        });

        fireEvent.click(
            screen.getByRole('button', {
                name: /entrar/i,
            }),
        );

        const botao = screen.getByRole('button', { name: /entrando/i });

        expect(botao).toBeDisabled();

        concluirLogin({});

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalled();
        });
    });
});
