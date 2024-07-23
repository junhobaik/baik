'use client';

import React, { useMemo, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { Button } from '@junhobaik/ui';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spacer } from '@nextui-org/react';
import { IconChevronDown } from '@tabler/icons-react';
import { useAtomValue } from 'jotai';

import { enEnabled } from '@/store';

import SearchDialog from '../SearchDialog';

const ArchiveHeader = ({ lang = 'ko' }: { lang?: 'ko' | 'en' }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [currentLang, setCurrentLang] = useState(lang);
  const enAvailable = useAtomValue(enEnabled);

  const disabledIntlKeys = useMemo(() => {
    const keys = new Set<'ko' | 'en'>();

    if (lang === 'ko') keys.add('ko');
    if (!enAvailable || lang === 'en') keys.add('en');

    return keys;
  }, [enAvailable, currentLang]);

  return (
    <header className="sticky top-0 flex justify-center h-16 z-50 bg-white border-b">
      <div className="flex items-center justify-between w-[92%]">
        <Link className="flex items-center" href="/">
          <Image width={20} height={20} src="/icon.png" alt="" />
          <p className="ml-1 text-md font-semibold">Baik</p>
        </Link>

        <div className="flex items-center">
          <SearchDialog />

          <Spacer x={1} />

          {!enAvailable && lang === 'en' ? null : (
            <Dropdown className="w-16">
              <DropdownTrigger>
                <Button variant="flat" size="xs" radius="xl">
                  <IconChevronDown size={14} />
                  {lang === 'en' ? <div>🇺🇸</div> : <div>🇰🇷</div>}
                </Button>
              </DropdownTrigger>

              <DropdownMenu
                aria-label="Change Country"
                selectionMode="single"
                selectedKeys={[currentLang]}
                disabledKeys={disabledIntlKeys}
              >
                <DropdownItem key="ko" color="primary" href={`/${pathname.replace('/en', '')}`}>
                  🇰🇷 한국어
                </DropdownItem>
                <DropdownItem
                  key="en"
                  color="primary"
                  href={`/en${pathname}`}
                  className={!enAvailable ? 'line-through' : ''}
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
