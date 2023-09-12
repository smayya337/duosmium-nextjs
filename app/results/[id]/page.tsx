// @ts-ignore
import { ResultDataTable } from '@/components/results/view/ResultDataTable';
import ResultView from '@/components/results/view/ResultView';
import { Result } from '@/lib/global/schema';
import { getCompleteResult, getResult } from '@/lib/results/async';
import { notFound } from 'next/navigation';
import * as React from 'react';

// @ts-ignore
export async function generateMetadata({ params }) {
	const id = params.id;
	try {
		const res: Result = await getResult(id);
		return { title: `${res.fullShortTitle} | Duosmium Results` };
	} catch (e) {
		notFound();
	}
}

// @ts-ignore
export default async function Page({
	params,
	searchParams
}: {
	params: { id: string };
	searchParams: { team: number | undefined };
}) {
	const id = params.id;
	let data: object;
	try {
		data = await getCompleteResult(id);
	} catch (e) {
		notFound();
	}
	let team: number | undefined = undefined;
	if (searchParams.team) {
		try {
			team = Number(searchParams.team);
		} catch (e) {
			team = undefined;
		}
	}
	// noinspection HtmlUnknownTarget
	return <ResultView data={data} team={team} />;
}
