"use client";

import { useEffect } from "react";

/**
 * Last resort: the root layout itself failed, so this file replaces `<html>`
 * and `<body>` and carries its own styles — no providers, no fonts, no
 * globals.css guaranteed.
 */
const GlobalError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(
    function logRenderCrash() {
      console.error("Root layout crashed", { digest: error.digest, error });
    },
    [error],
  );

  return (
    <html lang="en">
      <head>
        <style>{`
          body {
            margin: 0;
            background: #ebe7d9;
            color: #111111;
            font-family: system-ui, sans-serif;
          }
          main {
            box-sizing: border-box;
            max-width: 34rem;
            margin: 12vh auto 0;
            padding: 2.5rem;
            border: 4px solid #111111;
            background: #ffffff;
            box-shadow: 10px 10px 0 #111111;
          }
          h1 {
            margin: 0 0 0.75rem;
            font-size: 1.5rem;
            text-transform: uppercase;
          }
          p {
            margin: 0 0 1.5rem;
            line-height: 1.6;
          }
          button {
            cursor: pointer;
            border: 3px solid #111111;
            background: #c8ff00;
            padding: 0.75rem 1.5rem;
            font: inherit;
            font-weight: 800;
          }
          button:focus-visible {
            outline: 3px solid #1410ff;
            outline-offset: 3px;
          }
        `}</style>
      </head>
      <body>
        <main role="alert">
          <h1>Something went wrong.</h1>
          <p>
            The page could not be rendered. Retrying usually works; if it does not, reload the site.
          </p>
          <button
            type="button"
            onClick={reset}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
};

export default GlobalError;
