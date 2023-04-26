import React from 'react';
import Logo from '../assets/logo.svg';

const Hero = () => {
    return (
        <header className='flex w-full flex-col items-center justify-center'>
            <nav className='mb-10 flex w-full items-center justify-between pt-3'>
                <img
                    src={Logo}
                    alt='sumz_logo'
                    className='w-28 object-contain'
                />

                <button
                    type='button'
                    onClick={() =>
                        window.open(
                            'https://github.com/pablosukaban/ai-summarizer',
                            '_blank'
                        )
                    }
                    className='black_btn'
                >
                    GitHub
                </button>
            </nav>

            <h1 className='head_text'>
                Резюмируйте статьи благодаря <br className='max-md:hidden' />
                <span className='orange_gradient '>OpenAI GPT-4</span>
            </h1>
            <h2 className='desc'>
                Упростите чтение с помощью Summize, open-source проекта, которое
                резюмирует длинные статьи в четкие и краткие тексты
            </h2>
        </header>
    );
};

export default Hero;
