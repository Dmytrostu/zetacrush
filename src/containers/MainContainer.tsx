import React from 'react';

const MainContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <main className="container">{children}</main>;
};

export default MainContainer;
