import React from 'react';

interface OpenGraphImageProps {
  title: string;
  thumbnail_img_url?: string;
  width?: number;
  height?: number;
}

const OpenGraphImage = (props: OpenGraphImageProps) => {
  const { title, thumbnail_img_url, width = 1200, height = 630 } = props;

  return (
    <div
      style={{
        fontSize: 64,
        background: 'white',
        width: width,
        height: height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        paddingTop: 80,
        paddingRight: 64,
        paddingBottom: 0,
        paddingLeft: 64,
      }}
    >
      <div
        style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 200,
        }}
      >
        <div
          style={{
            fontSize: 48,
            textAlign: 'center',
          }}
        >
          {title}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginTop: 40 }}>
          <img
            src="https://d25sqaee97ji3k.cloudfront.net/0816bcfe-3f37-4982-90a8-e825ba5663a8.png"
            alt=""
            width={54}
            style={{ marginRight: 12 }}
          />
          <div
            style={{
              fontSize: 36,
              color: '#666',
            }}
          >
            Baik's archive
          </div>
        </div>
      </div>

      {thumbnail_img_url ? (
        <img
          src={thumbnail_img_url}
          alt=""
          width={1072}
          style={{
            position: 'absolute',
            top: 430,
            objectFit: 'cover',
            borderTopRightRadius: 64,
            borderTopLeftRadius: 64,
          }}
        />
      ) : null}
    </div>
  );
};

export default OpenGraphImage;
