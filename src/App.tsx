import React, {useState} from 'react';
import './App.css';
import Window, { WindowProps } from './components/Window'
import { MouseContext } from './util/contexts'

function App() {
  // The windows we'll be showing on the page
  const [windows] = useState<WindowProps[]>([
    {
      width: "200",
      height: "150",
    }
  ])
  const [mousePosition, setMousePosition] = useState<[number, number]>([0, 0])

  return (
    <div className="App" onMouseMove={(e) => setMousePosition([e.clientX, e.clientY])}>
      <MouseContext.Provider value={mousePosition}>
        {windows.map((window: WindowProps, index: number) => 
          <Window
            key={index}
            {...window}
          />
        )}
      </MouseContext.Provider>
    </div>
  );
}

export default App;
