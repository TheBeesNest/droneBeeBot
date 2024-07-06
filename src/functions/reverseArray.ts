export function PopFirst(array: any[]): any[] {
	const reversedArray = array.reverse();
	const reducedArray = reversedArray.pop();
	return reducedArray.reverse();
}
