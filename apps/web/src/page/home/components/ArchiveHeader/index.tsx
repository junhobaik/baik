'use client';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@junhobaik/ui';
import { IconLogin2 } from '@tabler/icons-react';
import { signIn } from 'next-auth/react';

const ArchiveHeader = () => {
  return (
    <header className="sticky top-0 flex justify-center h-10 z-10 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 border-b">
      <div className="flex items-center justify-between w-[92%]">
        <Link className="flex items-center" href="/">
          <Image width={20} height={20} src="/icon.png" alt="" />
          <p className="ml-1 text-md font-semibold">Baik's Archive</p>
        </Link>

        <div>
          <Button onClick={() => signIn()} size="xs" variant="light">
            <IconLogin2 size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ArchiveHeader;
