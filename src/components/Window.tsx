import React, {useState} from 'react'
import './Window.css'

export interface WindowProps {
  width?: string
  height?: string
}

const Window: React.FC<WindowProps> = (props) => {
  const { width, height} = props;
  
  const [windowStyling] = useState({
    width: (width ?? "0") + "px",
    height: (height ?? "0") + "px",
  })

  return <div 
    className="Window"
    style={{ ...windowStyling }}
    >
    I'mma window
  </div>
}

export default Window