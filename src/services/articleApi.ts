import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = 'https://article-extractor-and-summarizer.p.rapidapi.com/';

export type ResponseType = {
    summary: string;
};

export type ParamsType = {
    url: string;
    length: number;
};

const rapidApiKey = import.meta.env.VITE_RAPID_API_KEY;

export const articleApi = createApi({
    reducerPath: 'articleApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers) => {
            headers.set('X-RapidAPI-Key', rapidApiKey);
            headers.set(
                'X-RapidAPI-Host',
                'article-extractor-and-summarizer.p.rapidapi.com'
            );
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getSummary: builder.query<ResponseType, ParamsType>({
            query: (params) =>
                `/summarize?url=${encodeURIComponent(params.url)}&length=${
                    params.length
                }`,

            // query: (params) => ({
            //     url: '/summarize',
            //     params: {
            //         url: encodeURIComponent(params.url),
            //         length: params.length,
            //     },
            // }),
        }),
    }),
});
