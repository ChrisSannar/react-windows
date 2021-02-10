import React, {useState} from 'react'

// A simple input app
const Input: React.FC = () => {
  const [text, setText] = useState("")

  return <div>
    <input placeholder="Add your input here" onChange={(e) => setText(e.target.value)} />
    <p>{text}</p>
  </div>
}

export default Input;