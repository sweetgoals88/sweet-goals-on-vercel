/**
 * Makes a request to the API endpoint
 * @param endpoint The API endpoint to call
 * @param [method="POST"] The method to use
 * @returns Promise<Response> The response given by the API
 */
export default function apiCall(endpoint: string, body: object | null = {}, method: "GET" | "POST" = "POST"): Promise<Response> {
    return fetch(endpoint, {
        method,
        credentials: "include",
        headers: {
            "Content-Type": "text/plain",
        },
        body: (body === undefined || body === null)? null: JSON.stringify(body),
    }) as Promise<Response>;
};
