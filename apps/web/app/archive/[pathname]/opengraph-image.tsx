import { ImageResponse } from 'next/og';

import api from '@/api';

export const runtime = 'edge';

export const alt = "Article - Baik's archive";

const divide = 4;

export const size = {
  width: 1200 / divide,
  height: 630 / divide,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { pathname: string } }) {
  const font = fetch(new URL('/public/fonts/Pretendard-Bold.ttf', import.meta.url)).then((res) => res.arrayBuffer());

  const article = await api.server.archive.getArticleByPathnamePublic({ pathname: params.pathname });
  const title = article.data?.item?.title ?? '';

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 64 / divide,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Pretendard',
          paddingTop: 80 / divide,
          paddingRight: 64 / divide,
          paddingBottom: 0,
          paddingLeft: 64 / divide,
        }}
      >
        <div
          style={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 200 / divide,
          }}
        >
          <div
            style={{
              fontSize: 48 / divide,
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            {title}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginTop: 40 / divide }}>
            <img
              src="https://d25sqaee97ji3k.cloudfront.net/0816bcfe-3f37-4982-90a8-e825ba5663a8.png"
              alt=""
              width={54 / divide}
              style={{ marginRight: 12 / divide }}
            />
            <div
              style={{
                fontSize: 36 / divide,
                color: '#666',
              }}
            >
              Baik's archive
            </div>
          </div>
        </div>

        {article.data?.item.thumbnail_img_url ? (
          <img
            src={article.data.item.thumbnail_img_url}
            alt=""
            width={1072 / divide}
            style={{
              position: 'absolute',
              top: 430 / divide,
              objectFit: 'cover',
              borderTopRightRadius: 64 / divide,
              borderTopLeftRadius: 64 / divide,
            }}
          />
        ) : null}
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Pretendard',
          data: await font,
          style: 'normal',
          weight: 700,
        },
      ],
    },
  );
}
