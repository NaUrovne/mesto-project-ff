function checkResponse(res) {
    if (res.ok) {
        return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
};

export function request(endpoint, options) {
    const baseUrl = "https://mesto.nomoreparties.co/v1/wff-cohort-20";
    return fetch(`${baseUrl}${endpoint}`, options).then(checkResponse);
};