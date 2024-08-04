'use client';

import Link from 'next/link';

import { Button } from '@nextui-org/react';
import { Icon, IconBrandAppstore, IconBrowser, IconHome, IconLink } from '@tabler/icons-react';

interface LinkItem {
  type: 'title' | 'link';
  text: string;
  href: string;
  target?: '_blank' | '_self';
  Icon?: Icon;
}
interface TitleItem {
  type: 'title';
  text: string;
}

type Links = TitleItem | LinkItem;

const links: Links[] = [
  {
    type: 'title',
    text: 'Links',
  },
  {
    type: 'link',
    text: 'Blog',
    href: '/archive',
    Icon: IconHome,
  },

  {
    type: 'title',
    text: 'External links',
  },
  {
    type: 'link',
    text: 'Portfolio',
    href: 'https://baik-portfolio.vercel.app',
    target: '_blank',
    Icon: IconLink,
  },
  {
    type: 'link',
    text: 'Blog (Deprecated)',
    href: 'https://junhobaik.github.io',
    Icon: IconLink,
  },

  {
    type: 'title',
    text: 'Projects',
  },
  {
    type: 'link',
    text: 'Dev Archive',
    href: 'https://devarchive.me',
    target: '_blank',
    Icon: IconBrowser,
  },
  {
    type: 'link',
    text: 'Scroll Browser',
    href: 'https://apps.apple.com/kr/app/scroll-browser-auto-scroll/id6596762930',
    target: '_blank',
    Icon: IconBrandAppstore,
  },
];

const LinkList = () => {
  const renderTitle = (text: string) => {
    return <p className="text-white text-sm mt-6 mb-1 font-medium">{text}</p>;
  };

  const renderLink = (item: LinkItem) => {
    const Icon = item.Icon;

    return (
      <Button
        href={item.href}
        as={Link}
        color="primary"
        variant="solid"
        fullWidth
        radius="full"
        startContent={Icon ? <Icon size={18} /> : null}
        className="my-2 bg-white text-slate-800 font-medium shadow-sm shadow-slate-500/20"
      >
        {item.text}
      </Button>
    );
  };

  const linkMap = links.map((item, index) => {
    return (
      <li key={`${item.type}-${index}`} className="w-full">
        {item.type === 'link' && renderLink(item)}
        {item.type === 'title' && renderTitle(item.text)}
      </li>
    );
  });

  return <ul className="flex flex-col items-center w-full">{linkMap}</ul>;
};

export default LinkList;
