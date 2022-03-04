import NProgress from 'nprogress'
import nProgressStyles from 'nprogress/nprogress.css'
import { useEffect } from 'react'

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useTransition,
} from 'remix'
import type { LinksFunction, MetaFunction } from 'remix'

import styles from './tailwind.css'

export const meta: MetaFunction = () => {
  return { title: 'NBA Games' }
}

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
    { rel: 'stylesheet', href: nProgressStyles },
  ]
}

export async function loader() {
  return {
    ENV: {
      APPCUES_ID: process.env.APPCUES_ID || '',
    },
  }
}

export default function App() {
  const data = useLoaderData()
  let transition = useTransition()

  useEffect(() => {
    // when the state is idle then we can to complete the progress bar
    if (transition.state === 'idle') NProgress.done()
    // and when it's something else it means it's either submitting a form or
    // waiting for the loaders of the next location so we start it
    else {
      NProgress.start()
    }

    // track the user as annonymous
    ;(window as any).Appcues.anonymous()
  }, [transition.state])

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <script src={`//fast.appcues.com/${data.ENV.APPCUES_ID}.js`}></script>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  )
}
