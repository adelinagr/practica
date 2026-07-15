"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from "recharts";

interface RadarChartComponentProps {
  data: {
    subject: string;
    A: number;
    fullMark: number;
  }[];
}

export function RadarChartComponent({ data }: RadarChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis 
          dataKey="subject" 
          tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
        />
        <PolarRadiusAxis 
          angle={30} 
          domain={[0, 100]} 
          tick={{ fill: '#94a3b8', fontSize: 10 }}
        />
        <Tooltip 
          contentStyle={{ 
            borderRadius: '12px', 
            border: 'none',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
          }}
        />
        <Radar
          name="Benchmark Ideal"
          dataKey="fullMark"
          stroke="#94a3b8"
          fill="#cbd5e1"
          fillOpacity={0.1}
          isAnimationActive={false}
        />
        <Radar
          name="Scor (%)"
          dataKey="A"
          stroke="#4f46e5"
          fill="#4f46e5"
          fillOpacity={0.3}
          dot={{ r: 4, fill: "#4f46e5" }}
          activeDot={{ r: 6 }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
