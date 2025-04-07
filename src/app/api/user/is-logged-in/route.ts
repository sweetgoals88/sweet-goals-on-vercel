import { NextApiRequest } from "next";
import { authenticateUser } from "../../lib/authenticate-user";
import { cookies } from "next/headers";
import { UserEntity } from "../../db/entities/user/entity";
import { makeErrorResponse } from "../../lib/make-error-response";

export async function POST(request: NextApiRequest) {
  try {
    await authenticateUser(() => cookies(), {});
    console.log("Authentication passed");
    return Response.json({ message: "successs" }, { status: 200 });
  } catch (error) {
    return makeErrorResponse("Couldn't get the dashboard data", 500, error);
  }
}