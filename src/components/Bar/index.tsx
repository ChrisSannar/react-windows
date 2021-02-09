import React from 'react';
import './style.css';

import { WindowProps } from '../Window/index'
import cubeIcon from '../../icons/cube.svg'

export interface BarProps {
  windows: WindowProps[],
  newWindow: (window: WindowProps) => void,
}

// These next two are to represent new Apps to add to the page
const App1: WindowProps = {
  title: 'App1',
  icon: cubeIcon,
  width: '200',
  height: '150',
  x: 0,
  y: 0,
  zIndex: 0,
  minimized: false,
}

const App2: WindowProps = {
  title: 'App2',
  icon: cubeIcon,
  width: '200',
  height: '150',
  x: 0,
  y: 0,
  zIndex: 0,
  minimized: false,
}

const Bar: React.FC<BarProps> = (props) => {
  return <div className="Bar">
    <p>New:</p>
    <button onClick={() => props.newWindow({ ...App1})}>App1</button>
    <button onClick={() => props.newWindow({ ...App2})}>App2</button>
    <hr/>
    <div className="windows">
    {props.windows.map(window => <button>{window.title}</button>)}
    </div>
  </div>
}

export default Bar;