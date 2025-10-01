import React, { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  backgroundColor?: string
  textColor?: string
  style?: React.CSSProperties
}

export default function Card({
  children,
  backgroundColor = '#212F3D', // color por defecto
  textColor = '#ECF0F1',
  style,
}: CardProps) {
  return (
    <div
      style={{
        background: backgroundColor,
        color: textColor,
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
        marginBottom: '20px',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
