const { readFile, writeFile } = require('fs');
const { resolve } = require('path');

function convertToDataUrl(filename)
{
	readFile(resolve(process.cwd(), filename), (err, data) => {
		if (err) {
			console.log(err);
			return;
		}

		writeFile( resolve(process.cwd(), filename+'.txt'), 'data:application/octet-stream;base64,' + data.toString('base64'), (err) => {
			if(err) {
				console.error(err);
			}
		} );
	});
}

convertToDataUrl(process.argv[2]);
