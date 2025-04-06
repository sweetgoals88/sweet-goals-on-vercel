import { OnChangeProps } from "../prototype-list-element";

export default function LocationFragment(
    props: OnChangeProps<{
        latitude: number,
        longitude: number,
        locationName: string
    }>
) {
    return (
        <div>
            <h1 style={{
                fontSize: "1rem"
            }}>
                ¿Dónde se encuentra este dispositivo?
            </h1>
            
        </div>
    );
}