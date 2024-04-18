export function pad(n: string, width: number, padding: string = "0") {
	n = "" + n;
	return n.length >= width ? n : new Array(width - n.length + 1).join(padding) + n;
}
