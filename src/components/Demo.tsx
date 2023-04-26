import React, { useEffect, useState } from 'react';
import { articleApi } from '../services/articleApi';

import LinkIcon from '../assets/link.svg';
import CopyIcon from '../assets/copy.svg';
import LoaderIcon from '../assets/loader.svg';
import TickIcon from '../assets/tick.svg';

type ArticleType = {
    url: string;
    summary: string;
};

const Demo = () => {
    const [article, setArticle] = useState<ArticleType>({
        summary: '',
        url: '',
    });

    const [allArticles, setAllArticles] = useState<ArticleType[]>([]);
    const [copied, setCopied] = useState('');

    const [trigger, { error, isFetching }] =
        articleApi.useLazyGetSummaryQuery();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { data } = await trigger({ length: 3, url: article.url });

        if (data?.summary) {
            const newArticle = { ...article, summary: data.summary };

            const updatedArticles = [newArticle, ...allArticles];

            setArticle(newArticle);
            setAllArticles(updatedArticles);

            localStorage.setItem('articles', JSON.stringify(updatedArticles));
        }

        // setArticle((prev) => ({ ...prev, url: '' }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setArticle((prev) => ({ ...prev, url: e.target.value }));
    };

    const handleCopy = (copyUrl: string) => {
        setCopied(copyUrl);
        navigator.clipboard.writeText(copyUrl);

        setTimeout(() => setCopied(''), 3000);
    };

    const handleArticleClick = (givenArticle: ArticleType) => {
        setArticle(givenArticle);
    };

    useEffect(() => {
        const articlesFromLocalStorage = JSON.parse(
            localStorage.getItem('articles') || '[]'
        ) as ArticleType[];

        if (articlesFromLocalStorage.length) {
            setAllArticles(articlesFromLocalStorage);
        }
    }, []);

    return (
        <section className='my-16 w-full max-w-xl'>
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
                <div className='flex max-h-60 flex-col gap-1 overflow-y-auto'>
                    {allArticles.map((article, index) => (
                        <div key={`link-${index}`} className='link_card'>
                            <div
                                className='copy_btn'
                                onClick={() => handleCopy(article.url)}
                            >
                                <img
                                    src={
                                        copied === article.url
                                            ? TickIcon
                                            : CopyIcon
                                    }
                                    alt='copy_icon'
                                    className='h-[40%] w-[40%] object-contain'
                                />
                            </div>
                            <p
                                className='flex-1 truncate font-satoshi text-sm font-medium text-blue-700'
                                onClick={() => handleArticleClick(article)}
                            >
                                {article.url}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className='my-10 flex max-w-full items-center justify-center'>
                {isFetching ? (
                    <img
                        src={LoaderIcon}
                        alt='loader'
                        className='h-20 w-20 object-contain'
                    />
                ) : error ? (
                    <p className='text-center font-inter font-bold text-black'>
                        Что-то пошло не так...
                        <br />
                        <span className='font-satoshi font-normal text-gray-700'>
                            {'status' in error && error.status}
                        </span>
                    </p>
                ) : (
                    article.summary && (
                        <div className='flex flex-col gap-3'>
                            <h2 className='font-satoshi text-xl font-bold text-gray-600'>
                                <span className='blue_gradient'>Резюме</span>{' '}
                                статьи
                            </h2>
                            <div className='summary_box'>
                                <p>{article.summary}</p>
                            </div>
                        </div>
                    )
                )}
            </div>
        </section>
    );
};

export default Demo;
