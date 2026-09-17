import * as React from 'react';

import { cn } from '@/lib/utils';

type TextAreaProps = React.ComponentProps<'textarea'> & {
  size?: '1' | '2' | '3';
};

function TextArea({ className, size = '2', ...props }: TextAreaProps) {
  return (
    <textarea
      data-slot="textarea"
      data-size={size}
      className={cn(
        'flex min-h-16 w-full resize-y rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-gray-400 focus-visible:border-orange-400 focus-visible:ring-2 focus-visible:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export { TextArea };