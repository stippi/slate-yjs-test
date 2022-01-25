import React from 'react'
import { useElementSize } from 'usehooks-ts'
import { ScaleProvider } from "./ScaleContext";

export const AutoScaling: React.FC<any> = ({children, ...other}) => {

  const [squareRef, { width }] = useElementSize()

  const margin = 50
  const parentWidth = width - margin * 2
  const scale = parentWidth / 500

  return (
    <div {...other}
      ref={squareRef}
      style={{
        background: '#e1e1e1'
      }}
    >
      <ScaleProvider scale={scale}>
        <div
          style={{
            background: '#e10000',
            width: `500px`,
            transformOrigin: "0 0",
            transform: `translate(${margin}px, 0) scale(${scale})`,
          }}
        >
          {children}
        </div>
      </ScaleProvider>
    </div>
  )
}
