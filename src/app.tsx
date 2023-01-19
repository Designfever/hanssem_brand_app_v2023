import React, { useRef } from 'react';
import Slider from './component/slider';
import { css } from '@emotion/css';
import styled from '@emotion/styled';

const CssNoSelect = css`
  user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
`;

const S = {
  Li: styled.li({
    position: 'relative',
    aspectRatio: '16/8.5',
    width: '100%',
    top: '0'
  })
};

const videos = [
  'https://play.wecandeo.com/video/v/?key=BOKNS9AQWrG4BEgc1gbbKHForJPIJM9qNii5JRaEnzhqbvftKUJCTbgieie',
  'https://play.wecandeo.com/video/v/?key=BOKNS9AQWrG4BEgc1gbbKHForJPIJM9qNii5JRaEnzhoiiSGMck7FfCAieie',
  'https://play.wecandeo.com/video/v/?key=BOKNS9AQWrG4BEgc1gbbKHForJPIJM9qNii5JRaEnzhrL4LVDiiRMPaAieie'
];
const App: React.FC = () => {
  const refIframeEl = useRef<Array<HTMLIFrameElement>>([]);
  const refPlayEl = useRef<Array<HTMLDivElement>>([]);

  const setPlay = (index: number) => {
    if (!refIframeEl.current) return;
    if (!refIframeEl.current[index]) return;
    const iframeEl = refIframeEl.current[index];

    if (!refPlayEl.current) return;
    if (!refPlayEl.current[index]) return;
    const playEl = refPlayEl.current[index];

    // @ts-ignore
    const api = new smIframeAPI(iframeEl.contentWindow);
    api.play();

    playEl.style.display = 'none';
  };

  const setStopAll = () => {
    if (!refIframeEl.current) return;
    if (!refPlayEl.current) return;

    refIframeEl.current.map((el) => {
      // @ts-ignore
      const api = new smIframeAPI(el.contentWindow);
      api.stop();
    });

    refPlayEl.current.map((el) => {
      el.style.display = 'block';
    });
  };

  return (
    <div
      className='App'
      css={{
        position: 'relative',
        maxWidth: '760px',
        width: '100%',
        margin: '0 auto'
      }}
    >
      <h1 css={{ textAlign: 'center', padding: '30px 0' }}>
        wecandeo player test
      </h1>
      <div
        css={{
          width: '90%',
          margin: '0 auto',
          background: '#ccc',
          position: 'relative',
          padding: '50px 0',
          overflow: 'hidden'
        }}
        onMouseDown={setStopAll}
        onTouchStart={setStopAll}
      >
        <Slider columnSize={1}>
          {videos.map((videoUrl, index) => {
            return (
              <S.Li css={CssNoSelect} key={index}>
                <div css={{ width: '90%', height: '100%', margin: '0 auto' }}>
                  <iframe
                    width='100%'
                    height='100%'
                    src={`${videoUrl}`}
                    frameBorder='0'
                    allowFullScreen
                    allow='autoplay;fullscreen;'
                    ref={(el) => {
                      if (el) refIframeEl.current[index] = el;
                    }}
                  ></iframe>
                </div>
                <div
                  css={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    left: '0',
                    top: '0'
                  }}
                >
                  <div
                    css={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={() => setPlay(index)}
                    ref={(el) => {
                      if (el) refPlayEl.current[index] = el;
                    }}
                  >
                    <img src={'/play.png'} alt={'play'} width={'100px'} />
                  </div>
                </div>
              </S.Li>
            );
          })}
        </Slider>
      </div>
    </div>
  );
};
export default App;
