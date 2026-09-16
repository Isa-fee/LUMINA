import { apiFetch } from "./api"


export async function listarLivros() {

    const response = await apiFetch(
        "/api/livros/"
    )

    const dados = await response.json()

    if (!response.ok) {
        throw new Error(
            dados.detail ||
            "Não foi possível carregar os livros."
        )
    }

    return dados
}


export async function cadastrarLivro(dados) {

    const formData = new FormData()

    // =========================
    // INFORMAÇÕES PRINCIPAIS
    // =========================

    formData.append(
        "titulo",
        dados.titulo
    )

    formData.append(
        "autor",
        dados.autor
    )

    formData.append(
        "categoria",
        dados.categoria
    )

    formData.append(
        "isbn",
        dados.isbn
    )

    formData.append(
        "quantidade_total",
        String(dados.quantidade_total)
    )


    // =========================
    // INFORMAÇÕES ADICIONAIS
    // =========================

    if (dados.editora) {
        formData.append(
            "editora",
            dados.editora
        )
    }

    if (dados.ano_publicacao) {
        formData.append(
            "ano_publicacao",
            String(dados.ano_publicacao)
        )
    }

    if (dados.edicao) {
        formData.append(
            "edicao",
            dados.edicao
        )
    }

    if (dados.numero_paginas) {
        formData.append(
            "numero_paginas",
            String(dados.numero_paginas)
        )
    }

    if (dados.descricao) {
        formData.append(
            "descricao",
            dados.descricao
        )
    }


    // =========================
    // CAPA
    // =========================

    if (dados.capa) {

        formData.append(
            "capa",
            dados.capa
        )
    }


    // =========================
    // REQUISIÇÃO
    // =========================

    const response = await apiFetch(
        "/api/livros/",
        {
            method: "POST",
            body: formData
        }
    )


    const resultado = await response.json()


    if (!response.ok) {

        console.error(
            "Erro retornado pela API:",
            resultado
        )


        if (Array.isArray(resultado.detail)) {

            const mensagens = resultado.detail.map(
                (erro) => erro.msg
            )

            throw new Error(
                mensagens.join(" | ")
            )
        }


        throw new Error(
            resultado.detail ||
            "Não foi possível cadastrar o livro."
        )
    }


    return resultado
}


export async function buscarLivro(id) {

    const response = await apiFetch(
        `/api/livros/${id}`
    )

    const dados = await response.json()

    if (!response.ok) {
        throw new Error(
            dados.detail ||
            "Não foi possível carregar o livro."
        )
    }

    return dados
}


export async function atualizarLivro(
    id,
    dados
) {

    const response = await apiFetch(
        `/api/livros/${id}`,
        {
            method: "PUT",

            body: JSON.stringify({

                // Informações principais
                titulo: dados.titulo,
                autor: dados.autor,
                categoria: dados.categoria,
                isbn: dados.isbn,

                quantidade_total:
                    Number(dados.quantidade_total),

                // Informações adicionais
                editora:
                    dados.editora || null,

                ano_publicacao:
                    dados.ano_publicacao
                        ? Number(dados.ano_publicacao)
                        : null,

                edicao:
                    dados.edicao || null,

                numero_paginas:
                    dados.numero_paginas
                        ? Number(dados.numero_paginas)
                        : null,

                descricao:
                    dados.descricao || null
            })
        }
    )


    const resultado = await response.json()


    if (!response.ok) {

        if (Array.isArray(resultado.detail)) {

            const mensagens = resultado.detail.map(
                (erro) => erro.msg
            )

            throw new Error(
                mensagens.join(" | ")
            )
        }


        throw new Error(
            resultado.detail ||
            "Não foi possível atualizar o livro."
        )
    }


    return resultado
}


export async function excluirLivro(id) {

    const response = await apiFetch(
        `/api/livros/${id}`,
        {
            method: "DELETE"
        }
    )

    const resultado = await response.json()

    if (!response.ok) {

        throw new Error(
            resultado.detail ||
            "Não foi possível excluir o livro."
        )
    }

    return resultado
}