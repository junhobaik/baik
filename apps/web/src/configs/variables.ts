export const SITE_URL_PRD = 'https://baik.dev';
export const SITE_URL_DEV = 'http://localhost:3000';
export const SITE_URL = process.env.NODE_ENV === 'production' ? SITE_URL_PRD : SITE_URL_DEV;

export const BASE_URL_PRD = '';
export const BASE_URL_DEV = 'http://127.0.0.1:4000/local';
export const BASE_URL = process.env.NODE_ENV === 'production' ? BASE_URL_PRD : BASE_URL_DEV;

export const SITE_TITLE = `Baik's dev archive`;
export const SITE_TITLE_SUFFIX = ' | Baik';
export const SITE_DESCRIPTION = '';

export const MY_NAME = 'Junho Baik';
