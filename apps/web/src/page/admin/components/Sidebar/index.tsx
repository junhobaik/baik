'use client';

import React, { useMemo, useState } from 'react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { IconBookmark, IconChevronLeft, IconChevronRight, IconHome, IconNews, IconRss } from '@tabler/icons-react';
import styled from 'styled-components';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const searchParams = useSearchParams();
  const path = useMemo(() => searchParams.get('path'), [searchParams]);

  return (
    <SidebarStyled className={`${collapsed ? 'collapsed' : ''}`}>
      <div className="toggle-container">
        <div
          className="toggle"
          onClick={() => {
            setCollapsed((prev) => !prev);
          }}
        >
          {!collapsed ? <IconChevronLeft /> : <IconChevronRight />}
        </div>
      </div>

      <div className="logo-container">
        <div className="logo-box" />
        <p className="logo-text">Baik</p>
      </div>

      <div className="section-container">
        <p className="section-title">Main</p>
        <div>
          <Link className={`styled-link ${path === 'home' ? 'active' : ''}`} href={'?path=home'}>
            <span className="icon-wrapper">
              <IconHome size={20} />
            </span>
            <p className="link-text">Home</p>
          </Link>
        </div>
      </div>

      <div className="section-container">
        <p className="section-title">Dashboard</p>
        <div>
          <Link className={`styled-link ${path === 'bookmarks' ? 'active' : ''}`} href={'?path=bookmarks'}>
            <span className="icon-wrapper">
              <IconBookmark size={20} />
            </span>
            <p className="link-text">Bookmarks</p>
          </Link>
          <Link className={`styled-link ${path === 'feeds' ? 'active' : ''}`} href={'?path=feeds'}>
            <span className="icon-wrapper">
              <IconRss size={20} />
            </span>
            <p className="link-text">Feeds</p>
          </Link>
        </div>
      </div>

      <div className="section-container">
        <p className="section-title">Archive</p>
        <div>
          <Link className={`styled-link ${path === 'articles' ? 'active' : ''}`} href={'?path=articles'}>
            <span className="icon-wrapper">
              <IconNews size={20} />
            </span>
            <p className="link-text">Articles</p>
          </Link>
        </div>
      </div>
    </SidebarStyled>
  );
};

const SidebarStyled = styled.div`
  width: 240px;
  overflow-y: auto;
  padding-top: 24px;
  transition: width 0.1s;

  .logo-text,
  .section-title,
  .link-text {
    opacity: 1;
    transition: opacity 0.1s;
  }

  &.collapsed {
    width: 52px;
    overflow: hidden;

    .logo-text,
    .section-title,
    .link-text {
      opacity: 0;
    }
  }

  .toggle-container {
    display: flex;
    justify-content: flex-end;
    padding: 0 16px 16px 16px;

    .toggle {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 20px;
      height: 20px;
      border-radius: 4px;
      color: #595959;
      background-color: #e0e0e0;
      cursor: pointer;
    }
  }

  .logo-container {
    display: flex;
    align-items: center;
    height: 32px;
    padding: 0 16px 0 16px;
    margin-bottom: 16px;
    position: relative;

    .logo-box {
      margin-right: 4px;
      border: 1px solid;
      min-width: 20px;
      width: 20px;
      height: 20px;
    }

    .logo-text {
      font-size: 18px;
      font-weight: bold;
    }
  }

  .section-container {
    padding-top: 32px;
    font-weight: 600;
    color: #475569;
    font-size: 14px;

    .section-title {
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
      height: 16px;
      display: flex;
      align-items: center;
      padding: 0 16px;
    }

    .styled-link {
      display: flex;
      align-items: center;
      padding: 4px 16px;
      height: 40px;

      &:hover {
        background-color: #eff6ff;
      }

      &.active {
        background-color: rgb(219, 234, 254);
      }

      .link-text {
        font-size: 14px;
      }

      .icon-wrapper {
        margin-right: 8px;
      }
    }
  }
`;

export default Sidebar;
