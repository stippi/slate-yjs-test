import React, {PropsWithChildren} from 'react'
import { useElementSize } from 'usehooks-ts'
import { ScaleProvider } from "./ScaleContext";

type AutoScalingProps = PropsWithChildren<{
  margin?: number
  childWidth: number
}>;

export const AutoScaling = ({children, childWidth, margin = 0}: AutoScalingProps) => {

  const [ref, { width }] = useElementSize()

  const parentWidth = width - margin * 2
  const scale = parentWidth / childWidth

  return (
    <div
      ref={ref}
      style={{
        background: '#e1e1e1'
      }}
    >
      <ScaleProvider scale={scale}>
        <div
          style={{
            background: '#e10000',
            width: `${childWidth}px`,
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
