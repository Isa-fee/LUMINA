import { apiFetch } from "./api"

// ========================================
// LOGIN
// ========================================
export async function login(
    email,
    senha
) {
    const response = await apiFetch(
        "/api/auth/login",
        {
            method: "POST",
            body: JSON.stringify({
                email,
                senha
            })
        }
    )

    const dados = await response.json()

    if (!response.ok) {
        throw new Error(
            dados.detail ||
            "Erro ao fazer login."
        )
    }

    localStorage.setItem(
        "token",
        dados.access_token
    )

    return dados
}

// ========================================
// CADASTRO
// ========================================
export async function cadastrar(
    nome,
    email,
    senha
) {
    const response = await apiFetch(
        "/api/usuarios/",
        {
            method: "POST",

            body: JSON.stringify({
                nome,
                email,
                senha
            })
        }
    )

    const dados = await response.json()

    if (!response.ok) {
        throw new Error(
            dados.detail ||
            "Erro ao realizar cadastro."
        )
    }
    
    return dados
}