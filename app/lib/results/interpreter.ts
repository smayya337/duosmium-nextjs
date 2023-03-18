// @ts-ignore
import Interpreter from 'sciolyff/interpreter';

export function getInterpreter(source: string | object) {
	return new Interpreter(source);
}
