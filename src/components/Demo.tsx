import React, { useState } from 'react';
import LinkIcon from '../assets/link.svg';
import { articleApi } from '../services/articleApi';

type ArticleType = {
    url: string;
    summary: string;
};

const testUrl = 'https://www.jsmastery.pro/';

const Demo = () => {
    const [article, setArticle] = useState<ArticleType>({
        summary: '',
        url: '',
    });

    const [trigger, result, lastPromiseInfo] =
        articleApi.useLazyGetSummaryQuery();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { data } = await trigger({ length: 3, url: article.url });

        if (data?.summary) {
            const newArticle = { ...article, summary: data.summary };
            setArticle(newArticle);

            console.log(newArticle);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setArticle((prev) => ({ ...prev, url: e.target.value }));
    };

    return (
        <section className='mt-16 w-full max-w-xl'>
            <div className='flex w-full flex-col gap-2'>
                <form
                    className='relative flex items-center justify-center'
                    onSubmit={handleSubmit}
                >
                    <img
                        src={LinkIcon}
                        alt='link-icon'
                        className='absolute left-0 my-2 ml-3 w-5'
                    />
                    <input
                        type='url'
                        placeholder='Вставьте ссылку на статью'
                        required
                        className='url_input peer'
                        value={article.url}
                        onChange={handleInputChange}
                    />
                    <button
                        type='submit'
                        className='submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700 '
                    >
                        <p>↵</p>
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Demo;
