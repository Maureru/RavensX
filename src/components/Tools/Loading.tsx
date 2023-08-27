import React from 'react';

interface LoadingProps {}

const Loading: React.FC<LoadingProps> = () => {
  return (
    <div className="mx-auto">
      <h1>
        <div
          style={{
            border: '6px solid transparent',
            borderRight: '6px solid blue',
            borderTop: '6px solid blue',
            borderBottom: '6px solid blue',
          }}
          className="w-16 h-16 rounded-full animate-spin"
        />
      </h1>
    </div>
  );
};
export default Loading;
