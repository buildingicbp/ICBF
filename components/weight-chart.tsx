'use client'

import { useEffect, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent } from './ui/card'
import { Skeleton } from './ui/skeleton'

interface WeightEntry {
  id: string
  weight: number
  recorded_at: string
  notes?: string
}

export function WeightChart() {
  const [weightData, setWeightData] = useState<WeightEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeightData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/weight-entries')
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to fetch weight data')
        }
        const data = await response.json()
        setWeightData(data)
      } catch (err) {
        console.error('Error fetching weight data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load weight data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchWeightData()
  }, [])

  // Format data for the chart
  const chartData = weightData.map(entry => {
    const date = new Date(entry.recorded_at)
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: parseFloat(entry.weight),
      fullDate: date.toISOString().split('T')[0]
    }
  })

  // Sort by date to ensure chronological order
  chartData.sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime())

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-red-500">
          {error}
        </CardContent>
      </Card>
    )
  }

  if (weightData.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          No weight data available. Log your first weight to see the chart.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-2 pt-4">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                padding={{ left: 20, right: 20 }}
              />
              <YAxis 
                domain={['dataMin - 1', 'dataMax + 1']}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={40}
                tickFormatter={(value) => `${value}kg`}
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <Tooltip 
                formatter={(value: number) => [`${value} kg`, 'Weight']}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  fontSize: '14px',
                }}
              />
              <Area
                type="monotone"
                dataKey="weight"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorWeight)"
                strokeWidth={2}
                dot={{
                  stroke: '#3b82f6',
                  strokeWidth: 2,
                  fill: 'white',
                  r: 4,
                }}
                activeDot={{
                  stroke: '#2563eb',
                  strokeWidth: 2,
                  fill: '#3b82f6',
                  r: 6,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
