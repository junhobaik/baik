import React, { useEffect, useRef } from 'react';

import styled from 'styled-components';

interface CommentsProps {}

const Comments = (props: CommentsProps) => {
  const commentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scriptEl = document.createElement('script');
    scriptEl.async = true;
    scriptEl.src = 'https://utteranc.es/client.js';
    scriptEl.classList.add('comment-inner-wrap');
    scriptEl.setAttribute('repo', 'junhobaik/comments');
    scriptEl.setAttribute('issue-term', 'url');
    scriptEl.setAttribute('theme', 'github-light');
    scriptEl.setAttribute('crossorigin', 'anonymous');
    commentsRef.current?.appendChild(scriptEl);

    return () => {
      while (commentsRef.current && commentsRef.current.firstChild) {
        commentsRef.current.removeChild(commentsRef.current.firstChild);
      }
    };
  }, []);

  return <CommentsStyled className="comments" ref={commentsRef} />;
};

const CommentsStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  .utterances {
    margin: 0;
    width: 100% !important;
    max-width: 100% !important;
  }
`;

export default Comments;
