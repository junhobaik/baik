'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import * as reactSpring from '@react-spring/three';
import * as drei from '@react-three/drei';
import * as fiber from '@react-three/fiber';
import { IconBrandGithub, IconBrandLinkedin, IconMail, IconUserCog } from '@tabler/icons-react';
import clsx from 'clsx';
import { Session } from 'next-auth';
import { signIn } from 'next-auth/react';
import { ShaderGradient, ShaderGradientCanvas } from 'shadergradient';
import styled from 'styled-components';

import LinkList from './LinkList';

interface HomeScreenProps {
  session: Session | null;
}

const ShaderBackground = () => {
  return (
    <ShaderGradientCanvas
      importedFiber={{ ...fiber, ...drei, ...reactSpring }}
      style={{
        position: 'fixed',
        top: 0,
        pointerEvents: 'none',
      }}
    >
      <ShaderGradient
        control="query"
        // urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=on&bgColor1=%23000000&bgColor2=%23000000&brightness=1.1&cAzimuthAngle=180&cDistance=3.9&cPolarAngle=115&cameraZoom=1&color1=%235606FF&color2=%23FE8989&color3=%23000000&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=40&frameRate=10&grain=off&lightType=3d&pixelDensity=1&positionX=-0.5&positionY=0.1&positionZ=0&range=disabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=0&rotationY=0&rotationZ=235&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=1.1&uFrequency=5.5&uSpeed=0.1&uStrength=2.4&uTime=0.2&wireframe=false"
        // urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=0.8&cAzimuthAngle=180&cDistance=2.8&cPolarAngle=80&cameraZoom=9.1&color1=%23606080&color2=%238d7dca&color3=%23212121&destination=onCanvas&embedMode=off&envPreset=dawn&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=on&lightType=3d&pixelDensity=1&positionX=0&positionY=0&positionZ=0&range=disabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=50&rotationY=0&rotationZ=-60&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=1.5&uFrequency=0&uSpeed=0.2&uStrength=1.5&uTime=8&wireframe=false"
        urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1.2&cAzimuthAngle=180&cDistance=2.9&cPolarAngle=120&cameraZoom=1&color1=%23ebedff&color2=%23cbdff8&color3=%23dbf8ff&destination=onCanvas&embedMode=off&envPreset=lobby&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=off&lightType=3d&pixelDensity=1&positionX=0&positionY=1.8&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=0&rotationY=0&rotationZ=-90&shader=defaults&type=waterPlane&uDensity=1&uFrequency=5.5&uSpeed=0.3&uStrength=3&uTime=0.2&wireframe=false"
        envPreset="lobby"
      />
    </ShaderGradientCanvas>
  );
};

const FloatingSignIn = () => {
  return (
    <div
      className={clsx([
        'fixed right-2 top-3 z-30 flex justify-end items-center py-1 pr-2 pl-3 text-white/70 hover:text-white cursor-pointer',
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
  );
};

const Social = () => {
  return (
    <div className="flex items-center gap-6">
      <Link
        href="mailto:junhobaik@gmail.com"
        target="_blank"
        className="flex flex-col items-center text-gray-500 hover:text-gray-400"
      >
        <IconMail />
      </Link>

      <Link
        href="https://www.linkedin.com/in/junhobaik/"
        target="_blank"
        className="flex flex-col items-center text-gray-500 hover:text-gray-400"
      >
        <IconBrandLinkedin />
      </Link>

      <Link
        href="https://github.com/junhobaik"
        target="_blank"
        className="flex flex-col items-center text-gray-500 hover:text-gray-400"
      >
        <IconBrandGithub />
      </Link>
    </div>
  );
};

const HomeScreen = (props: HomeScreenProps) => {
  const { session } = props;
  const [isProfileHide, setIsProfileHide] = useState(false);
  const profileContainerRef = useRef<HTMLDivElement>(null);

  const scrollTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsProfileHide(!entry.isIntersecting), { threshold: 0 });

    if (profileContainerRef.current) {
      observer.observe(profileContainerRef.current);
    }

    return () => {
      if (profileContainerRef.current) {
        observer.unobserve(profileContainerRef.current);
      }
    };
  }, []);

  return (
    <>
      <ShaderBackground />

      {!session && <FloatingSignIn />}

      <ContentStyled>
        <div ref={profileContainerRef} className="profile-container">
          <Image
            src="https://d25sqaee97ji3k.cloudfront.net/0816bcfe-3f37-4982-90a8-e825ba5663a8.png"
            width={100}
            height={100}
            className="rounded-full shadow-md shadow-slate-400/50"
            alt="profile image"
          />

          <p className="text-2xl text-slate-800/90 font-bold mt-2">Junho Baik</p>
          <p className="text-md text-gray-500">Frontend Developer</p>
        </div>

        <div className={clsx('floating-profile-container', { active: isProfileHide })} onClick={scrollTop}>
          <Image
            src="https://d25sqaee97ji3k.cloudfront.net/0816bcfe-3f37-4982-90a8-e825ba5663a8.png"
            width={36}
            height={36}
            className="rounded-full mr-2"
            alt="profile image"
          />

          <p className="text-xl text-slate-800 font-medium">Junho Baik</p>
        </div>

        <div className="content-container">
          <div className="mt-6">
            <Social />
          </div>

          <div className="mt-4">
            <LinkList />
          </div>
        </div>

        <div className="mt-auto pt-8 pb-4">
          <p className="text-xs text-gray-500 mt-6">© 2024 Junho Baik</p>
        </div>
      </ContentStyled>
    </>
  );
};

const ContentStyled = styled.div`
  position: absolute;
  top: 0;
  z-index: 20;
  width: 100%;
  min-height: calc(100vh + 240px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 64px;

  .content-container {
    width: 100%;
    text-align: center;
    max-width: 648px;
    padding: 0 16px;

    & > div {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  .profile-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .floating-profile-container {
    position: fixed;
    top: 0;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px 24px 4px 12px;
    background-color: white;
    border-radius: 9999px;
    height: 46px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
    transition:
      transform 0.2s,
      box-shadow 0.2s;
    transform: translateY(-100%);
    user-select: none;
    cursor: pointer;

    &.active {
      transform: translateY(16px);
    }

    @media (hover: hover) {
      &:hover {
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
      }
    }
  }
`;

export default HomeScreen;
