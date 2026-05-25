import { NavLink } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-dot"></span>
        <span className="brand-text">Vite + React</span>
      </div>
      <div className="navbar-links">
        <NavLink 
          to="/" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          end
        >
          Home
        </NavLink>
        <NavLink 
          to="/products" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          Products
        </NavLink>
        <NavLink 
          to="/about" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          About
        </NavLink>
      </div>
    </nav>
  )
}
