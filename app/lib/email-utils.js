export function parseEmails(raw) {
    return raw.split(',').map((e) => e.trim()).filter(Boolean);
}

export function hasSpaceSeparator(val) {
    return val.replace(/,\s*/g, ',').includes(' ');
}
