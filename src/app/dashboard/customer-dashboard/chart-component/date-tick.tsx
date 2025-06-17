export type DateTickProps = {
    x: number;
    y: number;
    payload: {
        value: number;
    };
};

export default function DateTick(props: DateTickProps) {
    return (
        <text textAnchor="middle" x={props.x} y={props.y}>
            <tspan>
            { 
                new Date(props.payload.value).toLocaleTimeString()
            }
            </tspan>
        </text>
    );
}