'use client';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@nextui-org/react';
import {
  IconBookmark,
  IconBox,
  IconChevronLeft,
  IconChevronRight,
  IconDashboard,
  IconEdit,
  IconHome,
  IconLogout,
  IconNews,
  IconPaperclip,
  IconRss,
} from '@tabler/icons-react';
import { useAtom } from 'jotai';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import styled from 'styled-components';

import { sidebarCollapsed } from '@/store';

const Sidebar = ({ session }: { session: Session }) => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useAtom(sidebarCollapsed);

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
        <div className="logo-box">{!!session.user?.image && <Image src={'/icon.png'} alt="" fill />}</div>
        <p className="logo-text">Baik</p>
      </div>

      <div className="section-divider">
        <p className="section-divider--text">Main</p>
        <div className="section-divider--line"></div>
      </div>

      <div className="section-container">
        <p className="section-title">Home</p>
        <div>
          <Link className={`styled-link ${pathname === '/' ? 'active' : ''}`} href={'/'}>
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
          <Link className={`styled-link ${pathname === '/dashboard' ? 'active' : ''}`} href={'/dashboard'}>
            <span className="icon-wrapper">
              <IconDashboard size={20} />
            </span>
            <p className="link-text">Dashboard</p>
          </Link>
        </div>
      </div>

      <div className="section-container">
        <p className="section-title">Archive</p>
        <div>
          <Link className={`styled-link ${pathname === '/archive' ? 'active' : ''}`} href={'/archive'}>
            <span className="icon-wrapper">
              <IconBox size={20} />
            </span>
            <p className="link-text">Archive</p>
          </Link>
        </div>

        <div>
          <Link className={`styled-link ${pathname === '/archive/write' ? 'active' : ''}`} href={'/archive/write'}>
            <span className="icon-wrapper">
              <IconEdit size={20} />
            </span>
            <p className="link-text">Write</p>
          </Link>
        </div>

        <div>
          <Link className={`styled-link ${pathname === '/archive/webclip' ? 'active' : ''}`} href={'/archive/webclip'}>
            <span className="icon-wrapper">
              <IconPaperclip size={20} />
            </span>
            <p className="link-text">WebClip</p>
          </Link>
        </div>
      </div>

      <div className="section-divider">
        <p className="section-divider--text">Admin</p>
        <div className="section-divider--line"></div>
      </div>

      <div className="section-container">
        <p className="section-title">Dashboard</p>
        <div>
          <Link className={`styled-link ${pathname === '/admin/bookmarks' ? 'active' : ''}`} href={'/admin/bookmarks'}>
            <span className="icon-wrapper">
              <IconBookmark size={20} />
            </span>
            <p className="link-text">Bookmarks</p>
          </Link>
          <Link className={`styled-link ${pathname === '/admin/feeds' ? 'active' : ''}`} href={'/admin/feeds'}>
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
          <Link className={`styled-link ${pathname === '/admin/articles' ? 'active' : ''}`} href={'/admin/articles'}>
            <span className="icon-wrapper">
              <IconNews size={20} />
            </span>
            <p className="link-text">Articles</p>
          </Link>
        </div>
      </div>

      <div className="foot-container">
        <Button
          fullWidth
          variant="light"
          startContent={<IconLogout size={18} />}
          onClick={() => signOut({ callbackUrl: '/', redirect: true })}
        >
          Sign Out
        </Button>
      </div>
    </SidebarStyled>
  );
};

const SidebarStyled = styled.div`
  width: 240px;
  min-width: 240px;
  overflow-y: auto;
  padding-top: 24px;
  transition: width 0.1s;
  height: 100svh;
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e055;

  .foot-container {
    padding: 16px;
    margin-top: auto;
  }

  .logo-text,
  .section-title,
  .link-text,
  .section-divider,
  .foot-container {
    opacity: 1;
    transition: opacity 0.1s;
  }

  &.collapsed {
    width: 52px;
    min-width: 52px;
    overflow: hidden;

    .logo-text,
    .section-title,
    .link-text,
    .section-divider,
    .foot-container {
      opacity: 0;
      pointer-events: none;
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
    padding: 0 16px 16px;
    margin-bottom: 48px;
    position: relative;

    .logo-box {
      position: relative;
      margin-right: 4px;
      border-radius: 4px;
      overflow: hidden;
      min-width: 20px;
      width: 20px;
      height: 20px;
    }

    .logo-text {
      font-size: 18px;
      font-weight: bold;
    }
  }

  .section-divider {
    height: 32px;
    padding: 0 8px 16px 8px;
    position: relative;
    display: flex;
    align-items: center;
    &--text {
      position: absolute;
      background-color: #fff;
      z-index: 1;
      padding: 0 4px;
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
    }
    &--line {
      position: absolute;
      height: 1px;
      width: calc(100% - 16px);
      background-color: #e0e0e0;
    }
  }

  .section-container {
    padding-bottom: 16px;
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
