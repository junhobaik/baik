import { ImageResponse } from 'next/og';

import { PostArticle, ShortsArticle } from '@baik/types';

import api from '@/api';
import { variables } from '@/configs';

export const runtime = 'edge';

const divide = 6;

export const size = {
  width: 1200 / divide,
  height: 630 / divide,
};

export const contentType = 'image/png';

export default async function Image(params: { pathname: string }) {
  // const font = fetch(new URL('/public/fonts/PretendardVariable.woff2', import.meta.url)).then((res) =>
  //   res.arrayBuffer(),
  // );

  const articleResponse = await api.server.archive.getArticleByPathnamePublic({ pathname: params.pathname });

  const article: PostArticle | ShortsArticle = articleResponse.data?.item;
  if (!article) return null;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
          padding: `${80 / divide}px ${64 / divide}px`,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p
              style={{
                fontSize: '64px',
                fontWeight: 800,
                flexGrow: 1,
              }}
            >
              {article.title}
            </p>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={variables.MY_PROFILE_IMG_URL}
                alt=""
                width={`${54 / divide}px`}
                height={`${54 / divide}px`}
                style={{
                  borderRadius: '100%',
                  minWidth: `${54 / divide}px`,
                  width: `${54 / divide}px`,
                  height: `${54 / divide}px`,
                  marginBottom: `${8 / divide}px`,
                  marginRight: `${12 / divide}px`,
                }}
              />
              <p
                style={{
                  fontSize: `${36 / divide}px`,
                  fontWeight: 600,
                  color: '#5a5a5a',
                }}
              >
                Baik's Archive
              </p>
            </div>
          </div>

          {article.thumbnail_img_url ? (
            <div
              style={{
                width: `${480 / divide}px`,
                padding: `${24 / divide}px`,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ flexGrow: 1 }}></div>
              <div>
                <img
                  src={article.thumbnail_img_url}
                  alt=""
                  width="100%"
                  style={{
                    width: '100%',
                  }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    ),
    {
      ...size,
      // fonts: [
      //   {
      //     name: 'Pretendard Variable',
      //     data: await font,
      //     style: 'normal',
      //     weight: 400,
      //   },
      // ],
    },
  );
}
