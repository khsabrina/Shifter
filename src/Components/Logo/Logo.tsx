import React from 'react'
import logo from './Logo.png'
import { Link } from 'react-router-dom'

const Logo = () => {
  return (
    <div>
        <img src={logo} style={{height:'80%'}} />
    </div>
  )
}

export default Logo