import React, { useState } from 'react';
import '../src/CSS/AlertPopup.css'


const AlertPopup = ({ message, onClose }) => {
  return (
    <>
    <div className="alert-backdrop"></div>
    <div className="alert-popup">
      <div className="alert-header">
        <span className="alert-title"></span>
        <span className='close-button' style={{ cursor: 'pointer' }} onClick={onClose}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M6 18L18 6M6 6L18 18" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg></span>
      </div>
      <div className="alert-body">
        {message}
      </div>
    </div>
    </>
  );
};
 
export default AlertPopup;
