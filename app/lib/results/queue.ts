import type { QueueObject } from 'async';
import { queue } from 'async';
import { addResultFromYAMLFile } from './async';

const MAX_PROCESSES = 16;

export class ResultsAddQueue {
	private static instance: ResultsAddQueue | null = null;
	private q: QueueObject<object> | null = null;

	constructor() {
		this.q = queue(addResultFromYAMLFile, MAX_PROCESSES);
	}

	public static getInstance() {
		if (ResultsAddQueue.instance === null) {
			ResultsAddQueue.instance = new ResultsAddQueue();
		}
		return ResultsAddQueue.instance;
	}

	public running() {
		return this.q?.running();
	}

	public length() {
		return this.q?.length();
	}

	public drain(arg: () => void) {
		this.q?.drain(arg);
	}

	public push(arg: File) {
		this.q?.push(arg);
		console.log(
			`Pushed ${
				arg.name
			}! There are ${this.running()} workers running. The queue length is ${this.length()}.`
		);
	}

	public started() {
		return this.q?.started;
	}

	public idle() {
		return this.q?.idle();
	}
}
