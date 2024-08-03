import React, { useState, useEffect } from 'react';
import './newtoast.css'

const ToastComponent = ({ show, onClose,type, message, duration }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (show) {
      setProgress(100); // Start from 100%
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            onClose();
            return 0;
          }
          return prev - 1; // Decrease the progress bar
        });
      }, duration / 100); // Adjust interval for the duration

      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [show, duration, onClose]);

  return (
    <div className={`toast align-items-center ${type} border-0 ${show ? 'show' : ''}`} role="alert" aria-live="assertive" aria-atomic="true">
      <div className="d-flex">
        <div className="toast-body">
          <div className="align-items-center d-flex justify-content-center">
            <div className="me-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M9 12l2 2 4-4"></path><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path></svg>
            </div>
            <div>
              <strong className="me-auto">Success</strong>
              <p>{message}</p>
            </div>
          </div>
          <div className="progress mt-2">
            <div className={`progress-bar bg-${type?.replace('text-','')}`} role="progressbar" style={{ width: `${progress}%` }} aria-valuenow={progress} aria-valuemin="1" aria-valuemax="100"></div>
          </div>
     
        </div>
        <button type="button" className="btn-close mt-2" aria-label="Close" onClick={onClose}></button>
      </div>
    </div>
  );
};

export default ToastComponent;
