const electron = require("electron");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;

app.on("ready", () => {
	// console.log("App is now ready"); // will print in the terminal
	mainWindow = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: true,
			preload: path.join(__dirname, "preload.js"),
		},
	});
	mainWindow.loadURL(`file://${__dirname}/index.html`);
});

ipcMain.on("video:submit", (event, path) => {
	console.log("path: ", path);
	ffmpeg.ffprobe(path, (err, metadata) => {
		// console.log("Video duration is: ", metadata.format.duration);
		mainWindow.webContents.send("video:metadata", metadata.format.duration);
	});
});
