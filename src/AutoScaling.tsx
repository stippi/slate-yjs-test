import React, {PropsWithChildren} from 'react'
import { useElementSize } from 'usehooks-ts'
import { ScaleProvider } from "./ScaleContext";

type AutoScalingProps = PropsWithChildren<{
  margin?: number
  childWidth: number
  maxChildWidth: number
}>;

export const AutoScaling = ({children, childWidth, maxChildWidth, margin = 0}: AutoScalingProps) => {

  const [ref, { width }] = useElementSize()

  let scaledWidth = width - margin * 2
  if (scaledWidth > maxChildWidth) {
    scaledWidth = maxChildWidth
    margin = (width - scaledWidth) / 2
  }
  const scale = scaledWidth / childWidth

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
