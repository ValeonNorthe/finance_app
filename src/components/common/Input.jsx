// src/components/common/Input.jsx
import React from 'react';

export const Input = ({ label, type = "text", value, onChange, placeholder, ...props }) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label style={{ 
          display: 'block', 
          fontSize: '13px', 
          fontWeight: '600', 
          color: 'var(--text-muted)', 
          marginBottom: '6px' 
        }}>
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        {...props}
        className="modern-input" // App.cssで定義したスタイルが適用される
      />
    </div>
  );
};