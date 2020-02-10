import React, { useState } from 'react';

export const Remount = (Component) => {
  const Remountable = (props) => {
    const [key, setKey] = useState(Math.random());
    const remount = () => setKey(Math.random());
    return <Component key={key} remount={remount} {...props} />;
  };
  return Remountable;
};
