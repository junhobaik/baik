export const SITE_URL_PRD = 'https://baik.dev';
export const SITE_URL_DEV = 'http://localhost:3000';

export const SITE_URL = process.env.NODE_ENV === 'production' ? SITE_URL_PRD : SITE_URL_DEV;

export const ARCHIVE_URL_PRD = 'https://baik.dev/archive';
export const ARCHIVE_URL_DEV = 'http://localhost:3000/archive';
export const ARCHIVE_URL = process.env.NODE_ENV === 'production' ? SITE_URL_PRD : SITE_URL_DEV;
export const ARCHIVE_URL_EN = ARCHIVE_URL + '/en';

export const BASE_URL_PRD = 'https://bx7cbjmv1k.execute-api.ap-northeast-2.amazonaws.com/dev';
export const BASE_URL_DEV = 'http://127.0.0.1:4000/local';
export const BASE_URL = process.env.NODE_ENV === 'production' ? BASE_URL_PRD : BASE_URL_DEV;

export const SITE_TITLE = `Junho Baik's website`;
export const SITE_TITLE_EN = SITE_TITLE;
export const SITE_TITLE_SUFFIX = ' | Baik';
export const SITE_TITLE_SUFFIX_EN = SITE_TITLE_SUFFIX;
export const SITE_DESCRIPTION =
  '프론트엔드 개발자 Junho Baik의 개인 웹으로, 블로그 및 기타 다양한 웹 및 앱 프로젝트로 이동하는 링크 페이지.';
export const SITE_DESCRIPTION_EN =
  'Personal website of front-end developer Junho Baik, serving as a link page to the blog and various other web and app projects';

export const ARCHIVE_TITLE = "Baik's Archive";
export const ARCHIVE_TITLE_EN = ARCHIVE_TITLE;
export const ARCHIVE_TITLE_SUFFIX = ' | Baik';
export const ARCHIVE_TITLE_SUFFIX_EN = SITE_TITLE_SUFFIX;
export const ARCHIVE_DESCRIPTION =
  '프론트엔드 개발자 Junho Baik의 아카이브(블로그)로 작성한 게시글과 유용한 외부 게시글을 모은 아카이브 웹페이지.';
export const ARCHIVE_DESCRIPTION_EN =
  'An archive(blog) webpage by front-end developer Junho Baik, featuring blog posts written by Junho Baik and a collection of useful external articles.';

export const MY_NAME = 'Junho Baik';
