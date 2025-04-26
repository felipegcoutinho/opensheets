// components/PieChartCategorias.tsx
"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Categoria = {
  categoria: string;
  valor: string; // vem como string, ex: "R$ 1000"
};

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28FD0",
  "#FF6699",
  "#FF4444",
  "#00E676",
];

export function PieChartCategorias({
  categorias,
}: {
  categorias: Categoria[];
}) {
  // Transformar para valores numéricos
  const data = categorias.map((item) => ({
    name: item.categoria,
    value: Number(item.valor.replace(/[^\d.-]/g, "")), // remove "R$", "," etc.
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
