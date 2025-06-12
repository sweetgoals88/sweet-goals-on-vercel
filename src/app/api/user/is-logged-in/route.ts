import { authenticateUser } from "../../lib/authenticate-user";
import { cookies } from "next/headers";
import { makeErrorResponse } from "../../lib/make-error-response";
import { NextRequest } from "next/server";
import makeOkResponse from "../../lib/ok-response";

export async function POST(request: NextRequest) {
  try {
    await authenticateUser(() => cookies(), {});
    console.log("Authentication passed");
    return makeOkResponse();
  } catch (error) {
    return makeErrorResponse("Couldn't get the dashboard data", 500, error);
  }
}