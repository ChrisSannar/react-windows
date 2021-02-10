import React, {useState} from 'react'

// A simple clicker app
const Clicker: React.FC = () => {
  const [count, setCount] = useState(0)

  return <div>
    <p>You have pressed the button {count} times.</p>
    <button onClick={() => setCount(count + 1)}>
      Click Me
    </button>
  </div>
}

export default Clicker;