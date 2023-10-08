import type { QueueObject } from 'async';
import { queue } from 'async';
import { addResultFromYAMLFile } from './async';

const MAX_PROCESSES = 64;

export class ResultsAddQueue {
	private static instance: ResultsAddQueue;
	private q: QueueObject<object>;

	constructor() {
		this.q = queue(addResultFromYAMLFile, MAX_PROCESSES);
	}

	public static getInstance() {
		if (!ResultsAddQueue.instance) {
			ResultsAddQueue.instance = new ResultsAddQueue();
		}
		return ResultsAddQueue.instance;
	}

	public running() {
		return this.q.running();
	}

	public length() {
		return this.q.length();
	}

	public drain(arg: () => void) {
		this.q.drain(arg);
	}

	public error(arg: (err: any, task: any) => void) {
		this.q.error(arg);
	}

	public push(arg: File) {
		this.q.push(arg);
		console.log(
			`Pushed ${
				arg.name
			}! There are ${this.running()} workers running. The queue length is ${this.length()}.`
		);
	}

	public started() {
		return this.q.started;
	}

	public idle() {
		return this.q.idle();
	}
}
