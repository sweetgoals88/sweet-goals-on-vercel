import { makeErrorResponse } from "../lib/make-error-response";
import { NextRequest } from "next/server";
import { geocode } from "../lib/geocoding";

export type LocationOption = {
    latitude: number;
    longitude: number;
    locationName: string;
};

export async function GET(request: NextRequest) {
    const query = new URL(request.url).searchParams.get("query");
    if (!query || typeof query !== "string") {
        return makeErrorResponse("Missing query", 400);
    }
  
    try {
      const results = await geocode(query);
      const mappedResults = results.map(result => ({
        locationName: result.formattedAddress,
        latitude: result.latitude,
        longitude: result.latitude
      })); 
      console.log(mappedResults);
      
      return Response.json(mappedResults);
    } catch (error) {
        console.log(error);
        return makeErrorResponse("Geocoding failed", 500, error);
    }
}
