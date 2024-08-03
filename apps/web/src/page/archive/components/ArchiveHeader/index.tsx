'use client';

import React, { useMemo } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { Button } from '@junhobaik/ui';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spacer } from '@nextui-org/react';
import { IconChevronDown } from '@tabler/icons-react';
import { useAtomValue } from 'jotai';
import Cookies from 'js-cookie';

import { enEnabled } from '@/store';

import SearchDialog from '../SearchDialog';

const ArchiveHeader = ({ lang = 'ko' }: { lang?: 'ko' | 'en' }) => {
  const router = useRouter();
  const pathname = usePathname();

  const enAvailable = useAtomValue(enEnabled);

  const disabledIntlKeys = useMemo(() => {
    const keys = new Set<'ko' | 'en'>();

    if (lang === 'ko') keys.add('ko');
    if (!enAvailable || lang === 'en') keys.add('en');

    return keys;
  }, [enAvailable, lang]);

  return (
    <header className="sticky top-0 flex justify-center h-16 z-50 bg-white border-b">
      <div className="flex items-center justify-between w-[92%]">
        <Link className="flex items-center" href={pathname.startsWith('/archive/en') ? '/archive/en' : '/archive'}>
          <Image width={20} height={20} src="/icon.png" alt="" />
          <p className="ml-1 text-md font-semibold">Baik</p>
        </Link>

        <div className="flex items-center">
          <SearchDialog />

          <Spacer x={1} />

          {!enAvailable && lang === 'en' ? null : (
            <Dropdown
              className="w-16"
              onOpenChange={(isOpen) => {
                if (isOpen && lang === 'ko') {
                  router.prefetch('/archive/en');
                }
              }}
            >
              <DropdownTrigger>
                <Button variant="flat" size="xs" radius="xl">
                  <IconChevronDown size={14} />
                  {lang === 'en' ? <div>🇺🇸</div> : <div>🇰🇷</div>}
                </Button>
              </DropdownTrigger>

              <DropdownMenu
                aria-label="Change Country"
                selectionMode="single"
                selectedKeys={[lang]}
                disabledKeys={disabledIntlKeys}
              >
                <DropdownItem
                  key="ko"
                  color="primary"
                  href={`${pathname.replace('/en', '')}`}
                  onClick={(e) => {
                    e.preventDefault();
                    Cookies.set('language', 'ko');
                    router.push(pathname.replace('/en', ''));
                    router.refresh();
                  }}
                >
                  🇰🇷 한국어
                </DropdownItem>
                <DropdownItem
                  key="en"
                  color="primary"
                  href={`${pathname.replace('archive', 'archive/en')}`}
                  className={!enAvailable ? 'line-through' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    Cookies.set('language', 'en');
                    router.push(pathname.replace('archive', 'archive/en'));
                    router.refresh();
                  }}
                >
                  🇺🇸 English
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
      </div>
    </header>
  );
};

export default ArchiveHeader;
