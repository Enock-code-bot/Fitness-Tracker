import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WeeklyChartProps {
  data: Array<{ day: string; workouts: number; calories: number; duration: number }>;
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip 
            formatter={(value: number, name: string) => [
              value,
              name === 'workouts' ? 'Workouts' : name === 'calories' ? 'Calories' : 'Minutes'
            ]}
          />
          <Bar dataKey="workouts" fill="#3B82F6" name="workouts" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}