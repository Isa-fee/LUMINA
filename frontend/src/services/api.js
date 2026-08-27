const API_URL = "http://127.0.0.1:8000"


export async function apiFetch(
    endpoint,
    options = {}
) {
    const token = localStorage.getItem("token")

    const headers = {
        "Content-Type": "application/json",
        ...options.headers
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,
            headers
        }
    )

    return response
}