/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'

// Create Virtual Routes

const PredictionLazyImport = createFileRoute('/prediction')()
const DisposeLazyImport = createFileRoute('/dispose')()
const BinLazyImport = createFileRoute('/bin')()
const IndexLazyImport = createFileRoute('/')()

// Create/Update Routes

const PredictionLazyRoute = PredictionLazyImport.update({
  path: '/prediction',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/prediction.lazy').then((d) => d.Route))

const DisposeLazyRoute = DisposeLazyImport.update({
  path: '/dispose',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/dispose.lazy').then((d) => d.Route))

const BinLazyRoute = BinLazyImport.update({
  path: '/bin',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/bin.lazy').then((d) => d.Route))

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/bin': {
      id: '/bin'
      path: '/bin'
      fullPath: '/bin'
      preLoaderRoute: typeof BinLazyImport
      parentRoute: typeof rootRoute
    }
    '/dispose': {
      id: '/dispose'
      path: '/dispose'
      fullPath: '/dispose'
      preLoaderRoute: typeof DisposeLazyImport
      parentRoute: typeof rootRoute
    }
    '/prediction': {
      id: '/prediction'
      path: '/prediction'
      fullPath: '/prediction'
      preLoaderRoute: typeof PredictionLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexLazyRoute,
  BinLazyRoute,
  DisposeLazyRoute,
  PredictionLazyRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/bin",
        "/dispose",
        "/prediction"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/bin": {
      "filePath": "bin.lazy.tsx"
    },
    "/dispose": {
      "filePath": "dispose.lazy.tsx"
    },
    "/prediction": {
      "filePath": "prediction.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
