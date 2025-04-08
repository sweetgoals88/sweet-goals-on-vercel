export default function splitArray<T>(array: T[], chunkSize: number): T[][] {
    if (array.length == 0) return [];
    const elements: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        const slice = array.slice(i, i + chunkSize);
        elements.push(slice);
    }
    return elements;
}