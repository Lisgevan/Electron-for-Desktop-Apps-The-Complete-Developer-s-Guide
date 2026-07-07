const electron = require("electron");
const { app, Tray, Menu } = electron;

class TimerTray extends Tray {
	constructor(iconPath, mainWindow) {
		super(iconPath);

		this.mainWindow = mainWindow;

		this.setToolTip("Timer App");
		this.on("click", this.onClick);
		this.on("right-click", this.onRightClick);
	}

	onClick = (events, bounds) => {
		// click event bounds
		const { x, y } = bounds;

		// Window width and height
		const { height, width } = this.mainWindow.getBounds();

		// Windows positioning
		const yPosition = Math.floor(process.platform === "darwin" ? y : y - height);
		const xPosition = Math.floor(x - width / 2);

		if (this.mainWindow.isVisible()) {
			this.mainWindow.hide();
		} else {
			this.mainWindow.setBounds({
				// OSX positioning
				x: xPosition,
				y: yPosition,
				height,
				width,
			});
			this.mainWindow.show();
		}
	};

	onRightClick = () => {
		const menuConfig = Menu.buildFromTemplate([
			{
				label: "Quit",
				click: () => app.quit(),
			},
		]);

		this.popUpContextMenu(menuConfig);
	};
}

module.exports = TimerTray;
