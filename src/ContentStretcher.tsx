// From https://dirask.com/posts/React-stretch-element-content-to-parent-with-css-transform-scale-Dl0WkD
import React from 'react';
import ReactDOM from 'react-dom';

type Size = {
  width: number
  height: number
}

const AutoSizer: React.FC<any> = React.memo(({ interval, children, ...other }) => {
	const reference = React.useRef<HTMLElement>();
	const [size, setSize] = React.useState<Size>();
	React.useEffect(() => {
    let storedWidth = size?.width;
    let storedHeight = size?.height;
    const id = setInterval(() => {
      const element = reference.current;
      if (element) {
        const width = element.offsetWidth;
        const height = element.offsetHeight;
        if (width != storedWidth || height != storedHeight) {
          storedWidth = width;
          storedHeight = height;
          setSize({ width, height });
        }
      }
    }, interval ?? 100);
    return () => {
      clearInterval(id);
    };
	}, [interval]);
	return (
	  <div ref={reference} {...other}>
      {size && children && children(size.width, size.height)}
	  </div>
	);
});

export const ContentStretcher: React.FC<any> = ({sizerInterval, contentWidth, contentHeight, children, ...other}) => (
  <AutoSizer
    {...other}
    style={{
      ...other.style,
      position: 'relative',
      display: 'flex'
    }}
    interval={sizerInterval}
  >
    {(containerWidth: number, containerHeight: number) => {
  		const contentScale = containerWidth / contentWidth;
  		return (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) scale(${contentScale})`,
            transformOrigin: '50% 50%',
          }}
        >
          {children}
        </div>
      );
    }}
  </AutoSizer>
);
