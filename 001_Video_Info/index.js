const electron = require("electron");
const ffmpeg = require("fluent-ffmpeg");

const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;

app.on("ready", () => {
	// console.log("App is now ready");
	mainWindow = new BrowserWindow({
		webPreferences: { nodeIntegration: true, contextIsolation: false },
	});
	mainWindow.loadURL(`file://${__dirname}/index.html`);
});

ipcMain.on("video:submit", (event, path) => {
	console.log(path);
	ffmpeg.ffprobe(path, (err, metadata) => {
		console.log("Video duration is: " + metadata.format.duration);
		mainWindow.webContents.send("video:metadata", metadata.format.duration);
	});
});
