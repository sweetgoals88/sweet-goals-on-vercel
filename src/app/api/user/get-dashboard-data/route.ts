import { NextApiRequest } from "next";
import { cookies } from "next/headers";
import { UserEntity } from "../../db/entities/user/entity";
import { makeErrorResponse } from "../../lib/make-error-response";
import { authenticateUser } from "../../lib/authenticate-user";
import { getDashboardDataOfCustomer } from "../../db/entities/user/customer/behavior/get-dashboard-data-of-customer";
import { getDashboardDataOfAdmin } from "../../db/entities/user/admin/behavior/get-dashboard-data-of-admin";

export async function POST(request: NextApiRequest) {
  try {
    const userSnapshot = await authenticateUser(() => cookies(), {});
    const user = userSnapshot.data() as UserEntity;

    if (user.type === "customer") {
      return Response.json(
        await getDashboardDataOfCustomer(user, userSnapshot.id)
      );
    } else if (user.type === "admin") {
      return Response.json(
        await getDashboardDataOfAdmin(user, userSnapshot.id)
      );
    } else {
      return makeErrorResponse("User type not recognized", 400);
    }
  } catch (error) {
    return makeErrorResponse("Couldn't get the dashboard data", 500, error);
  }
}
