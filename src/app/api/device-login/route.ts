import { NextRequest } from "next/server";

import { JwtApiPayload, signJwt } from "@/app/api/lib/jwt";
import { getPrototypeByKey } from "../db/prototype-entity";
import { makeErrorResponse } from "../lib/make-error-response";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { prototype_key } = body;

  return await getPrototypeByKey(prototype_key)
    .then(_ => signJwt<JwtApiPayload>({ prototype_key }))
    .then(token => Response.json({ token }))
    .catch(error => makeErrorResponse("Couldn't authenticate the device", 500, error)
  );
}
