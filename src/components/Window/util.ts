import React from 'react'

// How close we have to be in pixels to the window edge before we activate whichever function
const BORDER_MARGIN = 7

// The Smallest window we're allowed to have
const MIN_WIDTH = 180;
const MIN_HEIGHT = 130;

/*
  Dragging
*/
// Moves the given window to the given cordinates keeping track of the mouse's position in the window (such cordinates are typically the mouse)
const moveWindowToPosition = (
    window: React.RefObject<HTMLDivElement>, 
    mouseWindowPosition: number[], 
    x: number, 
    y: number
  ): void => {

  if (window.current) {
    // We want to move the box relative to where we clicked it (keep the cursor in the same spot on the box)
    const [mouseBoxX, mouseBoxY] = mouseWindowPosition
    const left = x - mouseBoxX
    const top = y - mouseBoxY
    window.current.style.left = left + 'px'
    window.current.style.top = top + 'px'
  }
}

/*
  Resizing
*/
// Lets us know if the x/y coordinates are within the borderMargin of the window edge
const nearWindow = (
    window: React.RefObject<HTMLDivElement>, 
    x: number, 
    y: number,
    borderMargin: number, 
  ): boolean => {

  if (window.current) {

    // Simply check if x/y is within the borderMargin of our window
    const rect = window.current.getBoundingClientRect()
    return (
      x > rect.left - borderMargin &&
      x < rect.right + borderMargin &&
      y > rect.top - borderMargin &&
      y < rect.bottom + borderMargin
    )
  } else {
    return false
  }
}

// Returns which edge the x/y coordinates are closes to within the borderMargin
type BorderType = "bottom" | "left" | "right" | "bottomleft" | "bottomright" | "";
const getEdgeWithinMargin = (
    window: React.RefObject<HTMLDivElement>, 
    x: number, 
    y: number, 
    borderMargin: number = BORDER_MARGIN
  ): string => {

  let result: BorderType = ""

  // First, we need to see if we're near a window
  if (nearWindow(window, x, y, borderMargin) && window.current) {
    
    // If we are, then return the BorderType which ever we're closest to
    const rect = window.current.getBoundingClientRect()
    // if (Math.abs(y - rect.top) < borderMargin) {
    //   result += "top"
    // }
    if (Math.abs(y - rect.bottom) < borderMargin) {
      result += 'bottom'
    }
    if (Math.abs(x - rect.left) < borderMargin) {
      result += 'left'
    }
    if (Math.abs(x - rect.right) < borderMargin) {
      result += 'right'
    }
  }
  return result
}

// resizes the window based on were the mouse is
const resizeWindowToCoordinates = (
    window: React.RefObject<HTMLDivElement>, 
    edge: BorderType, 
    x: number, 
    y: number, 
    minWidth: number = MIN_WIDTH, 
    minHeight: number = MIN_HEIGHT
  ) => {
  
    if (window.current) {
      const {
        width,
        height,
        bottom,
        left,
        right,
      } = window.current.getBoundingClientRect()

      // Our height and width constraints
      if (width < minWidth) {
        window.current.style.width = (width + 1) + 'px';
        window.current.style.left = (left - (edge.includes("left") ? 1 : 0)) + 'px'
      } else if (height < minHeight) {
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

const util: any = {
  moveWindowToPosition,
  nearWindow,
  getEdgeWithinMargin,
  resizeWindowToCoordinates
};

export default util;