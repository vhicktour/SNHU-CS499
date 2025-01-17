import React from 'react';

export const RadioGroup = ({ children, value, onValueChange, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {React.Children.map(children, child => 
        React.cloneElement(child, { 
          checked: child.props.value === value,
          onChange: () => onValueChange(child.props.value)
        })
      )}
    </div>
  );
};

RadioGroup.Item = ({ value, checked, onChange, id, children }) => (
  <div className="flex items-center">
    <input
      type="radio"
      id={id}
      value={value}
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
    />
    {children}
  </div>
);