import { promisify } from 'util';
import { readFile as fsReadFile, writeFile as fsWriteFile, unlink as fsUnlink } from 'fs';
import path from 'path';
import GLTF from './gltf';
const [readFile, writeFile, unlinkFile] = [promisify(fsReadFile), promisify(fsWriteFile), promisify(fsUnlink)];

async function convertToDataUrl(filename: string): Promise<string> {
	const data = await readFile(filename);
	return 'data:application/octet-stream;base64,' + data.toString('base64');
}

async function postprocessTable(filename: string) {
	// read JSON
	const gltfFile = path.resolve(process.cwd(), filename);
	const strData = await readFile(gltfFile, { encoding: 'utf8' });
	const gltf = JSON.parse(strData) as GLTF.GlTf;

	// rewrite image references
	const imgReference = gltf.images[0];
	gltf.images = [
		{
			...imgReference,
			name: 'BoardSmall',
			uri: path.relative(
				path.dirname(gltfFile),
				path.resolve(__dirname, '../../public/img/caesar/board-small.jpg'))
				.replace(/\\/g, '/')
		}, {
			...imgReference,
			name: 'BoardMedium',
			uri: path.relative(
				path.dirname(gltfFile),
				path.resolve(__dirname, '../../public/img/caesar/board-medium.jpg'))
				.replace(/\\/g, '/')
		}, {
			...imgReference,
			name: 'BoardLarge',
			uri: path.relative(
				path.dirname(gltfFile),
				path.resolve(__dirname, '../../public/img/caesar/board-large.jpg'))
				.replace(/\\/g, '/')
		}
	];

	// rewrite texture references
	gltf.textures = gltf.images.map((img, i) => ({ name: img.name, source: i } as GLTF.Texture));

	// pack binary data
	const binFile = path.resolve(path.dirname(gltfFile), gltf.buffers[0].uri)
	gltf.buffers[0].uri = await convertToDataUrl(binFile);
	await unlinkFile(binFile);

	// output result
	await writeFile(gltfFile, JSON.stringify(gltf));
}

async function main(args: string[]) {
	switch (args[2]) {
		case 'postprocess-table':
		case 'ppt':
			await postprocessTable(args[3]);
			break;
		default:
			console.log(
				`Do some processing on a glTF file.
Syntax: gltftool <command> <argument>
commands:
postprocess-table (ppt) - Takes a glTF file as argument that was freshly
                          exported from table.blend, adds the other board
                          textures to it, removes unused objects,
                          packs the binary data, and strips whitespace.`
			);
			break;
	}
}

main(process.argv).catch(ex => {
	console.error(ex);
	process.exit(1);
});
