import { Link } from 'react-router-dom'
import reactLogo from '../assets/react.svg'
import viteLogo from '../assets/vite.svg'
import './About.css'
import './Home.css'

export default function About() {
  return (
    <div className="minimal-container">
      <div className="tech-badge-group">
        <img src={viteLogo} className="tech-badge-logo" alt="Vite logo" />
        <img src={reactLogo} className="tech-badge-logo react-spin" alt="React logo" />
      </div>

      <h1 className="minimal-title">About Workspace</h1>
      
      <p className="minimal-desc">
        A lightweight front-end foundation built with React 19, Vite 8, and TypeScript 6, engineered for high-performance developer experience.
      </p>

      <div className="minimal-button-group">
        <Link to="/" className="minimal-btn primary">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
