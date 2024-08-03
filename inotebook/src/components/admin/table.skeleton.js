import React from 'react';
import './admin.css';

export default function TableSkeletonLoader () {
  return (
    <div className="table-container">
      <table className="table-skeleton">
        <thead>
          <tr>
            {[...Array(7)].map((_, index) => (
              <th key={index}><div className="skeleton skeleton-header"></div></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, rowIndex) => (
            <tr key={rowIndex}>
              {[...Array(7)].map((_, colIndex) => (
                <td key={colIndex}><div className="skeleton skeleton-cell"></div></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

