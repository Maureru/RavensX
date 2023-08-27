import React from 'react';
import { Outlet } from 'react-router-dom';

interface RootProps {}

const Root: React.FC<RootProps> = () => {
  return (
    <div className="dark:text-white relative dark:bg-gray-950">
      <Outlet />
    </div>
  );
};
export default Root;
