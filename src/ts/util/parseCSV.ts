export default function parseCSV(csv: string) {
	if (csv) {
		return csv.split(',');
	} else {
		return [];
	}
}