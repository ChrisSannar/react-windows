import React, { useState, useRef, useContext, useLayoutEffect } from 'react'
import './style.css'
import { MouseContext } from '../../util/contexts'

import util from './util'
import closeIcon from '../../icons/close.svg'
import minimizeIcon from '../../icons/minimize.svg'

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
  const [mouseWindowPosition, setMouseWindowPosition] = useState<
    [number, number]
  >([0, 0]) // Where the cursor clicks on the header

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
      window.current.style.width = width
        ? width + 'px'
        : window.current.style.width
      window.current.style.height = height
        ? height + 'px'
        : window.current.style.height
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
      setMouseWindowPosition([event.clientX - rect.x, event.clientY - rect.y])
      setDragging(true)
    }
  }

  // Stop dragging when the mouse lets up and update the parent
  const handleHeaderMouseUp = (): void => {
    setDragging(false)
    if (updateParentProperties && window.current) {
      const { left, top } = window.current?.getBoundingClientRect()
      updateParentProperties({
        left,
        top,
      })
    }
  }

  // If we're in the "dragging" state, then move the box to the cursor.
  // We're also using "LayoutEffect" for better visual performance
  useLayoutEffect(() => {
    if (dragging) {
      util.moveWindowToPosition(window, mouseWindowPosition, mouseX, mouseY)
      return
    }
    // eslint-disable-next-line
  }, [mouseX, mouseY])

  /*
    Resizing
  */
  // When we click on a window...
  const handleWindowMouseDown = () => {
    if (focus) {
      focus() // focus on the current window
    }
    setResizing(!!edge) // also start resizing if we're near an edge
  }

  // When we're finished resizing, unset the state, and then tell the parent what we changed
  const handleWindowMouseUp = () => {
    setResizing(false) // stop resizing when we're done

    // update the parent properties when finished
    if (updateParentProperties && window.current) {
      const { width, height, left } = window.current?.getBoundingClientRect()
      updateParentProperties({
        width,
        height,
        left,
      })
    }
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

  // Same deal with dragging, we're using a LayoutEffect to change the window position
  useLayoutEffect(() => {
    // Same as the dragging, if we're in a 'resizing' state, the move the mouse accordingly
    if (resizing) {
      util.resizeWindowToCoordinates(window, edge, mouseX, mouseY)
    }

    // Set the cursor when we're just hovering over it
    const edgey = util.getEdgeWithinMargin(window, mouseX, mouseY)
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
      style={{
        ...windowStyling,
        zIndex, // Include the zIndex with the styling
        display: minimized ? 'none' : 'block',
      }}
      onMouseDown={handleWindowMouseDown}
      onMouseUp={handleWindowMouseUp}
    >
      <div
        className="WindowHeader noselect"
        onMouseDown={handleHeaderMouseDown}
        onMouseUp={handleHeaderMouseUp}
      >
        <img
          src={icon}
          className="window-icon"
          alt="application icon"
          draggable={false}
        />
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
