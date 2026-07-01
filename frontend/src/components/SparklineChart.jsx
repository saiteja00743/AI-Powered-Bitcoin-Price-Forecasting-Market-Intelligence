import { useEffect, useRef } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

function formatPrice(p) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(p);
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-3 py-2">
        <p className="text-btc-orange font-mono font-semibold text-sm">{formatPrice(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export default function SparklineChart({ sparklineData = [], prediction }) {
  const data = sparklineData.map((price, i) => ({
    index: i,
    price,
  }));

  // Append prediction as last point if provided
  if (prediction && data.length > 0) {
    data.push({ index: data.length, price: prediction, isPrediction: true });
  }

  const isUp = data.length > 1 ? data[data.length - 1].price >= data[0].price : true;
  const color = isUp ? '#10B981' : '#EF4444';

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-600">
        <span>No chart data</span>
      </div>
    );
  }

  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
          <XAxis hide />
          <YAxis
            domain={['auto', 'auto']}
            hide
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2}
            fill="url(#priceGradient)"
            dot={false}
            activeDot={{ r: 4, fill: color, stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
