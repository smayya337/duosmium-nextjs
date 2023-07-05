'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import * as React from 'react';
import { useState } from 'react';

export function MenuToggle() {
	const [open, setOpen] = useState('closed');

	return (
		<Button
			variant="ghost"
			size="sm"
			onClick={() => setOpen(open === 'open' ? 'closed' : 'open')}
			className={'lg:hidden'}
		>
			<Icons.menu className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
			<Icons.x className="absolute scale-0 transition-all dark:rotate-0 dark:scale-100" />
			<span className="sr-only">Open menu</span>
		</Button>
	);
}
