import React from 'react';
import Hero from './components/Hero';
import Demo from './components/Demo';

const App = () => {
    return (
        <main onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <div className='main'>
                <div className='gradient' />
            </div>

            <div className='app'>
                <Hero />
                <Demo />
            </div>
        </main>
    );
};

export default App;
