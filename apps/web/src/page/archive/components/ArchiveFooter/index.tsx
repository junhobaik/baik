'use client';

import React from 'react';

import { IconLogin2 } from '@tabler/icons-react';
import { signIn } from 'next-auth/react';

interface ArchiveFooterProps {}

const year = new Date().getFullYear();

const ArchiveFooter = (props: ArchiveFooterProps) => {
  return (
    <footer className="flex justify-center w-full relative text-center text-sm text-gray-700 mt-auto px-4 pt-8 pb-4">
      <p className="">© {year} Junho Baik. All rights reserved.</p>

      <div
        className="absolute right-4 text-gray-400 hover:text-gray-600"
        onClick={() => signIn()}
        role="button"
        aria-label="Sign in"
      >
        <IconLogin2 size={18} />
      </div>
    </footer>
  );
};

export default ArchiveFooter;
