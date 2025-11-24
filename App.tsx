import React, { Suspense } from 'react';
import { World } from './components/World';
import { UI } from './components/UI';
import { Loader } from '@react-three/drei';

const App: React.FC = () => {
  return (
    <div className="w-screen h-screen relative bg-black overflow-hidden select-none">
      <Suspense fallback={null}>
        <World />
      </Suspense>
      <UI />
      <Loader 
        containerStyles={{ background: '#050510' }} 
        innerStyles={{ background: '#111', width: '200px' }}
        barStyles={{ background: '#00ffff', height: '4px' }}
        dataStyles={{ color: '#00ffff', fontFamily: 'monospace', fontWeight: 'bold' }}
        dataInterpolation={(p) => `SYSTEM LOADING... ${p.toFixed(0)}%`} 
      />
    </div>
  );
};

export default App;