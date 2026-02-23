# Code Citations

## License: unknown

https://github.com/pkvaygon/nextstore/blob/9030b255a3fee07d7a7acdbdcdca88e1422549f6/storage/store.ts

````
I'll show you how to add Redux persist middleware to your setup for state preservation across page refreshes.

**Step 1: Install redux-persist**

```bash
npm install redux-persist
````

**Step 2: Update your store configuration**

Here's the modified `store.ts`:

```typescript
// redux/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiSlice } from './features/apiSlice';
import authReducer from './features/authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: [apiSlice.reducerPath], // Don't persist API cache
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(apiSlice.middleware),
    dev
```

## License: unknown

https://github.com/pkvaygon/nextstore/blob/9030b255a3fee07d7a7acdbdcdca88e1422549f6/storage/store.ts

````
I'll show you how to add Redux persist middleware to your setup for state preservation across page refreshes.

**Step 1: Install redux-persist**

```bash
npm install redux-persist
````

**Step 2: Update your store configuration**

Here's the modified `store.ts`:

```typescript
// redux/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiSlice } from './features/apiSlice';
import authReducer from './features/authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: [apiSlice.reducerPath], // Don't persist API cache
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(apiSlice.middleware),
    dev
```

## License: unknown

https://github.com/NqDyK2/FE_Tutors-Events-Poly/blob/60d080fcaab661813d9b284476eade1d90afabf8/src/app/store.js

````
I'll show you how to add Redux persist middleware to your setup for state preservation across page refreshes.

**Step 1: Install redux-persist**

```bash
npm install redux-persist
````

**Step 2: Update your store configuration**

Here's the modified `store.ts`:

```typescript
// redux/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiSlice } from './features/apiSlice';
import authReducer from './features/authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: [apiSlice.reducerPath], // Don't persist API cache
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });

  setupListeners(store.dispatch
```

## License: unknown

https://github.com/LarisaKuklinova2000/pet-food-app/blob/1a570ac372049247093ce1dea51043e4eb4bff8d/src/store/index.js

````
I'll show you how to add Redux persist middleware to your setup for state preservation across page refreshes.

**Step 1: Install redux-persist**

```bash
npm install redux-persist
````

**Step 2: Update your store configuration**

Here's the modified `store.ts`:

```typescript
// redux/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiSlice } from './features/apiSlice';
import authReducer from './features/authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: [apiSlice.reducerPath], // Don't persist API cache
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });

  setupListeners(store.dispatch
```

## License: unknown

https://github.com/pkvaygon/nextstore/blob/9030b255a3fee07d7a7acdbdcdca88e1422549f6/storage/store.ts

````
I'll show you how to add Redux persist middleware to your setup for state preservation across page refreshes.

**Step 1: Install redux-persist**

```bash
npm install redux-persist
````

**Step 2: Update your store configuration**

Here's the modified `store.ts`:

```typescript
// redux/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiSlice } from './features/apiSlice';
import authReducer from './features/authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: [apiSlice.reducerPath], // Don't persist API cache
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(apiSlice.middleware),
    dev
```

## License: unknown

https://github.com/NqDyK2/FE_Tutors-Events-Poly/blob/60d080fcaab661813d9b284476eade1d90afabf8/src/app/store.js

````
I'll show you how to add Redux persist middleware to your setup for state preservation across page refreshes.

**Step 1: Install redux-persist**

```bash
npm install redux-persist
````

**Step 2: Update your store configuration**

Here's the modified `store.ts`:

```typescript
// redux/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiSlice } from './features/apiSlice';
import authReducer from './features/authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: [apiSlice.reducerPath], // Don't persist API cache
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });

  setupListeners(store.dispatch
```

## License: unknown

https://github.com/LarisaKuklinova2000/pet-food-app/blob/1a570ac372049247093ce1dea51043e4eb4bff8d/src/store/index.js

````
I'll show you how to add Redux persist middleware to your setup for state preservation across page refreshes.

**Step 1: Install redux-persist**

```bash
npm install redux-persist
````

**Step 2: Update your store configuration**

Here's the modified `store.ts`:

```typescript
// redux/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiSlice } from './features/apiSlice';
import authReducer from './features/authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: [apiSlice.reducerPath], // Don't persist API cache
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });

  setupListeners(store.dispatch
```

## License: unknown

https://github.com/pkvaygon/nextstore/blob/9030b255a3fee07d7a7acdbdcdca88e1422549f6/storage/store.ts

````
I'll show you how to add Redux persist middleware to your setup for state preservation across page refreshes.

**Step 1: Install redux-persist**

```bash
npm install redux-persist
````

**Step 2: Update your store configuration**

Here's the modified `store.ts`:

```typescript
// redux/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiSlice } from './features/apiSlice';
import authReducer from './features/authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: [apiSlice.reducerPath], // Don't persist API cache
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(apiSlice.middleware),
    dev
```

## License: unknown

https://github.com/NqDyK2/FE_Tutors-Events-Poly/blob/60d080fcaab661813d9b284476eade1d90afabf8/src/app/store.js

````
I'll show you how to add Redux persist middleware to your setup for state preservation across page refreshes.

**Step 1: Install redux-persist**

```bash
npm install redux-persist
````

**Step 2: Update your store configuration**

Here's the modified `store.ts`:

```typescript
// redux/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiSlice } from './features/apiSlice';
import authReducer from './features/authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: [apiSlice.reducerPath], // Don't persist API cache
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });

  setupListeners(store.dispatch
```

## License: unknown

https://github.com/LarisaKuklinova2000/pet-food-app/blob/1a570ac372049247093ce1dea51043e4eb4bff8d/src/store/index.js

````
I'll show you how to add Redux persist middleware to your setup for state preservation across page refreshes.

**Step 1: Install redux-persist**

```bash
npm install redux-persist
````

**Step 2: Update your store configuration**

Here's the modified `store.ts`:

```typescript
// redux/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiSlice } from './features/apiSlice';
import authReducer from './features/authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: [apiSlice.reducerPath], // Don't persist API cache
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });

  setupListeners(store.dispatch
```

## License: unknown

https://github.com/pkvaygon/nextstore/blob/9030b255a3fee07d7a7acdbdcdca88e1422549f6/storage/store.ts

````
I'll show you how to add Redux persist middleware to your setup for state preservation across page refreshes.

**Step 1: Install redux-persist**

```bash
npm install redux-persist
````

**Step 2: Update your store configuration**

Here's the modified `store.ts`:

```typescript
// redux/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiSlice } from './features/apiSlice';
import authReducer from './features/authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: [apiSlice.reducerPath], // Don't persist API cache
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(apiSlice.middleware),
    dev
```

## License: unknown

https://github.com/NqDyK2/FE_Tutors-Events-Poly/blob/60d080fcaab661813d9b284476eade1d90afabf8/src/app/store.js

````
I'll show you how to add Redux persist middleware to your setup for state preservation across page refreshes.

**Step 1: Install redux-persist**

```bash
npm install redux-persist
````

**Step 2: Update your store configuration**

Here's the modified `store.ts`:

```typescript
// redux/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiSlice } from './features/apiSlice';
import authReducer from './features/authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: [apiSlice.reducerPath], // Don't persist API cache
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });

  setupListeners(store.dispatch
```

## License: unknown

https://github.com/LarisaKuklinova2000/pet-food-app/blob/1a570ac372049247093ce1dea51043e4eb4bff8d/src/store/index.js

````
I'll show you how to add Redux persist middleware to your setup for state preservation across page refreshes.

**Step 1: Install redux-persist**

```bash
npm install redux-persist
````

**Step 2: Update your store configuration**

Here's the modified `store.ts`:

```typescript
// redux/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiSlice } from './features/apiSlice';
import authReducer from './features/authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: [apiSlice.reducerPath], // Don't persist API cache
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });

  setupListeners(store.dispatch
```

## License: unknown

https://github.com/pkvaygon/nextstore/blob/9030b255a3fee07d7a7acdbdcdca88e1422549f6/storage/store.ts

````
I'll show you how to add Redux persist middleware to your setup for state preservation across page refreshes.

**Step 1: Install redux-persist**

```bash
npm install redux-persist
````

**Step 2: Update your store configuration**

Here's the modified `store.ts`:

```typescript
// redux/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiSlice } from './features/apiSlice';
import authReducer from './features/authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: [apiSlice.reducerPath], // Don't persist API cache
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(apiSlice.middleware),
    dev
```

## License: unknown

https://github.com/NqDyK2/FE_Tutors-Events-Poly/blob/60d080fcaab661813d9b284476eade1d90afabf8/src/app/store.js

````
I'll show you how to add Redux persist middleware to your setup for state preservation across page refreshes.

**Step 1: Install redux-persist**

```bash
npm install redux-persist
````

**Step 2: Update your store configuration**

Here's the modified `store.ts`:

```typescript
// redux/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiSlice } from './features/apiSlice';
import authReducer from './features/authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: [apiSlice.reducerPath], // Don't persist API cache
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });

  setupListeners(store.dispatch
```

## License: unknown

https://github.com/LarisaKuklinova2000/pet-food-app/blob/1a570ac372049247093ce1dea51043e4eb4bff8d/src/store/index.js

````
I'll show you how to add Redux persist middleware to your setup for state preservation across page refreshes.

**Step 1: Install redux-persist**

```bash
npm install redux-persist
````

**Step 2: Update your store configuration**

Here's the modified `store.ts`:

```typescript
// redux/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiSlice } from './features/apiSlice';
import authReducer from './features/authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: [apiSlice.reducerPath], // Don't persist API cache
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });

  setupListeners(store.dispatch
```

## License: unknown

https://github.com/pkvaygon/nextstore/blob/9030b255a3fee07d7a7acdbdcdca88e1422549f6/storage/store.ts

````
I'll show you how to add Redux persist middleware to your setup for state preservation across page refreshes.

**Step 1: Install redux-persist**

```bash
npm install redux-persist
````

**Step 2: Update your store configuration**

Here's the modified `store.ts`:

```typescript
// redux/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiSlice } from './features/apiSlice';
import authReducer from './features/authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: [apiSlice.reducerPath], // Don't persist API cache
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(apiSlice.middleware),
    dev
```

## License: unknown

https://github.com/NqDyK2/FE_Tutors-Events-Poly/blob/60d080fcaab661813d9b284476eade1d90afabf8/src/app/store.js

````
I'll show you how to add Redux persist middleware to your setup for state preservation across page refreshes.

**Step 1: Install redux-persist**

```bash
npm install redux-persist
````

**Step 2: Update your store configuration**

Here's the modified `store.ts`:

```typescript
// redux/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiSlice } from './features/apiSlice';
import authReducer from './features/authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: [apiSlice.reducerPath], // Don't persist API cache
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });

  setupListeners(store.dispatch
```

## License: unknown

https://github.com/LarisaKuklinova2000/pet-food-app/blob/1a570ac372049247093ce1dea51043e4eb4bff8d/src/store/index.js

````
I'll show you how to add Redux persist middleware to your setup for state preservation across page refreshes.

**Step 1: Install redux-persist**

```bash
npm install redux-persist
````

**Step 2: Update your store configuration**

Here's the modified `store.ts`:

```typescript
// redux/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiSlice } from './features/apiSlice';
import authReducer from './features/authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: [apiSlice.reducerPath], // Don't persist API cache
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });

  setupListeners(store.dispatch
```

## License: unknown

https://github.com/pkvaygon/nextstore/blob/9030b255a3fee07d7a7acdbdcdca88e1422549f6/storage/store.ts

````
I'll show you how to add Redux persist middleware to your setup for state preservation across page refreshes.

**Step 1: Install redux-persist**

```bash
npm install redux-persist
````

**Step 2: Update your store configuration**

Here's the modified `store.ts`:

```typescript
// redux/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiSlice } from './features/apiSlice';
import authReducer from './features/authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: [apiSlice.reducerPath], // Don't persist API cache
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(apiSlice.middleware),
    dev
```

## License: unknown

https://github.com/NqDyK2/FE_Tutors-Events-Poly/blob/60d080fcaab661813d9b284476eade1d90afabf8/src/app/store.js

````
I'll show you how to add Redux persist middleware to your setup for state preservation across page refreshes.

**Step 1: Install redux-persist**

```bash
npm install redux-persist
````

**Step 2: Update your store configuration**

Here's the modified `store.ts`:

```typescript
// redux/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiSlice } from './features/apiSlice';
import authReducer from './features/authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: [apiSlice.reducerPath], // Don't persist API cache
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });

  setupListeners(store.dispatch
```

## License: unknown

https://github.com/LarisaKuklinova2000/pet-food-app/blob/1a570ac372049247093ce1dea51043e4eb4bff8d/src/store/index.js

````
I'll show you how to add Redux persist middleware to your setup for state preservation across page refreshes.

**Step 1: Install redux-persist**

```bash
npm install redux-persist
````

**Step 2: Update your store configuration**

Here's the modified `store.ts`:

```typescript
// redux/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiSlice } from './features/apiSlice';
import authReducer from './features/authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: [apiSlice.reducerPath], // Don't persist API cache
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });

  setupListeners(store.dispatch
```

## License: unknown

https://github.com/NqDyK2/FE_Tutors-Events-Poly/blob/60d080fcaab661813d9b284476eade1d90afabf8/src/app/store.js

````
I'll show you how to add Redux persist middleware to your setup for state preservation across page refreshes.

**Step 1: Install redux-persist**

```bash
npm install redux-persist
````

**Step 2: Update your store configuration**

Here's the modified `store.ts`:

```typescript
// redux/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiSlice } from './features/apiSlice';
import authReducer from './features/authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: [apiSlice.reducerPath], // Don't persist API cache
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });

  setupListeners(store.dispatch
```

## License: unknown

https://github.com/LarisaKuklinova2000/pet-food-app/blob/1a570ac372049247093ce1dea51043e4eb4bff8d/src/store/index.js

````
I'll show you how to add Redux persist middleware to your setup for state preservation across page refreshes.

**Step 1: Install redux-persist**

```bash
npm install redux-persist
````

**Step 2: Update your store configuration**

Here's the modified `store.ts`:

```typescript
// redux/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiSlice } from './features/apiSlice';
import authReducer from './features/authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: [apiSlice.reducerPath], // Don't persist API cache
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });

  setupListeners(store.dispatch
```

## License: unknown

https://github.com/pkvaygon/nextstore/blob/9030b255a3fee07d7a7acdbdcdca88e1422549f6/storage/store.ts

````
I'll show you how to add Redux persist middleware to your setup for state preservation across page refreshes.

**Step 1: Install redux-persist**

```bash
npm install redux-persist
````

**Step 2: Update your store configuration**

Here's the modified `store.ts`:

```typescript
// redux/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiSlice } from './features/apiSlice';
import authReducer from './features/authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: [apiSlice.reducerPath], // Don't persist API cache
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });

  setupListeners(store.dispatch
```

## License: unknown

https://github.com/NqDyK2/FE_Tutors-Events-Poly/blob/60d080fcaab661813d9b284476eade1d90afabf8/src/app/store.js

````
I'll show you how to add Redux persist middleware to your setup for state preservation across page refreshes.

**Step 1: Install redux-persist**

```bash
npm install redux-persist
````

**Step 2: Update your store configuration**

Here's the modified `store.ts`:

```typescript
// redux/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiSlice } from './features/apiSlice';
import authReducer from './features/authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: [apiSlice.reducerPath], // Don't persist API cache
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });

  setupListeners(store.dispatch
```

## License: unknown

https://github.com/LarisaKuklinova2000/pet-food-app/blob/1a570ac372049247093ce1dea51043e4eb4bff8d/src/store/index.js

````
I'll show you how to add Redux persist middleware to your setup for state preservation across page refreshes.

**Step 1: Install redux-persist**

```bash
npm install redux-persist
````

**Step 2: Update your store configuration**

Here's the modified `store.ts`:

```typescript
// redux/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiSlice } from './features/apiSlice';
import authReducer from './features/authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: [apiSlice.reducerPath], // Don't persist API cache
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });

  setupListeners(store.dispatch
```

## License: unknown

https://github.com/pkvaygon/nextstore/blob/9030b255a3fee07d7a7acdbdcdca88e1422549f6/storage/store.ts

````
I'll show you how to add Redux persist middleware to your setup for state preservation across page refreshes.

**Step 1: Install redux-persist**

```bash
npm install redux-persist
````

**Step 2: Update your store configuration**

Here's the modified `store.ts`:

```typescript
// redux/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiSlice } from './features/apiSlice';
import authReducer from './features/authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: [apiSlice.reducerPath], // Don't persist API cache
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });

  setupListeners(store.dispatch
```

## License: unknown

https://github.com/NqDyK2/FE_Tutors-Events-Poly/blob/60d080fcaab661813d9b284476eade1d90afabf8/src/app/store.js

````
I'll show you how to add Redux persist middleware to your setup for state preservation across page refreshes.

**Step 1: Install redux-persist**

```bash
npm install redux-persist
````

**Step 2: Update your store configuration**

Here's the modified `store.ts`:

```typescript
// redux/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { apiSlice } from "./features/apiSlice";
import authReducer from "./features/authSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Only persist auth state
  blacklist: [apiSlice.reducerPath], // Don't persist API cache
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== "production",
  });

  setupListeners(store.dispatch);

  return store;
};
```

## License: unknown

https://github.com/LarisaKuklinova2000/pet-food-app/blob/1a570ac372049247093ce1dea51043e4eb4bff8d/src/store/index.js

````
I'll show you how to add Redux persist middleware to your setup for state preservation across page refreshes.

**Step 1: Install redux-persist**

```bash
npm install redux-persist
````

**Step 2: Update your store configuration**

Here's the modified `store.ts`:

```typescript
// redux/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { apiSlice } from "./features/apiSlice";
import authReducer from "./features/authSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Only persist auth state
  blacklist: [apiSlice.reducerPath], // Don't persist API cache
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== "production",
  });

  setupListeners(store.dispatch);

  return store;
};
```

## License: unknown

https://github.com/pkvaygon/nextstore/blob/9030b255a3fee07d7a7acdbdcdca88e1422549f6/storage/store.ts

````
I'll show you how to add Redux persist middleware to your setup for state preservation across page refreshes.

**Step 1: Install redux-persist**

```bash
npm install redux-persist
````

**Step 2: Update your store configuration**

Here's the modified `store.ts`:

```typescript
// redux/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { apiSlice } from "./features/apiSlice";
import authReducer from "./features/authSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Only persist auth state
  blacklist: [apiSlice.reducerPath], // Don't persist API cache
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== "production",
  });

  setupListeners(store.dispatch);

  return store;
};
```
