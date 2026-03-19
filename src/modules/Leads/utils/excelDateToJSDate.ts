export function excelDateToJSDate(serial: number | string) {
    if (!serial) return new Date();

    if (typeof serial === "number") {
        const utcDays = Math.floor(serial - 25569);
        const utcValue = utcDays * 86400;
        return new Date(utcValue * 1000);
    }

    return new Date(serial);
}
