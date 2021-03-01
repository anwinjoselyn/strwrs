import * as Sentry from "@sentry/browser";

/* To enable in production */
const isLocal = process.env.NODE_ENV === "development";

/*//Using for local development
const isLocal = true;
*/
//Sentry initialization
export function initSentry() {
  if (isLocal) {
    return;
  }

  Sentry.init({
    dsn:
      "https://f0a3066dfb4740079eef4199cf5906e0@o534340.ingest.sentry.io/5653467"
  });
}

//for actual push of errors to Sentry
export function logError(error, errorInfo = null) {
  if (isLocal) {
    return;
  }

  Sentry.withScope(scope => {
    errorInfo && scope.setExtras(errorInfo);
    Sentry.captureException(error);
  });
}

//For logging and feedback on errors
export function onError(error) {
  let errorInfo = {};
  let message = error.toString();

  // Auth errors
  if (!(error instanceof Error) && error.message) {
    errorInfo = error;
    message = error.message
      ? error.message
      : "Sorry, something went wrong. Please try again!";
    error = new Error(message);

    // API errors
  } else if (error.config && error.config.url) {
    errorInfo.url = error.config.url;
  }

  logError(error, errorInfo);

  alert(message);
}
