import React from 'react'
import { useElementSize } from 'usehooks-ts'



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
      <div
        style={{
          background: '#e10000',
          width: `8.5in`,
          transformOrigin: "0 0",
          transform: `translate(${margin}px, 0) scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
