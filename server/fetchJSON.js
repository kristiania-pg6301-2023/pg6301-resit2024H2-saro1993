export async function fetchJSON(path) {
    const response = await fetch(path);
    if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}, path: ${path}`);
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        console.error(`Expected JSON, got ${contentType}, path: ${path}`);
        throw new TypeError("Oops, we haven't got JSON!");
    }

    if (response.status === 204) {
        console.log(`Response status 204, no data returned from server, path: ${path}`);
        return null;
    }
    return await response.json();
}