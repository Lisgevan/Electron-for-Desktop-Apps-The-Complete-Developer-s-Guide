const electron = require("electron");
const ffmpeg = require("fluent-ffmpeg");
const _ = require("lodash");

const { app, BrowserWindow, ipcMain, shell } = electron;

let mainWindow;

app.on("ready", () => {
	mainWindow = new BrowserWindow({
		height: 600,
		width: 800,
		webPreferences: {
			backgroundThrottling: false,
			nodeIntegration: true,
			contextIsolation: false,
		},
	});
	mainWindow.loadURL(`file://${__dirname}/src/index.html`);
});

ipcMain.on("videos:added", (event, videos) => {
	// console.log(videos);
	// // when working with single video
	// ffmpeg.ffprobe(videos[0].path, (error, metadata) => {
	// 	console.log(metadata);
	// });

	// when working with multiple video

	const promises = _.map(videos, video => {
		return new Promise((resolve, regect) => {
			ffmpeg.ffprobe(videos[0].path, (error, metadata) => {
				((video.duration = metadata.format.duration), (video.format = "avi"));
				// console.log(metadata.format.duration, video.duration);
				resolve(video);
			});
		});
	});

	Promise.all(promises).then(results => {
		mainWindow.webContents.send("metadata:complete", results);
	});
});

ipcMain.on("conversion:start", (event, videos) => {
	_.each(videos, video => {
		const outputDirectory = video.path.split(video.name)[0];
		const outputName = video.name.split(".")[0];
		const outputPath = `${outputDirectory}${outputName}.${video.format}`;

		ffmpeg(video.path)
			.output(outputPath)
			.on("progress", ({ timemark }) => mainWindow.webContents.send("conversion:progress", { video, timemark }))
			.on("end", () => mainWindow.webContents.send("conversion:end", { video, outputPath }))
			.run();
	});
});
ipcMain.on("folder:open", (event, outputPath) => {
	shell.showItemInFolder(outputPath);
});
