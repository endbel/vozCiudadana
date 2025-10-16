import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'
import { div } from 'motion/react-client'
import StepsCard from './components/steps'

function App() {
  return (
    <div>
      <StepsCard/>
    </div>
  )
}

export default App
