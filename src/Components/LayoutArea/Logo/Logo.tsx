import React from 'react'
import logo from './Logo.png'
import { Link } from 'react-router-dom'

const Logo = () => {
  return (
    <div>
      <img className='Logo' src={logo} />
    </div>
  )
}

export default Logo