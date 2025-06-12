import { makeErrorResponse } from "../lib/make-error-response";
import { NextRequest } from "next/server";
import { geocode } from "../lib/geocoding";
import { ApiResponseError } from "../lib/api-response-error";
import makeOkResponse from "../lib/ok-response";

export type LocationOption = {
    latitude: number;
    longitude: number;
    locationName: string;
};

export async function GET(request: NextRequest) {
  try {
      const query = new URL(request.url).searchParams.get("query");
      if (!query || typeof query !== "string") {
          throw new ApiResponseError("Missing query", 400);
      }
      const results = await geocode(query);
      const mappedResults = results.map(result => ({
        locationName: result.formattedAddress,
        latitude: result.latitude,
        longitude: result.latitude
      })); 
      
      return makeOkResponse(mappedResults);
    } catch (error) {
        return makeErrorResponse("Geocoding failed", 500, error);
    }
}
