import { useState } from 'react'
import './App.css'


function App() {

  let [userChoice, setUserChoice] = useState();
  const userChoiceHandle = (event) => {
    if (event.target.checked) {
      setUserChoice("Enabled");
    } else {
      setUserChoice("Disabled");
    }
  }


  return (
    <main className="config-app">
      <header>
        <p>Step 1 Of 5</p>
      </header>

      <section className="question-section">
        <h2>Enable Elastic Search</h2>
        <div class="container">
          <label class="switch" for="checkbox">
            <input type="checkbox" id="checkbox" onChange={userChoiceHandle}/>
            <div class="slider round"></div>
          </label>
        </div>
      </section>

      <nav className='app-navigation'>
        <button className="nav-button back-button">Back</button>
        <button className="nav-button next-button">Next</button>
      </nav>

      <section>
        <p>{userChoice}</p>
      </section>

    </main>
  )
}

export default App
