import { apiFetch } from "./api"


export async function carregarResumoHome() {

    const [
        livrosResponse,
        leitoresResponse,
        emprestimosResponse
    ] = await Promise.all([
        apiFetch("/api/livros/"),
        apiFetch("/api/leitores/"),
        apiFetch("/api/emprestimos/")
    ])


    if (
        !livrosResponse.ok ||
        !leitoresResponse.ok ||
        !emprestimosResponse.ok
    ) {
        throw new Error(
            "Não foi possível carregar o resumo."
        )
    }


    const [
        livros,
        leitores,
        emprestimos
    ] = await Promise.all([
        livrosResponse.json(),
        leitoresResponse.json(),
        emprestimosResponse.json()
    ])


    const hoje = new Date()

    const atrasados = emprestimos.filter(
        (emprestimo) => {

            if (!emprestimo.data_devolucao) {
                return false
            }

            const dataDevolucao = new Date(
                `${emprestimo.data_devolucao}T23:59:59`
            )

            return dataDevolucao < hoje
        }
    )


    return {
        livros: livros.length,
        leitores: leitores.length,
        emprestimos: emprestimos.length,
        atrasados: atrasados.length
    }
}