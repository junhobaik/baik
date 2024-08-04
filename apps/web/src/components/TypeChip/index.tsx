import { memo } from 'react';

import { ArticleType } from '@baik/types';
import clsx from 'clsx';

const TypeChip = ({
  type,
  disabled = false,
  onClick,
  className = '',
}: {
  type: ArticleType;
  disabled?: boolean;
  onClick?: () => unknown;
  className?: string;
}) => {
  return (
    <div
      className={clsx([
        'inline-flex px-2 py-[2px] text-xs rounded-lg select-none',
        type === 'post' && 'bg-blue-500 text-white',
        type === 'shorts' && 'bg-purple-400 text-white',
        type === 'clip' && 'bg-green-500 text-white',
        disabled && '!bg-gray-200 !text-gray-500',
        !!onClick && 'cursor-pointer',
        className,
      ])}
      onClick={onClick}
    >
      {type === 'post' && 'Post'}
      {type === 'shorts' && 'Shorts'}
      {type === 'clip' && 'Clip'}
    </div>
  );
};

export default memo(TypeChip);
