import React, { useState } from 'react'
import './App.css'
import Window, { WindowProps } from './components/Window/index'
import Bar from './components/Bar/index'
import { MouseContext } from './util/contexts'

function App() {
  // The windows we'll be showing on the page
  const [windows, setWindows] = useState<WindowProps[]>([])
  const [mousePosition, setMousePosition] = useState<[number, number]>([0, 0])

  // Re Order the zIndex of the window props
  const setWindowOrder = (index: number, newWindows: WindowProps[]): void => {

    // Find the highest zIndex
    let highestZIndex: number = 0
    for (const window of newWindows) {
      highestZIndex =
        highestZIndex > window.zIndex ? highestZIndex : window.zIndex
    }
    newWindows[index].zIndex = highestZIndex + 1 // Go one more than that
    setWindows(newWindows)
  }

  // Sets a window to be minimized
  const minimizeWindow = (index: number): void => {
    const newWindows = [...windows]
    newWindows[index].minimized = !newWindows[index].minimized
    setWindows(newWindows)
  }

  // Removes a window
  const removeWindow = (index: number): void => {
    const newWindows = [...windows]
    newWindows.splice(index, 1)
    setWindows(newWindows)
  }

  // Update all the properties if they are provided
  const updateProps = (index: number, props: any) => {
    const newWindows = [...windows]
    newWindows[index].x = props.left ?? windows[index].x
    newWindows[index].y = props.top ?? windows[index].y
    newWindows[index].width = props.width ?? windows[index].width
    newWindows[index].height = props.height ?? windows[index].height
    setWindows(newWindows)
  }

  // Adds a new window to the set of windows. We're also calling the 'setWindowOrder' to focus on it
  const addNewWindow = (newWindow: WindowProps) => {
    setWindowOrder(windows.length, [...windows, newWindow])
  }

  // Moves the given index of a window to a new index
  const moveWindowToIndex = (index: number, newIndex: number) => {
    const newWindows = [...windows];
    const movingWindow = newWindows.splice(index, 1)[0];
    newWindows.splice(newIndex, 0, movingWindow);
    setWindows(newWindows);
  }

  return (
    <MouseContext.Provider value={mousePosition}>
      <div
        className="App"
        onMouseMove={(e) => setMousePosition([e.clientX, e.clientY])}
      >
        {windows.map((window: WindowProps, index: number) => {
          return (
            <Window
              key={index}
              {...window}
              focus={() => setWindowOrder(index, windows)}
              minimize={() => minimizeWindow(index)}
              close={() => removeWindow(index)}
              updateParentProperties={(props: any) => updateProps(index, props)}
            />
          )
        })}
        <Bar 
          windows={windows} 
          newWindow={addNewWindow}
          minimizeWindow={(index: number) => {
            setWindowOrder(index, windows)
            minimizeWindow(index)
          }}
          closeWindow={(index: number) => removeWindow(index)}
          moveWindowToIndex={moveWindowToIndex}/>
      </div>
    </MouseContext.Provider>
  )
}

export default App
