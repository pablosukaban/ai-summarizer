import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { articleApi } from './articleApi';

export const rootReducer = combineReducers({
    [articleApi.reducerPath]: articleApi.reducer,
});

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware(getDefaultMiddleware) {
            return getDefaultMiddleware().concat(articleApi.middleware);
        },
    });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppState = ReturnType<typeof setupStore>;
// export type AppDispatch = AppState['dispatch'];
