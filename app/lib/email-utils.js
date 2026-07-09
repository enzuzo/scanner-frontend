/** @param {string} raw @returns {string[]} */
export function parseEmails(raw) {
    return raw.split(',').map((e) => e.trim()).filter(Boolean);
}

/** @param {string} val @returns {boolean} */
export function hasSpaceSeparator(val) {
    return val.replace(/,\s*/g, ',').includes(' ');
}
