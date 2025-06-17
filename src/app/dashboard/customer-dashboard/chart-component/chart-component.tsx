import { title } from "process";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styles from "./styles.module.css";
import {
  EXTERNAL_READINGS_REQUEST_INTERVAL,
  INTERNAL_READINGS_REQUEST_INTERVAL,
  MAX_READINGS_PER_CHART,
} from "@/utils/control-variables";
import DateTick from "./date-tick";
import CustomTooltip from "./custom-tooltip/custom-tooltip";
import { ContentType, TooltipProps } from "recharts/types/component/Tooltip";

export type DataPointPayload = {
  value: number;
  date: Date;
};

export type ChartWrapperProps = {
  title: string;
  data: DataPointPayload[];
  unit: string;

  chartType: "internal" | "external";
  intendedMinimum: number;
  intendedMaximum: number;
};

export default function ChartComponent(props: ChartWrapperProps) {
  const readingInterval =
    props.chartType === "internal"
      ? INTERNAL_READINGS_REQUEST_INTERVAL
      : EXTERNAL_READINGS_REQUEST_INTERVAL;
  const timeWindow = MAX_READINGS_PER_CHART * readingInterval * 60 * 1000;

  let modifiedData: {
    value: number;
    time: number;
    name: string;
  }[] = [];

  try {
    modifiedData = props.data.map((entry) => ({
      value: entry.value,
      time: entry.date.getTime(),
      name: entry.date.toLocaleTimeString(),
    }));
  } catch (error) {
    console.log("Something went wrong reading the new data");
    console.log(props.data);
    console.log(error)
  }

  return (
    <>
      <h2 className={styles["chart-wrapper__title"]}>{props.title}</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={modifiedData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
          />
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            domain={([_, dataMax]) => {
              return [dataMax - timeWindow, dataMax];
            }}
            type="number"
            dataKey="time"
            minTickGap={30}
            tick={DateTick}
          />
          <YAxis
            domain={([dataMin, dataMax]) => {
              const min = Math.min(dataMin, props.intendedMinimum);
              const max = Math.max(dataMax, props.intendedMaximum);
              return [min, max];
            }}
            unit={props.unit}
          />
          <Tooltip content={(subprops: TooltipProps<number, string>) => CustomTooltip({ name: props.title, unit: props.unit, ...subprops })} />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
