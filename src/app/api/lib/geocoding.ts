import NodeGeocoder from "node-geocoder";
import fetch from "node-fetch";
import { ApiResponseError } from "./api-response-error";

function getGeocoder() {
    const options: NodeGeocoder.Options = {
        provider: "locationiq",
        apiKey: process.env.LOCATIONIQ_API_KEY || "",
        fetch,
    };
    const geocoder = NodeGeocoder(options);
    return geocoder;
}

export async function reverseGeocoding(latitude: number, longitude: number) {
    try {
        const geocoder = getGeocoder();
        const data = await geocoder.reverse({ lat: latitude, lon: longitude });
        return data;
    } catch (error) {
        throw ApiResponseError.aggregateWith("Couldn't reverse the longitude and latitude passed", error, 500);
    }
}

export async function geocode(address: string) {
    try {
        return getGeocoder().geocode(address);
    } catch (error) {
        throw ApiResponseError.aggregateWith("Couldn't geocode the address passed", error, 500);
    }
}
