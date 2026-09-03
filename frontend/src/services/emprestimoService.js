import { apiFetch } from "./api"


// ========================================
// LISTAR EMPRÉSTIMOS
// ========================================

export async function listarEmprestimos() {

    const response = await apiFetch(
        "/api/emprestimos/"
    )

    const dados = await response.json()


    if (!response.ok) {

        throw new Error(
            dados.detail ||
            "Não foi possível carregar os empréstimos."
        )
    }


    return dados
}


// ========================================
// BUSCAR EMPRÉSTIMO
// ========================================

export async function buscarEmprestimo(id) {

    const response = await apiFetch(
        `/api/emprestimos/${id}`
    )

    const dados = await response.json()


    if (!response.ok) {

        throw new Error(
            dados.detail ||
            "Não foi possível carregar o empréstimo."
        )
    }


    return dados
}


// ========================================
// CRIAR EMPRÉSTIMO
// ========================================

export async function cadastrarEmprestimo(dados) {

    const response = await apiFetch(
        "/api/emprestimos/",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                leitor_id: Number(
                    dados.leitor_id
                ),

                livro_id: Number(
                    dados.livro_id
                )
            })
        }
    )


    const resultado = await response.json()


    if (!response.ok) {

        throw new Error(
            resultado.detail ||
            "Não foi possível cadastrar o empréstimo."
        )
    }


    return resultado
}


// ========================================
// ATUALIZAR EMPRÉSTIMO
// ========================================

export async function atualizarEmprestimo(
    id,
    dados
) {

    const response = await apiFetch(
        `/api/emprestimos/${id}`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                leitor_id: Number(
                    dados.leitor_id
                ),

                livro_id: Number(
                    dados.livro_id
                )
            })
        }
    )


    const resultado = await response.json()


    if (!response.ok) {

        throw new Error(
            resultado.detail ||
            "Não foi possível atualizar o empréstimo."
        )
    }


    return resultado
}


// ========================================
// DEVOLVER LIVRO
// ========================================

export async function devolverEmprestimo(id) {

    const response = await apiFetch(
        `/api/emprestimos/${id}/devolver`,
        {
            method: "PUT"
        }
    )


    const resultado = await response.json()


    if (!response.ok) {

        throw new Error(
            resultado.detail ||
            "Não foi possível registrar a devolução."
        )
    }


    return resultado
}


// ========================================
// EXCLUIR EMPRÉSTIMO
// ========================================

export async function excluirEmprestimo(id) {

    const response = await apiFetch(
        `/api/emprestimos/${id}`,
        {
            method: "DELETE"
        }
    )


    const resultado = await response.json()


    if (!response.ok) {

        throw new Error(
            resultado.detail ||
            "Não foi possível excluir o empréstimo."
        )
    }


    return resultado
}