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

    formData.append("titulo", dados.titulo)
    formData.append("autor", dados.autor)
    formData.append("categoria", dados.categoria)
    formData.append("isbn", dados.isbn)

    formData.append(
        "quantidade_total",
        String(dados.quantidade_total)
    )


    if (dados.capa) {

        formData.append(
            "capa",
            dados.capa
        )
    }


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