const sanitize = (str) => {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
        .replace(/\//g, "&#47;")
        .replace(/\(/g, "&#40;")
        .replace(/\)/g, "&#41;")
        .replace(/\+/g, "&#43;")
        .replace(/=/g, "&#61;");
};

export const TEMPLATES = {
    error: (e) => `<div class="error">${sanitize(e.msg)}</div>`,
    info: (e) => `<div class="info">${sanitize(e.msg)}</div>`,
}

export default TEMPLATES