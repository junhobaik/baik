'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import clsx from 'clsx';
import styled from 'styled-components';

interface MDContentTocProps {
  title: string;
}

interface Heading {
  level: number;
  text: string;
  id: string;
}

const MDContentToc = (props: MDContentTocProps) => {
  const { title } = props;

  const observerRef = useRef<IntersectionObserver | null>(null);

  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>(title);
  const [windowHeight, setWindowHeight] = useState<number>();

  const minLevel = useMemo(() => Math.min(...headings.slice(1).map((h) => h.level)), [headings]);

  const getHeadings = useCallback((): Heading[] => {
    const root = document.querySelector('.md-content-root');
    if (!root) return [];

    const headingElements = root.querySelectorAll('h1, h2, h3, h4, h5, h6');

    return Array.from(headingElements).map((element) => ({
      level: parseInt(element.tagName.charAt(1)),
      text: element.textContent || '',
      id: element.id,
    }));
  }, []);

  useEffect(() => {
    const resizeEvent = () => {
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', resizeEvent);

    return () => {
      window.removeEventListener('resize', resizeEvent);
    };
  }, []);

  useEffect(() => {
    const contentHeadingList = getHeadings();
    const headingList = [{ level: 1, text: title, id: title }, ...contentHeadingList];

    setHeadings(headingList);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: `0px 0px -50% 0px`,
        threshold: 0,
      },
    );

    [{ id: title }, ...headingList].forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observerRef.current?.observe(element);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [windowHeight, title]);

  const list = headings.map((h, i) => {
    const parsedLevel = h.level - minLevel;
    const hash = i > 0 ? `#${h.id}` : '#';

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      event.preventDefault();
      const target = document.getElementById(h.id) as HTMLElement;
      const rect = target.getBoundingClientRect();

      if (i > 0) {
        window.scrollBy({ top: rect.top - 80, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      window.history.pushState(null, '', hash);
    };

    return (
      <li
        key={`toc-${h.id}`}
        className={clsx('pl-4 h-7 text-[16px] border-l-2', {
          'border-transparent': activeId !== h.id,
          'border-gray-300': activeId === h.id,
        })}
      >
        <a href={`#${h.id}`} onClick={handleClick} className="flex text-gray-800 hover:text-blue-700">
          <div className={clsx(`flex items-center`, i > 0 ? `min-w-${parsedLevel * 2}` : '')}>
            {i > 0 &&
              new Array(parsedLevel * 2)
                .fill(0)
                .map((_, index) => <div key={index} className="w-[2px] h-[2px] bg-gray-300 mr-1" />)}
          </div>
          <p
            className={clsx('line-clamp-1', {
              'font-semibold': i === 0,
            })}
          >
            {h.text}
          </p>
        </a>
      </li>
    );
  });

  return (
    <div className="w-full">
      <ul className="py-2">{list}</ul>
    </div>
  );
};

const HeadingListStyled = styled.ul`
  padding: 8px 0;

  li {
    padding-left: 16px;
    height: 28px;
    font-size: 16px;
  }
`;

export default MDContentToc;
