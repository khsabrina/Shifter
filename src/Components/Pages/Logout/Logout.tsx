import React from 'react';
import { useNavigate } from 'react-router-dom';


type Position = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';

interface LogoutPopupProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function Logout({ message, onConfirm, onCancel }: LogoutPopupProps) {
    const navigate = useNavigate();

    const handleConfirm = () => {
        onConfirm(); // Call the original onConfirm function
        navigate('/login'); // Redirect to the new page
    };

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: '16px 32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const messageStyle: React.CSSProperties = {
    marginBottom: 16,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  };

  const buttonsStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#f5f5f5',
    color: '#333',
    padding: '8px 16px',
    borderRadius: 4,
    border: 'none',
    marginRight: 16,
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: 16,
    outline: 'none',
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.25)',
  };

  return (
    <div style={overlayStyle}>
      <div style={containerStyle}>
        <div style={messageStyle}>{message}</div>
        <div style={buttonsStyle}>
          <button style={buttonStyle} onClick={handleConfirm}>Yes</button>
          <button style={buttonStyle} onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default Logout;
