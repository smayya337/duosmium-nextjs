// @ts-ignore
import Interpreter from 'sciolyff/interpreter';

export function getInterpreter(source: any) {
	return new Interpreter(source);
}
