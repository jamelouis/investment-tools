
import { Chart } from '@ant-design/plots';

interface ChartData {
  date: string;
  value: number;
  pe: number;
}

interface ChartConfig {
  title: {
    title: string;
    style: { align: 'center' | 'left' | 'right' };
  };
  data: ChartData[];
  xField: string;
  legend: { position: 'top' | 'bottom' | 'left' | 'right' };
  children: Array<{
    type: string;
    yField: string;
    shapeField: string;
    style: { lineWidth: number; opacity: number; stroke?: string };
    axis: {
      y: {
        position?: 'left' | 'right';
        title: string;
        style: { titleFill: string };
      };
    };
  }>;
  interaction: { tooltip: boolean };
  onReady: (params: { chart: Chart }) => void;
}

export const getChartConfig = (
  filteredChartData: ChartData[],
  dataRef: React.MutableRefObject<ChartData[]>,
  handleAdd: (rows: ChartData[]) => void
): ChartConfig => ({
  title: {
    title: "This is the title of chart.",
    style: { align: "center" },
  },
  data: filteredChartData,
  xField: "date",
  legend: { position: "bottom" },
  children: [
    {
      type: "line",
      yField: "value",
      shapeField: "smooth",
      style: { lineWidth: 2, opacity: 0.5 },
      axis: {
        y: {
          position: "right",
          title: "value",
          style: { titleFill: "#5B8FF9" },
        },
      },
    },
    {
      type: "line",
      yField: "pe",
      shapeField: "smooth",
      style: { stroke: "#5AD8A6", lineWidth: 1, opacity: 1.0 },
      axis: {
        y: {
          title: "pe",
          style: { titleFill: "#5AD8A6" },
        },
      },
    },
  ],
  interaction: { tooltip: true },
  onReady: ({ chart }) => {
    let selected: { data: { x: string } } | null = null;
    chart.on("plot:click", (evt: any) => {
      if (selected && selected.data) {
        const index = dataRef.current.findIndex((row) => row.date === selected?.data.x);
        const row = dataRef.current[index + 1];
        if (row) {
          handleAdd([row]);
        }
      }
    });
    chart.on("tooltip:show", (event: { data: { data: { x: string } } }) => {
      selected = event.data;
    });
  },
});