'use client';

import { updateAllMetadata } from '@/app/admin/update-metadata';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

export default function AdminHome() {
	// TODO: what on earth is going on here? The first toast never shows up
	async function updateMeta() {
		try {
			const promise = updateAllMetadata();
			toast({
				title: 'Updating metadata...',
				description: 'This may take a while, so be patient.'
			});
			await promise;
		} catch (e) {
			toast({
				title: 'Unable to update metadata!',
				// @ts-ignore
				description: e.message,
				variant: 'destructive'
			});
			return;
		}
		toast({
			title: 'Metadata updated!',
			description: 'All results are using the latest metadata.'
		});
	}

	return (
		<div className="container">
			<p>Congratulations! You are an administrator.</p>
			<h2 className={'py-4 text-3xl font-bold tracking-tight transition-colors text-center'}>
				Actions
			</h2>
			<form action={updateMeta} className={'flex justify-center'}>
				<Button className={'mx-auto'}>Regenerate Metadata</Button>
			</form>
		</div>
	);
}
