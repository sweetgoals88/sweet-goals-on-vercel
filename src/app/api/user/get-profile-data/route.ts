import { cookies } from "next/headers";
import { authenticateUser } from "../../lib/authenticate-user";
import { makeErrorResponse } from "../../lib/make-error-response";
import { UserEntity } from "../../db/entities/user/entity";
import { CustomerProfileView } from "../../db/entities/user/customer/profile-view";
import { AdminProfileView } from "../../db/entities/user/admin/profile-view";
import makeOkResponse from "../../lib/ok-response";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest): Promise<Response> {
    try {
        const userSnapshot = await authenticateUser(() => cookies(), {});
        const user = userSnapshot.data() as UserEntity;

        switch (user.type) {
            case "customer":
                return makeOkResponse({
                    email: user.email,
                    name: user.name,
                    surname: user.surname,
                    type: user.type,
                } as CustomerProfileView);
                case "admin":
                return makeOkResponse({
                    email: user.email,
                    name: user.name,
                    surname: user.surname,
                    admin_code: user.admin_code,
                    permissions: user.permissions,
                    type: user.type,
                } as AdminProfileView);
            default:
                return makeErrorResponse("User type not recognized", 400);
        }
    } catch (error) {
        console.log(error);
        return makeErrorResponse("Couldn't get the dashboard data", 500, error);
    }
}
