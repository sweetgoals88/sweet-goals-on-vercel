export type NotificationPreview = {
    id: string,
    type: string,
    message: string,
    seen: boolean,
    createdAt: Date
};

export function getNotificationPreviewFromJson(json: any): NotificationPreview {
    return {
        id: json.id,
        type: json.type,
        message: json.message,
        seen: json.seen,
        createdAt: new Date(json.createdAt)
    };
}
