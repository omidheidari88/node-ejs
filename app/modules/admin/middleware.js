const sprintf = require('sprintf');
const multer = require('multer');
const mkdirp = require('mkdirp');
const fs = require('fs');
const Path = require('path');
const sharp = require('sharp');
let getDir = () => {
	let year = new Date().getFullYear();

	return `./public/assets/uploads/${year}`;
};
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		let dir = getDir();
		mkdirp(dir).then(() => cb(null, dir));
	},
	filename: (req, file, cb) => {
		let dir = getDir();
		if (!fs.existsSync(dir)) {
			cb(null, file.originalname);
		} else {
			cb(null, 'img-' + file.originalname);
		}
	},
});
//limit 5 megabyte
exports.upload = multer({storage, limits: {fileSize: 1024 * 1024 * 5}});

exports.fileToField = (req, res, next) => {
	if (!req.file) {
		req.body.images = undefined;
	} else {
		let imageObj = {};
		const path = req.file.path;
		const imagePath = Path.parse(path);
		imageObj['original'] = `${req.file.destination.substring(8)}/${req.file.filename}`;
		const sizes = [1080, 720, 480];
		sizes.map((size) => {
			const imageName = `${imagePath.name}-${size}${imagePath.ext}`;
			imageObj[size] = `${req.file.destination.substring(8)}/${imagePath.name}-${size}${imagePath.ext}`;
			sharp(path).resize(size, null).toFile(`${req.file.destination}/${imageName}`);
		});
		//baraye hazfe /public/ ya az in raveshe split ya az substring mishe estefade kard
		// const spliting = path.split('/');
		// const slicinng = spliting.slice(1, 10);
		// const removePublic = slicinng.join('/');
		// req.file.path = removePublic;
		// req.file.path = path.substring(7);
		// req.body.images = req.file.path;

		req.body.images = JSON.stringify(imageObj);
	}

	next();
};

exports.updateTime = async (courses) => {
	let second = 0;
	courses.forEach((course) => {
		const time = course.time.split(':');
		second += parseInt(time[0]) * 3600;
		second += parseInt(time[1]) * 60;
		second += parseInt(time[2]);
	});
	let hour = Math.floor(second / 3600);
	let minute = Math.floor((second / 60) % 60);
	second = Math.floor(second % 60);
	return sprintf('%02d:%02d:%02d', hour, minute, second).toString();
};
