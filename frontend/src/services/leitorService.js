import { apiFetch } from "./api"


export async function listarLeitores() {

    const response = await apiFetch(
        "/api/leitores/"
    )

    const dados = await response.json()

    if (!response.ok) {

        throw new Error(
            dados.detail ||
            "Não foi possível carregar os leitores."
        )
    }

    return dados
}


export async function buscarLeitor(id) {

    const response = await apiFetch(
        `/api/leitores/${id}`
    )

    const dados = await response.json()

    if (!response.ok) {

        throw new Error(
            dados.detail ||
            "Não foi possível carregar o leitor."
        )
    }

    return dados
}

export async function cadastrarLeitor(dados) {

    const formData = new FormData()

    formData.append(
        "nome",
        dados.nome
    )

    formData.append(
        "email",
        dados.email
    )
    
    formData.append(
        "telefone",
        dados.telefone || ""
    )
    
    formData.append(
        "endereco",
        dados.endereco || ""
    )

    if (dados.foto) {

        formData.append(
            "foto",
            dados.foto
        )
    }


    const response = await apiFetch(
        "/api/leitores/",
        {
            method: "POST",
            body: formData
        }
    )


    const resultado = await response.json()


    if (!response.ok) {

        if (Array.isArray(resultado.detail)) {

            const mensagens =
                resultado.detail.map(
                    (erro) => erro.msg
                )

            throw new Error(
                mensagens.join(" | ")
            )
        }


        throw new Error(
            resultado.detail ||
            "Não foi possível cadastrar o leitor."
        )
    }


    return resultado
}
export async function editarLeitor(
    id,
    dados
) {
    const formData = new FormData()

    formData.append(
        "nome",
        dados.nome
    )

    formData.append(
        "email",
        dados.email
    )

    formData.append(
        "telefone",
        dados.telefone || ""
    )

    formData.append(
        "endereco",
        dados.endereco || ""
    )

    if (dados.foto) {
        formData.append(
            "foto",
            dados.foto
        )
    }

    const response = await apiFetch(
        `/api/leitores/${id}`,
        {
            method: "PUT",
            body: formData
        }
    )

    const resultado = await response.json()

    if (!response.ok) {
        if (Array.isArray(resultado.detail)) {
            const mensagens =
                resultado.detail.map(
                    (erro) => erro.msg
                )
            throw new Error(
                mensagens.join(" | ")
            )
        }

        throw new Error(
            resultado.detail ||
            "Não foi possível atualizar o leitor."
        )
    }

    return resultado
}

export async function excluirLeitor(id) {
    const response = await apiFetch(
        `/api/leitores/${id}`,
        {
            method: "DELETE"
        }
    )

    const resultado = await response.json()

    if (!response.ok) {
        throw new Error(
            resultado.detail ||
            "Não foi possível excluir o leitor."
        )
    }

    return resultado
}
export async function buscarDetalhesLeitor(id) {
    const response = await apiFetch(
        `/api/leitores/${id}/detalhes`
    )
    const dados = await response.json()

    if (!response.ok) {
        throw new Error(
            dados.detail ||
            "Não foi possível carregar os detalhes do leitor."
        )
    }

    return dados
}