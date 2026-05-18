import { useState } from 'react'
import { Link } from 'react-router-dom'
import reactLogo from '../assets/react.svg'
import viteLogo from '../assets/vite.svg'
import heroImg from '../assets/hero.png'
import './Home.css'

export default function Home() {
  const [count, setCount] = useState(0)

  return (
    <div className="minimal-container">
      <div className="minimal-hero">
        <div className="logo-stack">
          <img src={heroImg} className="logo-base" alt="" />
          <img src={reactLogo} className="logo-float react-spin" alt="React logo" />
          <img src={viteLogo} className="logo-float vite-bounce" alt="Vite logo" />
        </div>
      </div>
      
      <h1 className="minimal-title">Vite + React</h1>
      <p className="minimal-desc">
        An ultra-minimal, high-performance workspace powered by lightning-fast HMR and custom styling.
      </p>

      <div className="minimal-button-group">
        <button
          className="minimal-btn primary"
          onClick={() => setCount((count) => count + 1)}
        >
          Count: {count}
        </button>
        
        <Link to="/about" className="minimal-btn secondary">
          About Page →
        </Link>
      </div>
    </div>
  )
}
