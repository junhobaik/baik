'use client';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@nextui-org/react';
import { IconBrandAppstore, IconBrandGithub, IconBrandLinkedin, IconLink, IconMail } from '@tabler/icons-react';
import clsx from 'clsx';
import { Session } from 'next-auth';
import styled from 'styled-components';

interface HomeScreenProps {
  session: Session | null;
}

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
}

interface AppLinkProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  disabled?: boolean;
  className?: string;
  isDeprecated?: boolean;
}

const SocialLink = ({ href, icon }: SocialLinkProps) => (
  <Link href={href} target="_blank" className="flex flex-col items-center text-gray-600 hover:text-gray-400">
    {icon}
  </Link>
);

const AppLink = ({ href, icon, text, disabled = false, className = '', isDeprecated = false }: AppLinkProps) => (
  <Link href={href} target="_blank" className="w-full">
    <Button
      fullWidth
      startContent={icon}
      color="default"
      className={clsx(
        { 'bg-[#0094e9] text-white': !isDeprecated, 'bg-[#0094e9a5] text-white': isDeprecated },
        className,
      )}
      isDisabled={disabled}
    >
      {text}
    </Button>
  </Link>
);

const Divider = ({ text, className }: { text: string; className?: string }) => (
  <div className={clsx(['relative mb-2 flex flex-col items-center justify-center w-full', className ?? ''])}>
    <p className="text-gray-500/80 font-semibold text-sm bg-white px-2 z-10">{text}</p>
    <div className="h-[1px] w-[calc(100%-16px)] bg-gray-300 absolute" />
  </div>
);

const HomeScreen = (props: HomeScreenProps) => {
  const { session } = props;

  return (
    <HomeStyled className="fixed h-screen w-screen flex items-center justify-center">
      <div
        className={clsx([
          'fixed top-[120px] bg-white rounded-[100%]',
          'w-[calc((100vh-120px)*2)] h-[calc((100vh-120px)*2)]',
          'sm:w-[640px] sm:h-[calc(100vh-120px-32px)] sm:rounded-[16px]',
        ])}
      />

      <div className="absolute top-[48px] z-20">
        <div className="w-[100px] shadow-zinc-500/40 shadow-md rounded-full">
          <Image
            src="https://d25sqaee97ji3k.cloudfront.net/0816bcfe-3f37-4982-90a8-e825ba5663a8.png"
            width={100}
            height={100}
            className="rounded-full"
            alt="profile image"
          />
        </div>
      </div>

      <div
        className={clsx([
          'absolute top-[160px] z-10 flex flex-col items-center',
          'min-h-[calc(100vh-160px)] w-[100vw]',
          'sm:min-h-[calc(100vh-160px-32px)] sm:w-[640px]',
        ])}
      >
        <div className="flex flex-col items-center h-[128px]">
          <p className="text-2xl text-[#0093e9] font-bold">Junho Baik</p>
          <p className="text-md text-gray-500">Frontend Engineer</p>

          <div className="mt-8 flex justify-around w-[320px]">
            <SocialLink href="mailto:junhobaik@gmail.com" icon={<IconMail size={36} />} />
            <div className="h-[32px] w-[1px] bg-gray-300 rounded-lg" />
            <SocialLink href="https://github.com/junhobaik" icon={<IconBrandGithub size={36} />} />
            <div className="h-[32px] w-[1px] bg-gray-300 rounded-lg" />
            <SocialLink href="https://www.linkedin.com/in/junhobaik/" icon={<IconBrandLinkedin size={36} />} />
          </div>
        </div>

        <div
          className={clsx([
            'p-4 mt-8 w-full flex flex-col items-center flex-grow overflow-y-auto',
            'h-[calc(100vh-160px-128px-32px)]',
            'sm:h-[calc(100vh-160px-32px-128px-32px)]',
          ])}
        >
          <Divider text="Links" />

          <AppLink href="/archive" icon={<IconLink size={20} />} text="Archive - Blog" />
          <AppLink
            href="https://junhobaik.github.io"
            icon={<IconLink size={20} />}
            text="Blog (deprecated)"
            className="mt-2"
            isDeprecated
          />

          <Divider text="Apps" className="mt-8" />

          <AppLink
            href="https://apps.apple.com/kr/app/dev-archive/id6499582071"
            icon={<IconBrandAppstore size={20} />}
            text="Dev Archive"
          />

          <Button fullWidth startContent={<IconBrandAppstore size={20} />} color="default" className="mt-2" isDisabled>
            Scroll Browser (In Review)
          </Button>
        </div>
      </div>
    </HomeStyled>
  );
};

const HomeStyled = styled.div`
  background-color: #0093e9;
  background-image: linear-gradient(116deg, #0093e9 0%, #80d0c7 100%);
`;

export default HomeScreen;
