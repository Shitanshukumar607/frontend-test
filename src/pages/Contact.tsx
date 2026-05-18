import { Link } from 'react-router-dom'
import reactLogo from '../assets/react.svg'
import './Contact.css'
import './Home.css'

export default function Contact() {
  const contactLinks = [
    { name: 'GitHub', url: 'https://github.com', label: 'Contribute' },
    { name: 'Discord', url: 'https://chat.vite.dev', label: 'Community' },
    { name: 'Email', url: 'mailto:hello@example.com', label: 'Get in Touch' }
  ]

  return (
    <div className="minimal-container">
      <div className="contact-badge-container">
        <img src={reactLogo} className="contact-badge react-pulse" alt="React logo" />
      </div>

      <h1 className="minimal-title">Get in Touch</h1>
      
      <p className="minimal-desc">
        Have questions or want to collaborate? Connect with our team through our community channels.
      </p>

      <div className="contact-links-grid">
        {contactLinks.map((link, index) => (
          <a key={index} href={link.url} target="_blank" rel="noreferrer" className="contact-link-item">
            <span className="contact-label">{link.label}</span>
            <span className="contact-name">{link.name} →</span>
          </a>
        ))}
      </div>

      <div className="minimal-button-group">
        <Link to="/" className="minimal-btn primary">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
