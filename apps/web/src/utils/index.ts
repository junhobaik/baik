import { convert } from 'html-to-text';
import { marked } from 'marked';

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const copyClipboard = async (value: string) => {
  try {
    await navigator.clipboard.writeText(value);
  } catch (error) {
    console.error('클립보드 복사 실패:', error);
  }
};

type Without<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

export const removeKeys = <T extends object, K extends keyof T>(obj: T, keys: K[]): Without<T, K> => {
  const rest = { ...obj };
  keys.forEach((key) => {
    delete rest[key];
  });
  return rest as Without<T, K>;
};

export const removeDefaultKey = <T extends object>(obj: T): Without<T, keyof T> => {
  const defaultKeys = [
    'id',
    'pk',
    'sk',
    'created_at',
    'updated_at',
    'GSI1PK',
    'GSI1SK',
    'GSI2PK',
    'GSI2SK',
    'GSI3PK',
    'GSI3SK',
    'GSI4PK',
    'GSI4SK',
  ] as (keyof T)[];
  return removeKeys(obj, defaultKeys);
};

export const markdownToPlainText = (markdownText: string): string => {
  let md = markdownText
    .replace('***', '')
    .replace(/(\n\s*\n)/g, ' ') // 연속된 줄 바꿈을 공백으로 변환
    .replace(/\n/g, ' ') // 나머지 줄바꿈도 공백으로 변환
    .replace(/^\s+|\s+$/g, '') // 선행 및 후행 공백 제거
    .replace(/\[.*?\]\(.*?\)/g, '') // 링크
    .replace(/!\[.*?\]\(.*?\)/g, '') // 이미지
    .replace(/\[.*?\]\(.*?\)/g, '') // 링크
    .replace(/`{1,2}[^`](.*?)`{1,2}/g, '$1') // 인라인 코드
    .replace(/```[\s\S]*?```/g, '') // 블록 코드
    .replace(/[#]+ (.*?)(\n|$)/g, '$1 ') // 헤더
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // 볼드
    .replace(/(\*|_)(.*?)\1/g, '$2') // 이탤릭
    .replace(/~~(.*?)~~/g, '$1') // 취소선
    .replace(/> (.*?)(\n|$)/g, '$1 ') // 블록 인용
    .replace(/[-*+]\s+(.*?)(\n|$)/g, '$1 ') // 리스트
    .replace(/\d+\.\s+(.*?)(\n|$)/g, '$1 '); // 숫자 리스트

  return convert(marked.parse(md) as string);
};

export const removeFrontmatter = (markdownText: string): string => {
  const frontmatterRegex = /^---\s*[\r\n]+([\s\S]*?)[\r\n]+---[\r\n]*/;
  return markdownText.replace(frontmatterRegex, '');
};

export const toKebabCase = (str: string) => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2') // camelCase 처리
    .replace(/[\s_]+/g, '-') // 공백과 언더바 처리
    .toLowerCase(); // 소문자로 변환
};

export const isKebabCase = (str: string) => {
  const kebabCaseRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  return kebabCaseRegex.test(str);
};

export const removeSpecialCharacters = (str: string, exceptions: string[] = []) => {
  const regexString = `[^a-zA-Z0-9\\s${exceptions.join('')}]`;
  const regex = new RegExp(regexString, 'g');
  return str.replace(regex, '');
};

export const containsSpecialCharacters = (str: string, exceptions: string[] = []) => {
  const regexString = `[^a-zA-Z0-9\\s${exceptions.join('')}]`;
  const regex = new RegExp(regexString);
  return regex.test(str);
};

export const calculateDynamoDBSize = (item: any): number => {
  const getSize = (value: any): number => {
    if (value === null || value === undefined) {
      return 1;
    }

    switch (typeof value) {
      case 'string':
        return Buffer.from(value).length + 1;
      case 'number':
        return 8;
      case 'boolean':
        return 1;
      case 'object':
        if (Array.isArray(value)) {
          return 3 + value.reduce((sum, item) => sum + getSize(item), 0);
        } else {
          return 3 + Object.entries(value).reduce((sum, [key, val]) => sum + getSize(key) + getSize(val), 0);
        }
      default:
        return 0;
    }
  };

  const bytes = getSize(item);
  return Number((bytes / 1024).toFixed(2));
};

export const getOriginFromUrl = (url: string): string => {
  const exceptionHostnames = ['velog.io'];

  try {
    const urlObject = new URL(url);

    const { protocol, hostname, pathname } = urlObject;
    const origin = `${protocol}//${hostname}`;

    if (exceptionHostnames.includes(hostname)) {
      if (hostname === 'velog.io') {
        return `${origin}${pathname.split('/').slice(0, 2).join('/')}/posts`;
      }
      return `${origin}${pathname.split('/').slice(0, 2).join('/')}`;
    }

    return origin;
  } catch (error) {
    console.error('Invalid URL:', error);
    return '';
  }
};

export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};
