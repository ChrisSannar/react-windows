import React, { useState, useRef, useContext, useLayoutEffect } from 'react'
import { MouseContext } from '../util/contexts'
import './Window.css'

export interface WindowProps {
  width?: string
  height?: string
}

const Window: React.FC<WindowProps> = (props) => {
  const { width, height} = props;
  
  // Using the ref makes a app refresh smoother as oppose to updating the styling using the state
  const window = useRef<HTMLDivElement>(null);

  // We use the app components mouse information to make decisions here
  const [mouseX, mouseY] = useContext(MouseContext)

  // All the draging state information we need
  const [dragging, setDragging] = useState(false)
  const [mouseBoxPosition, setMouseBoxPosition] = useState([0, 0])  // Where the cursor clicks on the header

  // The default styling for the window
  const [windowStyling] = useState({
    width: (width ?? "0") + "px",
    height: (height ?? "0") + "px",
  })

  /*
    Dragging
  */
  // When we click on the header, start dragging it
  const handleHeaderMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    if (window.current) {

      // Make sure we've got the exact position of where we clicked on the header and then start dragging
      const rect = window.current.getBoundingClientRect()
      setMouseBoxPosition([event.clientX - rect.x, event.clientY - rect.y])
      setDragging(true)
    }
  }

  // Stop dragging when the mouse lets up
  const handleHeaderMouseUp = (): void => {
    setDragging(false)
  }

  // Move the box to the given cordinates (such cordinates are typically the mouse)
  const moveWindowToMouse = (x: number, y: number): void => {
    if (window.current) {

      // We want to move the box relative to where we clicked it (keep the cursor in the same spot on the box)
      const [mouseBoxX, mouseBoxY] = mouseBoxPosition;
      const left = x - mouseBoxX
      const top = y - mouseBoxY
      window.current.style.left = left + "px"
      window.current.style.top = top + "px"
    }
  }

  // If we're in the "dragging" state, then move the box to the cursor.
  // We're also using "LayoutEffect" for better visual performance
  useLayoutEffect(() => {
    if (dragging) {
      moveWindowToMouse(mouseX, mouseY)
      return
    }
  // eslint-disable-next-line
  }, [mouseX, mouseY])

  return <div 
    className="Window"
    ref={window}
    style={{ ...windowStyling }}
    >
      <div 
      className="WindowHeader"
      onMouseDown={handleHeaderMouseDown}
      onMouseUp={handleHeaderMouseUp}></div>
  </div>
}

export default Window