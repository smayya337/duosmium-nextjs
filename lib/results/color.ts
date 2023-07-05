import {
	colorOrder,
	colors,
	darkColorOrder,
	defaultColor,
	getColor,
	getFullName,
	getNumber
} from '@/lib/colors/tailwind';
import { supabase } from '@/lib/global/supabase';
import { getResult, resultExists } from '@/lib/results/async';
import { findLogoPath } from '@/lib/results/logo';
// @ts-ignore
import { ContrastChecker } from 'color-contrast-calc';
import Vibrant from 'node-vibrant';

export async function findBgColor(duosmiumID: string) {
	if (await resultExists(duosmiumID)) {
		const dbEntry = (await getResult(duosmiumID)).color;
		if (dbEntry) {
			return dbEntry;
		}
	}
	return await createBgColor(duosmiumID);
}

export async function createBgColor(duosmiumID: string) {
	const logo = await findLogoPath(duosmiumID);
	return await createBgColorFromImagePath(logo);
}

export async function createBgColorFromImagePath(imagePath: string, dark = false) {
	const logoData = (
		await supabase.storage.from('images').download(imagePath.replace('/images/', ''))
	).data;
	let output: string = defaultColor;
	if (logoData) {
		// @ts-ignore
		const arrayBuffer = await logoData.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const builder = Vibrant.from(buffer);
		const extracted = await builder.getPalette();
		let possibleColors;
		if (dark) {
			possibleColors = [
				extracted.LightMuted,
				extracted.Muted,
				extracted.DarkMuted,
				extracted.LightVibrant,
				extracted.Vibrant,
				extracted.DarkVibrant
			].filter((color) => color != null);
		} else {
			possibleColors = [
				extracted.DarkVibrant,
				extracted.Vibrant,
				extracted.LightVibrant,
				extracted.DarkMuted,
				extracted.Muted,
				extracted.LightMuted
			].filter((color) => color != null);
		}
		if (possibleColors.length > 0) {
			let nearest = require('nearest-color').from(colors);
			// @ts-ignore
			output = nearest(possibleColors[0].hex).name;
			let order;
			let base;
			if (dark) {
				order = darkColorOrder;
				base = '#000000';
			} else {
				order = colorOrder;
				base = '#ffffff';
			}
			let currentNumber = getNumber(output);
			let currentColor = getColor(output);
			for (let i = 0; i < order.length; i++) {
				if (i < order.indexOf(currentNumber)) {
					continue;
				}
				currentNumber = order[i];
				const colorName = getFullName(currentColor, currentNumber);
				// @ts-ignore
				if (ContrastChecker.contrastRatio(base, colors[colorName]) >= 5.5) {
					break;
				}
			}
			output = getFullName(currentColor, currentNumber);
		}
	}
	return output;
}
