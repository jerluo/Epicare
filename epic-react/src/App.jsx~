import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div class="header">
        <h1>Epic AIChatbot</h1>
        <p>Epic team 2 creation</p>
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          click here for assitance
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <div id = "chat">
        <div id = "chat-messages">
	</div> 
	<form id = "chat-form" method = "post">
	  <input type = "text" name = "message" placeholder = "Enter a message..." maxlength = {300} autocomplete = "off"/>
	  <button type = "submit">Send</button>
	</form>
      </div>	  
    </>
  )
}

export default App
