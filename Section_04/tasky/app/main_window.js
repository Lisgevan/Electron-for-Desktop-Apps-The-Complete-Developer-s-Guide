const electron = require("electron");
const { app, BrowserWindow } = electron;

class MainWindow extends BrowserWindow {
	constructor(url) {
		super({
			width: 300,
			height: 600,
			frame: true,
			resizable: true,
			show: false,
			skipTaskbar: true,
			webPreferences: {
				nodeIntegration: true,
				contextIsolation: false,
				backgroundThrottling: false,
			},
		});

		this.loadURL(url);
		this.on("blur", this.onBlur);
	}

	onBlur = () => {
		this.hide();
	};
}

module.exports = MainWindow;
