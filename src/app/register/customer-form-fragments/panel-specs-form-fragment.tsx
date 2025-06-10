import { PanelSpecificationsEntity } from "@/app/api/db/entities/prototype/entity";
import { FormFragmentProps } from "../form-fragment-props";

type PanelSpecsFormFragmentProps = FormFragmentProps<PanelSpecificationsEntity> & {};

export default function PanelSpecsFormFragment(props: PanelSpecsFormFragmentProps) {
    return (
        <div>
            <div>
                <h1>
                    Código
                </h1>
            </div>
        </div>
    );
}
