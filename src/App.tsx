import React, {useState} from 'react';
import './App.css';
import Window, { WindowProps } from './components/Window'

function App() {
  const [windows] = useState<WindowProps[]>([
    {
      width: "200",
      height: "150",
    }
  ])

  return (
    <div className="App">
      {windows.map((window: WindowProps, index: number) => 
        <Window
          {...window}
        />
      )}
    </div>
  );
}

export default App;
