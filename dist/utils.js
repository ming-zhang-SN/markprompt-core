export const getErrorMessage = async (res) => {
    const res2 = res.clone();
    try {
        return (await res.json())?.error;
    }
    catch {
        return res2.text();
    }
};
export const parseEncodedJSONHeader = (response, name) => {
    try {
        const headerValue = response.headers.get(name);
        if (headerValue) {
            const headerArray = new Uint8Array(headerValue.split(',').map(Number));
            const decoder = new TextDecoder();
            const decodedValue = decoder.decode(headerArray);
            return JSON.parse(decodedValue);
        }
    }
    catch (e) {
        // Do nothing
    }
    return undefined;
};
//# sourceMappingURL=utils.js.map