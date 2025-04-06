export type InternalReadingPreview = {
    id: string,
    dateTime: Date,
    humidity: number,
    temperature: number
};

export function getInternalReadingPreviewFromJson(json: any): InternalReadingPreview {
    return {
        id: json.id,
        dateTime: new Date(json.dateTime),
        humidity: json.humidity,
        temperature: json.temperature
    };
}
