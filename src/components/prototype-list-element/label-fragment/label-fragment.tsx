import { OnChangeProps } from "../prototype-list-element";

export default function LabelFragment(
    props: OnChangeProps<string>
) {
    return (
        <div>
            <h1 style={{
                fontSize: "1rem"
            }}>
                ¿Cómo quieres nombrar a este dispositivo?
            </h1>
            <div>
                <input 
                    type="text" 
                    value={props.props.initialValue} 
                    onChange={(e) => props.props.onChange(e.target.value)} 
                    style={{
                        fontFamily: "Montserrat",
                        fontSize: "1rem",
                        border: "none",
                        borderBottom: "1px solid lightgray",
                        outline: "none"
                    }}
                    />
            </div>
        </div>
    );
}