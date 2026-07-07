const electron = require("electron");
const path = require("path");
const { app, ipcMain } = electron;

const TimerTray = require("./app/timer_tray");
const MainWindow = require("./app/main_window");

let mainWindow;
let tray;

app.on("ready", () => {
	mainWindow = new MainWindow(`file://${__dirname}/src/index.html`);

	// hide app from the bar
	if (process.platform === "darwin") {
		app.dock.hide();
	} else {
		mainWindow.setSkipTaskbar(true);
	}
	//

	const iconName = process.platform === "win32" ? "windows-icon.png" : "iconTemplate.png";
	const iconPath = path.join(__dirname, `./src/assets/${iconName}`);
	tray = new TimerTray(iconPath, mainWindow);
});

ipcMain.on("update-timer", (event, timeLeft) => {
	process.platform === "darwin" ? tray.setTitle(timeLeft) : tray.setToolTip(timeLeft);
});
