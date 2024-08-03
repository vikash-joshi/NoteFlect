import React, { useState, useEffect } from 'react';
import './toast.css';

const _ToastComponent = ({ show, onClose, message,type, duration }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (show) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            onClose();
            return 100;
          }
          return prev + 1;
        });
      }, duration / 100);
    }
  }, [show, duration, onClose]);

  return (
    <>
 {/*   <div className={`toast align-items-center ${type} border-0 ${show ? 'show' : ''}`} role="alert" aria-live="assertive" aria-atomic="true">
      <div className="d-flex">
        <div className="toast-body" style={{width: '90%'}}>
          {message}
          <div className="progress mt-2">
            <div className="progress-bar" role="progressbar" style={{ width: `${progress}%` }} aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100"></div>
          </div>
        </div>
        <button type="button" className="btn-close btn-close-black me-2 m-auto" aria-label="Close" onClick={onClose}></button>
      </div>
    </div>
    */}
<div className="toast">
<div className="toast-content">
    <i className="fas fa-solid fa-check check"></i>
    <div className="message">
        <span className="text text-1">Success</span>
        <span className="text text-2">Your changes has been saved</span>
    </div>
</div>
<i className="fa-solid fa-xmark close"></i>
<div className="progress"></div>
</div>

</>
  );
};

export default _ToastComponent;
