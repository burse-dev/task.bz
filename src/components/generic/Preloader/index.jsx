import React from 'react';

export default ({ className }) => (
  <div className={`d-flex justify-content-center ${className}`}>
    <div className="spinner-border text-secondary" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);
