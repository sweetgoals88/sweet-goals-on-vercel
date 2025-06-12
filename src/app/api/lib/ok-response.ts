export type OkResponseType = { message: "Successful operation", success: true };

export default function makeOkResponse(data?: any) {
    return Response.json(
        data === undefined ? { message: "Successful operation", success: true } : data, 
        { status: 200 }
    );
}
