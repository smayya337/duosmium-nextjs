import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	TableRowWithoutHover
} from '@/components/ui/table';

export function TeamDialogTable({
	tableData
}: {
	tableData: { name: string; points: string; place: string; notes: string; medals: number }[];
}) {
	return (
		<Table>
			<TableHeader>
				<TableRowWithoutHover>
					<TableHead className={'h-8 py-2'}>Event</TableHead>
					<TableHead className={'h-8 py-2 text-center'}>Points</TableHead>
					<TableHead className={'h-8 py-2 text-center'}>Place</TableHead>
					<TableHead className={'h-8 py-2'}>Notes</TableHead>
				</TableRowWithoutHover>
			</TableHeader>
			<TableBody>
				{tableData.map((t) => {
					const placeNumber = Number(t.place.replace(/st|nd|rd|th/, ''));
					return (
						<TableRowWithoutHover
							key={t.name}
							className={placeNumber <= t.medals ? `place-${placeNumber}` : ''}
						>
							<TableCell className={'font-medium px-4 py-2'}>{t.name}</TableCell>
							<TableCell className={'px-4 py-2 text-center'}>{t.points}</TableCell>
							<TableCell className={'px-4 py-2 text-center'}>
								{t.place.replace('undefinedth', 'n/a')}
							</TableCell>
							<TableCell className={'px-4 py-2'}>{t.notes}</TableCell>
						</TableRowWithoutHover>
					);
				})}
			</TableBody>
		</Table>
	);
}
