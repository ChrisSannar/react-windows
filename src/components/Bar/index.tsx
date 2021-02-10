import React, {useState, useContext, useEffect, useLayoutEffect, useRef} from 'react'
import './style.css'

import { MouseContext } from '../../util/contexts'
import { WindowProps } from '../Window/index'

import closeIcon from '../../icons/close.svg'
import cubeIcon from '../../icons/cube.svg'
import docIcon from '../../icons/doc.svg'

export interface BarProps {
  windows: WindowProps[]
  newWindow: (window: WindowProps) => void
  minimizeWindow: (index: number) => void
  closeWindow: (index: number) => void
}

// These next two are to represent new Apps to add to the page
const App1: WindowProps = {
  title: 'App1',
  icon: cubeIcon,
  width: '200',
  height: '150',
  x: 200,
  y: 100,
  zIndex: 0,
  minimized: false,
}
const App2: WindowProps = {
  title: 'App2',
  icon: docIcon,
  width: '200',
  height: '150',
  x: 200,
  y: 100,
  zIndex: 0,
  minimized: false,
}

const Bar: React.FC<BarProps> = (props) => {
  const [rearrangingWindowIndex, setRearrangingWindowIndex] = useState<number>(-1)
  const [windowItemStyles, setWindowItemStyles] = useState<React.CSSProperties[]>([])
  const [windowItemMousePositions, setWindowItemMousePositions] = useState<number[]>([])
  const [mouseX] = useContext(MouseContext)
  const windowItems = useRef<HTMLDivElement[] | null[]>([])
  const hr = useRef<HTMLHRElement | null>(null)

  useLayoutEffect(() => {
    const newWindowStyles: React.CSSProperties[] = []
    props.windows.forEach(() => {
      newWindowStyles.push({
        // position: "relative",
        left: "0px"
      });
    });
    windowItems.current = windowItems.current.slice(0, props.windows.length)
    setWindowItemStyles(newWindowStyles)
  }, [props.windows])

  // Move the 
  const slideWindowItemToX = (windowItemIndex: number, x: number) => {
    const newWindowItemStyles = [ ...windowItemStyles ].map(items => ({ ...items }))  // This map thing because typescript is difficult sometimes (read-only)

    // Get the current item boundaries
    const rect: DOMRect | undefined = windowItems.current[windowItemIndex]?.getBoundingClientRect();
    newWindowItemStyles[windowItemIndex].position = "absolute"

    // Prevent it from overlapping the hr
    const hrBoundary: number = (hr.current?.getBoundingClientRect().right ?? 0) + 5
    if (rect) {
      if ((x - windowItemMousePositions[windowItemIndex]) > hrBoundary) {
        newWindowItemStyles[windowItemIndex].left = (x - windowItemMousePositions[windowItemIndex]) + "px"
      } else {
        newWindowItemStyles[windowItemIndex].left = hrBoundary + "px"
      }
    }
    setWindowItemStyles(newWindowItemStyles)
  }

  useLayoutEffect(() => {
    if (rearrangingWindowIndex >= 0) {
      slideWindowItemToX(rearrangingWindowIndex, mouseX)
    }
  }, [mouseX])

  // useEffect(() => {
  //   console.log("INDEX", rearrangingWindowIndex, windowItemStyles)
  // }, [rearrangingWindowIndex, windowItemStyles])

  const handleWindowItemMouseDown = (index: number, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    
    // First, what window item are we arranging?
    setRearrangingWindowIndex(index)
    
    // Second, let it float free
    const newWindowItemStyles = [ ...windowItemStyles ].map(items => ({ ...items }))
    newWindowItemStyles[index].position = "absolute"

    // Now we need to get the ref position and set it as we move things around
    const rect = windowItems.current[index]?.getBoundingClientRect();
    const newWindowItemMousePositions = [...windowItemMousePositions]
    newWindowItemMousePositions[index] = event.clientX - (rect ?? {x: 0}).x
    setWindowItemMousePositions(newWindowItemMousePositions)
  }

  const moveWindowItemToPosition = (index: number, x: number) => {
    const newWindowItemStyles = [ ...windowItemStyles ].map(items => ({ ...items }))
    newWindowItemStyles[index].position = "relative"
    newWindowItemStyles[index].left = "0px"
    setWindowItemStyles(newWindowItemStyles)
    setRearrangingWindowIndex(-1)
  }

  return (
    <div className="Bar noselect">
      <p>New:</p>
      <button onClick={() => props.newWindow({ ...App1 })}>
        <img className="window-icon" src={cubeIcon} alt="New App1" draggable={false}/>
      </button>
      <button onClick={() => props.newWindow({ ...App2 })}>
        <img className="window-icon" src={docIcon} alt="New App2" draggable={false}/>
      </button>
      <hr ref={hr} />
      <div className="window-list">
        {props.windows.map((window: WindowProps, index: number) => (
          <div 
            key={index}
            className="window-item" 
            style={windowItemStyles[index]}
            ref={(el: HTMLDivElement | null) => {
              windowItems.current[index] = el
            }}
            onMouseDown={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => handleWindowItemMouseDown(index, event)}
            onMouseUp={() => moveWindowItemToPosition(index, mouseX)}
            >
            <div onClick={() => {
                props.minimizeWindow(index)
            }}>
              <img
                src={window.icon}
                className="window-icon"
                alt={window.title + ' icon'}
                draggable={false}
              />
              <p className="window-title">{window.title}</p>
            </div>
            <img
              src={closeIcon}
              className="close-icon"
              alt={'close ' + window.title + ' icon'}
              draggable={false}
              onClick={() => props.closeWindow(index)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Bar
