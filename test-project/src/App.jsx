import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SignIn from 'authence';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <h1>Hello</h1>
     <SignIn path="/" signUpurl="/sign-up" forceRedirectUrl="/" />
    </>
  )
}

export default App
