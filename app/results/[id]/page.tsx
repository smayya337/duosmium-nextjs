// @ts-ignore
import Interpreter from 'sciolyff/interpreter';
import { getInterpreter } from '@/app/lib/results/interpreter';
import { getResult } from '@/app/lib/results/async';
import { dateString, formatSchool, objectToYAML, tournamentTitle } from '@/app/lib/results/helpers';
import { Event, Placing, Team } from 'sciolyff/dist/src/interpreter/types';

async function getRequestedInterpreter(id: string) {
	const result = await getResult(id);
	const yaml = objectToYAML(result);
	return getInterpreter(yaml);
}

// @ts-ignore
export default async function Page({ params }) {
	const id = params.id;
	const interpreter: Interpreter = await getRequestedInterpreter(id);
	return (
		<div>
			<h1>
				{interpreter.tournament.year} {tournamentTitle(interpreter.tournament)} (Div.{' '}
				{interpreter.tournament.division.toUpperCase()})
			</h1>
			<p>{dateString(interpreter)}</p>
			<table>
				<thead>
					<tr>
						<th>Number</th>
						<th>Team</th>
						<th>Rank</th>
						<th>Score</th>
						{interpreter.events.map((value: Event, index: number) => {
							return <th key={index}>{value.name}</th>;
						})}
					</tr>
				</thead>
				<tbody>
					{interpreter.teams.map((value: Team) => {
						return (
							<tr key={value.number}>
								<td>{value.number}</td>
								<td>
									{formatSchool(value)}
									{value.suffix ? ' ' + value.suffix : ''}
								</td>
								<td>{value.rank}</td>
								<td>{value.points}</td>
								{value.placings?.map((placing: Placing) => {
									return <td key={placing.event?.name}>{placing.points}</td>;
								})}
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
