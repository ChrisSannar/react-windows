import React, {useState} from 'react';
import './App.css';
import Window, { WindowProps } from './components/Window'
import { MouseContext } from './util/contexts'

function App() {
  // The windows we'll be showing on the page
  const [windows, setWindows] = useState<WindowProps[]>([
    {
      width: "200",
      height: "150",
      zIndex: 0,
    },
    {
      width: "300",
      height: "200",
      zIndex: 0,
    }
  ])
  const [mousePosition, setMousePosition] = useState<[number, number]>([0, 0])

  // Re Order the zIndex of the window props
  const setWindowOrder = (index: number): void => {
    const newWindows = [...windows]

    // Find the highest zIndex
    let highestZIndex: number = 0;
    for (const window of newWindows) {
      highestZIndex = highestZIndex > window.zIndex ? highestZIndex : window.zIndex
    }
    newWindows[index].zIndex = highestZIndex + 1  // Go one more than that
    setWindows(newWindows)
  }

  return (
    <div className="App" onMouseMove={(e) => setMousePosition([e.clientX, e.clientY])}>
      <MouseContext.Provider value={mousePosition}>
        {windows.map((window: WindowProps, index: number) => 
          <Window
            key={index}
            {...window}
            focus={() => setWindowOrder(index)}
          />
        )}
      </MouseContext.Provider>
    </div>
  );
}

export default App;
