import React from 'react'
import Card from './Card'

interface SensorCardProps {
  title: string
  value: number | null
  unit: string
  backgroundColor?: string
  textColor?: string
}

export default function SensorCard({
  title,
  value,
  unit,
  backgroundColor,
  textColor,
}: SensorCardProps) {
  return (
    <Card backgroundColor={backgroundColor} textColor={textColor}>
      <h2 style={{ marginBottom: '10px', textAlign: 'center' }}>{title}</h2>
      <p style={{ fontSize: '2rem', textAlign: 'center' }}>
        {value ?? '--'} {unit}
      </p>
    </Card>
  )
}
