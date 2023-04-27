import React, { useEffect, useState } from 'react';
import { articleApi } from '../services/articleApi';

import LinkIcon from '../assets/link.svg';
import CopyIcon from '../assets/copy.svg';
import LoaderIcon from '../assets/loader.svg';
import TickIcon from '../assets/tick.svg';
import { translateApi } from '../services/translateApi';

type ArticleType = {
    url: string;
    summary: string;
};

// type TranslatedTextType = {
//     text: string;
//     language: string;
// };

const ErrorComponent = ({ errorStatus }: { errorStatus: number }) => {
    if (errorStatus === 503) {
        return (
            <span className='font-satoshi font-normal text-gray-700'>
                Не удалось извлечь корпус текста со страницы. Убедитесь, что вы
                пытаетесь обобщить новостную статью или другую страницу с четко
                определенными блоками текста.
            </span>
        );
    }
    return <></>;
};

const Demo = () => {
    const [article, setArticle] = useState<ArticleType>({
        summary: '',
        url: '',
    });
    const [allArticles, setAllArticles] = useState<ArticleType[]>([]);
    const [copied, setCopied] = useState('');

    const [currentLanguage, setCurrentLanguage] = useState('en');

    const [
        articleTrigger,
        { error: articleError, isFetching: isArticleFetching },
    ] = articleApi.useLazyGetSummaryQuery();

    const [
        translateSummary,
        { data: translatedText, isLoading: isTranslationLoading },
    ] = translateApi.useTranslateTextMutation();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { data: articleData } = await articleTrigger({
            length: 3,
            url: article.url,
        });

        if (!articleData?.summary) return;

        const newArticle = { ...article, summary: articleData.summary };

        const updatedArticles = [newArticle, ...allArticles];

        setArticle(newArticle);
        setAllArticles(updatedArticles);
        setCurrentLanguage('en');

        localStorage.setItem('articles', JSON.stringify(updatedArticles));
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
        setCurrentLanguage('en');
    };

    const handleClearHistory = () => {
        setAllArticles([]);
        localStorage.setItem('articles', '[]');
    };

    const handleChangeCurrentLanguage = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const newLanguage = e.target.value;

        setCurrentLanguage(newLanguage);

        translateSummary({ text: article.summary, to: newLanguage });
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

                <span
                    className='my-2 cursor-pointer self-end text-sm text-gray-400 transition hover:text-gray-500'
                    onClick={handleClearHistory}
                >
                    Очистить историю
                </span>
            </div>

            <div className='my-10 flex max-w-full items-center justify-center'>
                {isArticleFetching || isTranslationLoading ? (
                    <img
                        src={LoaderIcon}
                        alt='loader'
                        className='h-20 w-20 object-contain'
                    />
                ) : articleError ? (
                    <p className='text-center font-inter font-bold text-black'>
                        Что-то пошло не так...
                        <br />
                        {'status' in articleError && (
                            <ErrorComponent
                                errorStatus={+articleError.status}
                            />
                        )}
                    </p>
                ) : (
                    article.summary && (
                        <div className='flex flex-col gap-3'>
                            <div className='flex justify-between'>
                                <h2 className='font-satoshi text-xl font-bold text-gray-600'>
                                    <span className='blue_gradient'>
                                        Резюме
                                    </span>{' '}
                                    статьи
                                </h2>
                                <select
                                    onChange={handleChangeCurrentLanguage}
                                    value={currentLanguage}
                                    className='cursor-pointer rounded border bg-transparent px-2 py-1 text-gray-500 outline-none transition hover:border-gray-500 focus:border-black focus:text-black '
                                >
                                    <option disabled={true}>
                                        Выберите язык
                                    </option>
                                    <option value='en'>English</option>
                                    <option value='ru'>Русский</option>
                                    <option value='es'>Espanol</option>
                                    <option value='fr'>Français</option>
                                    <option value='de'>Deutsch</option>
                                </select>
                            </div>
                            <div className='summary_box space-y-8'>
                                <p>
                                    {currentLanguage === 'en'
                                        ? article.summary
                                        : translatedText?.translated_text}
                                </p>
                            </div>
                        </div>
                    )
                )}
            </div>
        </section>
    );
};

export default Demo;
