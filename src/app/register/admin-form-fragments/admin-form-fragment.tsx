import { AdminRegistrationInputFragment } from "@/app/api/db/entities/user/admin/input";
import { FormFragmentProps } from "../form-fragment-props";

export type AdminFormFragmentOutput = Omit<AdminRegistrationInputFragment, "type">;
export type AdminFormFragmentProps = FormFragmentProps<AdminFormFragmentOutput>;

export default function AdminFormFragment(props: AdminFormFragmentProps) {
    return (
        <div>
            {/*  */}
        </div>
    );
}
