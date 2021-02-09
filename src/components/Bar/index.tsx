import React from 'react'
import './style.css'

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
  return (
    <div className="Bar noselect">
      <p>New:</p>
      <button onClick={() => props.newWindow({ ...App1 })}>
        <img className="window-icon" src={cubeIcon} alt="New App1"/>
      </button>
      <button onClick={() => props.newWindow({ ...App2 })}>
        <img className="window-icon" src={docIcon} alt="New App2"/>
      </button>
      <hr />
      <div className="window-list">
        {props.windows.map((window: WindowProps, index: number) => (
          <div key={index} className="window-item">
            <div  onClick={() => props.minimizeWindow(index)}>
              <img
                src={window.icon}
                className="window-icon"
                alt={window.title + ' icon'}
              />
              <p className="window-title">{window.title}</p>
            </div>
            <img
              src={closeIcon}
              className="close-icon"
              alt={'close ' + window.title + ' icon'}
              onClick={() => props.closeWindow(index)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Bar
