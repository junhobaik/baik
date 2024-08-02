'use client';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Button, ButtonGroup, ButtonProps } from '@nextui-org/react';
import {
  IconBrandAndroid,
  IconBrandApple,
  IconBrandAppstore,
  IconBrandChrome,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrowser,
  IconLink,
  IconLockSquareRounded,
  IconLogin,
  IconMail,
  IconUserCog,
} from '@tabler/icons-react';
import clsx from 'clsx';
import { Session } from 'next-auth';
import { signIn } from 'next-auth/react';
import styled from 'styled-components';

interface HomeScreenProps {
  session: Session | null;
}

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
}

const data: {
  title: string;
  items: {
    text: string;
    href: string;
    target?: '_blank' | '_self';
    Icon?: any;
    isDisabled?: boolean;
    isDeprecated?: boolean;
    mainPlatform?: 'web' | 'ios' | 'extension' | 'android';
    otherPlatform?: {
      web?: { url: string; isDisabled?: boolean };
      ios?: { url: string; isDisabled?: boolean };
      extension?: { url: string; isDisabled?: boolean };
      android?: { url: string; isDisabled?: boolean };
    };
  }[];
}[] = [
  {
    title: 'Links',
    items: [
      { text: 'Blog', href: '/archive' },
      {
        text: 'Portfolio',
        href: 'https://baik-portfolio.vercel.app',
        Icon: IconLink,
        target: '_blank',
      },
      // { text: 'Blog', href: 'https://junhobaik.github.io', Icon: IconLink, isDeprecated: true, target: '_blank' },
    ],
  },
  {
    title: 'Projects',
    items: [
      {
        text: 'Dev Archive',
        href: 'https://devarchive.me',
        target: '_blank',
        Icon: IconBrowser,
        mainPlatform: 'web',
        otherPlatform: {
          ios: {
            url: 'https://apps.apple.com/kr/app/dev-archive/id6499582071',
          },
          extension: {
            url: 'https://chromewebstore.google.com/detail/dev-archive-extension-dev/gjbnnjdbikchiebdkojongocgpfmaclj?hl=ko&authuser=0',
          },
        },
      },
      {
        text: 'Scroll Browser',
        href: 'https://devarchive.me',
        target: '_blank',
        Icon: IconBrandApple,
        isDisabled: true,
        mainPlatform: 'ios',
        otherPlatform: {
          android: {
            url: '',
            isDisabled: true,
          },
        },
      },
    ],
  },
];

const SocialLink = ({ href, icon }: SocialLinkProps) => (
  <Link href={href} target="_blank" className="flex flex-col items-center text-gray-600 hover:text-gray-400">
    {icon}
  </Link>
);

const HomeScreen = (props: HomeScreenProps) => {
  const { session } = props;

  return (
    <HomeStyled className="fixed h-screen w-screen flex items-center justify-center">
      <div
        className={clsx([
          'fixed right-2 top-3 flex justify-end items-center py-1 pr-2 pl-3 text-white/70 hover:text-white cursor-pointer',
          'border-2 border-transparent hover:border-white/70 rounded-full',
          'max-w-[40px] hover:max-w-full overflow-hidden transition-all',
        ])}
        onClick={() => signIn()}
      >
        <p className="mr-2 whitespace-nowrap">Administrator login</p>
        <div className="min-w-[24px]">
          <IconUserCog size={24} />
        </div>
      </div>
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
          {data.map((v) => {
            return (
              <ItemStyled>
                <div className={clsx(['relative mb-4 flex flex-col items-center justify-center w-full'])}>
                  <p className="text-gray-500/80 font-semibold text-sm bg-white px-2 z-10">{v.title}</p>
                  <div className="h-[1px] w-[calc(100%-16px)] bg-gray-300 absolute" />
                </div>

                <ul className="list">
                  {v.items.map((item) => {
                    const Icon = item.Icon;
                    const buttonProps = {
                      fullWidth: true,
                      isDisabled: item.isDisabled,
                      startContent: Icon ? <Icon size={20} /> : null,
                      endContent: item.isDeprecated ? <p className="opacity-80">(Deprecated)</p> : null,
                      className: clsx(
                        'font-semibold',
                        item.isDisabled
                          ? ''
                          : {
                              'bg-[#0094e9] text-white': !item.isDeprecated,
                              'bg-[#0094e9a5] text-white': item.isDeprecated,
                            },
                      ),
                    };

                    if (item.mainPlatform) {
                      const otherPlatformLength = Object.keys(item.otherPlatform ?? {}).length;

                      return (
                        <li>
                          <ButtonGroup fullWidth isDisabled={item.isDisabled} radius="full">
                            <Button
                              {...buttonProps}
                              startContent={null}
                              className={clsx([buttonProps.className, '!pr-[10px]'])}
                              endContent={<div className="ml-auto">{!!Icon && <Icon size={20} />}</div>}
                              as={Link}
                              href={item.href}
                              target={item.target ?? '_self'}
                            >
                              <div
                                className={clsx([
                                  'text-center',
                                  {
                                    'min-w-[calc(100%-32px)]': otherPlatformLength === 3,
                                    'min-w-[calc(100%-32px-40px)]': otherPlatformLength === 2,
                                    'min-w-[calc(100%-32px-80px)]': otherPlatformLength === 1,
                                    'min-w-[calc(100%-32px-120px)]': otherPlatformLength === 0,
                                  },
                                ])}
                              >
                                {item.text}
                              </div>
                            </Button>

                            {!!item.otherPlatform?.ios && (
                              <Button
                                className={buttonProps.className}
                                as={Link}
                                href={item.otherPlatform?.ios.url}
                                isDisabled={item.otherPlatform?.ios.isDisabled}
                                target="_blank"
                                isIconOnly
                              >
                                <IconBrandApple size={20} />
                              </Button>
                            )}
                            {!!item.otherPlatform?.android && (
                              <Button
                                className={buttonProps.className}
                                as={Link}
                                href={item.otherPlatform?.android.url}
                                isDisabled={item.otherPlatform?.android.isDisabled}
                                target="_blank"
                                isIconOnly
                              >
                                <IconBrandAndroid size={20} />
                              </Button>
                            )}
                            {!!item.otherPlatform?.extension && (
                              <Button
                                className={buttonProps.className}
                                as={Link}
                                isDisabled={item.otherPlatform?.extension.isDisabled}
                                href={item.otherPlatform?.extension.url}
                                target="_blank"
                                isIconOnly
                              >
                                <IconBrandChrome size={20} />
                              </Button>
                            )}
                          </ButtonGroup>
                        </li>
                      );
                    }
                    return (
                      <li>
                        <Button
                          {...buttonProps}
                          radius="full"
                          as={Link}
                          href={item.href}
                          target={item.target ?? '_self'}
                        >
                          {item.text}
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              </ItemStyled>
            );
          })}
        </div>
      </div>
    </HomeStyled>
  );
};

const ItemStyled = styled.div`
  width: 100%;
  margin-bottom: 40px;

  .list {
    display: flex;
    flex-direction: column;
    width: 100%;

    li {
      width: 100%;
    }
    & > li:nth-child(n + 2) {
      margin-top: 16px;
    }
  }
`;

const HomeStyled = styled.div`
  background-color: #0093e9;
  background-image: linear-gradient(116deg, #0093e9 0%, #80d0c7 100%);
`;

export default HomeScreen;
