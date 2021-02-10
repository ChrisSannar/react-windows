import React, { useState, useRef, useContext, useLayoutEffect } from 'react'
import { MouseContext } from '../../util/contexts'

import closeIcon from '../../icons/close.svg'
import minimizeIcon from '../../icons/minimize.svg'
import './style.css'

export interface WindowProps {
  title: string
  icon: string
  minimized: boolean
  width?: string
  height?: string
  x?: number
  y?: number
  zIndex: number
  focus?: () => void
  minimize?: () => void
  close?: () => void
  updateParentProperties?: (props: any) => void
}

// How close we have to be in pixels to the window edge before we activate whichever function
const BORDER_MARGIN = 5

// The Smallest box we're allowed to have
const MIN_WIDTH = 100;
const MIN_HEIGHT = 70;

/**
 * A draggable, resizable window that allows for focusing...
 */
const Window: React.FC<WindowProps> = (props) => {
  const { 
    title, 
    icon, 
    minimized, 
    width, 
    height, 
    x,
    y,
    zIndex, 
    focus, 
    minimize, 
    close,
    updateParentProperties,
  } = props

  // Using the ref makes a app refresh smoother as oppose to updating the styling using the state
  const window = useRef<HTMLDivElement>(null)

  // We use the app components mouse information to make decisions here
  const [mouseX, mouseY] = useContext(MouseContext)

  // All the draging state information we need
  const [dragging, setDragging] = useState<boolean>(false)
  const [mouseBoxPosition, setMouseBoxPosition] = useState<[number, number]>([
    0,
    0,
  ]) // Where the cursor clicks on the header

  // All the resizing state information we need
  const [resizing, setResizing] = useState<boolean>(false)
  const [edge, setEdge] = useState<string>('')

  // The default styling for the window
  const [windowStyling, setWindowStyling] = useState({
    width: (width ?? '0') + 'px',
    height: (height ?? '0') + 'px',
    left: (x ?? 0) + 'px',
    top: (y ?? 0) + 'px',
    cursor: 'auto',
  })

  // This fixes a strange bug that whenever you remove a window it resets to another window. (remove this to test and understand)
  useLayoutEffect(() => {
    if (window.current) {
      window.current.style.left = x ? x + 'px' : window.current.style.left
      window.current.style.top = y ? y + 'px' : window.current.style.top
      window.current.style.width = width ? width + "px" : window.current.style.width 
      window.current.style.height = height ? height + "px" : window.current.style.height 
    }
  }, [x, y, width, height])

  /*
    Dragging
  */
  // When we click on the header, start dragging it
  const handleHeaderMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ): void => {
    if (window.current) {
      // Make sure we've got the exact position of where we clicked on the header and then start dragging
      const rect = window.current.getBoundingClientRect()
      setMouseBoxPosition([event.clientX - rect.x, event.clientY - rect.y])
      setDragging(true)
    }
  }

  // Stop dragging when the mouse lets up and update the parent
  const handleHeaderMouseUp = (): void => {
    setDragging(false)
    if (updateParentProperties && window.current) {
      const {left, top} = window.current?.getBoundingClientRect();
      updateParentProperties({
        left,
        top
      })
    }
  }

  // Move the box to the given cordinates (such cordinates are typically the mouse)
  const moveWindowToPosition = (x: number, y: number): void => {
    if (window.current) {
      // We want to move the box relative to where we clicked it (keep the cursor in the same spot on the box)
      const [mouseBoxX, mouseBoxY] = mouseBoxPosition
      const left = x - mouseBoxX
      const top = y - mouseBoxY
      window.current.style.left = left + 'px'
      window.current.style.top = top + 'px'
    }
  }

  // If we're in the "dragging" state, then move the box to the cursor.
  // We're also using "LayoutEffect" for better visual performance
  useLayoutEffect(() => {
    if (dragging) {
      moveWindowToPosition(mouseX, mouseY)
      return
    }
    // eslint-disable-next-line
  }, [mouseX, mouseY])

  /*
    Resizing
  */
  // Lets us know if x/y are within the BORDER_MARGIN of the window edge
  const nearWindow = (x: number, y: number): boolean => {
    if (window.current) {
      const rect = window.current.getBoundingClientRect()
      return (
        x > rect.left - BORDER_MARGIN &&
        x < rect.right + BORDER_MARGIN &&
        y > rect.top - BORDER_MARGIN &&
        y < rect.bottom + BORDER_MARGIN
      )
    } else {
      return false
    }
  }

  // Returns which edge we're closest to
  const getEdgeWithinMargin = (x: number, y: number): string => {
    let result = ''
    if (nearWindow(x, y) && window.current) {
      const rect = window.current.getBoundingClientRect()
      // if (Math.abs(y - rect.top) < BORDER_MARGIN) {
      //   result += "top"
      // }
      if (Math.abs(y - rect.bottom) < BORDER_MARGIN) {
        result += 'bottom'
      }
      if (Math.abs(x - rect.left) < BORDER_MARGIN) {
        result += 'left'
      }
      if (Math.abs(x - rect.right) < BORDER_MARGIN) {
        result += 'right'
      }
    }
    return result
  }

  // Sets the cursor and the current resize configuration
  const setCursorToEdge = (edge: string) => {
    switch (edge) {
      case 'top':
      case 'bottom':
        setWindowStyling({ ...windowStyling, cursor: 'ns-resize' })
        break
      case 'left':
      case 'right':
        setWindowStyling({ ...windowStyling, cursor: 'ew-resize' })
        break
      case 'bottomleft':
      case 'topright':
        setWindowStyling({ ...windowStyling, cursor: 'nesw-resize' })
        break
      case 'topleft':
      case 'bottomright':
        setWindowStyling({ ...windowStyling, cursor: 'nwse-resize' })
        break
      default:
        setWindowStyling({ ...windowStyling, cursor: 'auto' })
        break
    }
  }

  // resizes the window based on were the mouse is
  const resizeWindowToMouse = (x: number, y: number) => {
    if (window.current) {
      const {
        width,
        height,
        bottom,
        left,
        right,
      } = window.current.getBoundingClientRect()

      // Our height and width constraints
      if (width < MIN_WIDTH) {
        window.current.style.width = (width + 1) + 'px';
        window.current.style.left = (left - ( edge.includes("left") ? 1 : 0)) + 'px'
      } else if (height < MIN_HEIGHT) {
        window.current.style.height = (height + 1) + 'px';
      } else {

        // What edge are we resizing?
        switch (edge) {
          case 'bottom':
            // Set the new height to itself minus the new difference (plus 1 to keep up the cursor)
            window.current.style.height = height - (bottom - y) + 1 + 'px'
            break
          case 'right':
            // Same idea here
            window.current.style.width = width - (right - x) + 1 + 'px'
            break
          case 'bottomright':
            // Run both values in the case of a corner
            window.current.style.height = height - (bottom - y) + 1 + 'px'
            window.current.style.width = width - (right - x) + 1 + 'px'
            break
          case 'left':
            // With the left, we have to shift it over as well
            window.current.style.width = width + (left - x) + 'px'
            window.current.style.left = x + 'px'
            break
          case 'bottomleft':
            window.current.style.height = height - (bottom - y) + 1 + 'px'
            window.current.style.width = width + (left - x) + 'px'
            window.current.style.left = x + 'px'
            break
        }
      }

    }
  }

  // Same deal with dragging, we're using a LayoutEffect to change the box position
  useLayoutEffect(() => {
    // Same as the dragging, if we're in a 'resizing' state, the move the mouse accordingly
    if (resizing) {
      resizeWindowToMouse(mouseX, mouseY)
    }

    // Set the cursor when we're just hovering over it
    const edgey = getEdgeWithinMargin(mouseX, mouseY)
    if (edgey) {
      setEdge(edgey)
      setCursorToEdge(edgey)
    } else {
      setEdge('')
      setWindowStyling({ ...windowStyling, cursor: 'auto' })
    }

    // eslint-disable-next-line
  }, [mouseX, mouseY])

  return (
    <div
      className="Window"
      ref={window}
      style={{ ...windowStyling, zIndex, display: minimized ? "none" : "block" }} // Include the zIndex with the styling
      onMouseDown={() => {
        if (focus) {
          focus() // When we click on the box, we want to focus on it.
        }
        setResizing(!!edge) // also start resizing if we're near an edge
      }}
      onMouseUp={() => {
        setResizing(false)  // stop resizing when we're done

        // update the parent properties when finished
        if (updateParentProperties && window.current) {
          const { width, height, left } = window.current?.getBoundingClientRect();
          updateParentProperties({
            width,
            height,
            left,
          })
        }
      }} 
    >
      <div
        className="WindowHeader noselect"
        onMouseDown={handleHeaderMouseDown}
        onMouseUp={handleHeaderMouseUp}
      >
        <img src={icon} className="window-icon" alt="application icon" draggable={false} />
        <span className="window-title">{title}</span>
        <div className="op-icons">
          <img
            className="minimize-icon"
            alt="minimize window"
            draggable={false}
            src={minimizeIcon}
            onClick={minimize}
          />
          <img
            className="close-icon"
            alt="close window"
            draggable={false}
            src={closeIcon}
            onClick={close}
          />
        </div>
      </div>
    </div>
  )
}

export default Window
