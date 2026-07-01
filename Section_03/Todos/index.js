// const electron = require("electron");
// const { app, BrowserWindow, Menu, ipcMain } = electron;

// let mainWindow;
// let addWindow;

// app.on("ready", () => {
// 	// console.log("App is now ready"); // will print in the terminal
// 	mainWindow = new BrowserWindow({
// 		webPreferences: {
// 			nodeIntegration: true,
// 			contextIsolation: false,
// 		},
// 	});
// 	mainWindow.loadURL(`file://${__dirname}/main.html`);
// 	mainWindow.on("closed", () => {
// 		app.quit();
// 	});

// 	const mainMenu = Menu.buildFromTemplate(menuTemplate);
// 	Menu.setApplicationMenu(mainMenu);
// });

// const createAddWindow = () => {
// 	addWindow = new BrowserWindow({
// 		width: 300,
// 		height: 200,
// 		title: "Add New Todo",
// 		webPreferences: {
// 			nodeIntegration: true,
// 			contextIsolation: false,
// 		},
// 	});
// 	addWindow.loadURL(`file://${__dirname}/add.html`);
// 	addWindow.on("closed", () => (addWindow = null));
// };

// const deleteAllTodos = () => {
// 	mainWindow.webContents.send("todo:clear");
// };

// ipcMain.on("todo:add", (event, todo) => {
// 	mainWindow.webContents.send("todo:add", todo);
// 	addWindow.close();
// });

// const menuTemplate = [
// 	{
// 		label: "File",
// 		submenu: [
// 			{
// 				label: "New Todo",
// 				click() {
// 					createAddWindow();
// 				},
// 			},
// 			{
// 				label: "Clear Todos",
// 				click() {
// 					deleteAllTodos();
// 				},
// 			},
// 			{
// 				label: "Quit",
// 				accelerator: process.platform === "darwin" ? "Command+Q" : "Alt+F6",
// 				// accelerator: (() => {
// 				// 	if (process.platform === "darwin") return "Command+Q";
// 				// 	else return "Ctrl+Q";
// 				// })(),
// 				click() {
// 					app.quit();
// 				},
// 			},
// 		],
// 	},
// ];

// if (process.platform === "darwin") {
// 	menuTemplate.unshift({ label: "" });
// }

// if (process.env.NODE_ENV !== "production") {
// 	// production, development, staging, test
// 	menuTemplate.push({
// 		label: "View",
// 		submenu: [
// 			{
// 				role: "reload",
// 			},
// 			{
// 				label: "Toggle Developer Tools",
// 				accelerator: process.platform === "darwin" ? "Command+Alt+I" : "F12",
// 				click(item, focusedWindow) {
// 					focusedWindow.toggleDevTools();
// 				},
// 			},
// 		],
// 	});
// }

// FOR BEST PRACTICES
const { app, BrowserWindow, Menu, ipcMain } = require("electron");

let mainWindow;
let addWindow;

app.on("ready", () => {
	mainWindow = new BrowserWindow({
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			preload: `${__dirname}/preload.js`,
		},
	});

	mainWindow.loadURL(`file://${__dirname}/main.html`);
	mainWindow.on("closed", () => app.quit());

	const mainMenu = Menu.buildFromTemplate(menuTemplate);
	Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
	addWindow = new BrowserWindow({
		width: 300,
		height: 200,
		title: "Add New Todo",
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			preload: `${__dirname}/preload.js`,
		},
	});

	addWindow.loadURL(`file://${__dirname}/add.html`);
	addWindow.on("closed", () => (addWindow = null));
}

ipcMain.on("todo:add", (event, todo) => {
	mainWindow.webContents.send("todo:add", todo);
	addWindow.close();
});

const menuTemplate = [
	{
		label: "File",
		submenu: [
			{
				label: "New Todo",
				click() {
					createAddWindow();
				},
			},
			{
				label: "Clear Todos",
				click() {
					mainWindow.webContents.send("todo:clear");
				},
			},
			{
				label: "Quit",
				accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl+Q",
				click() {
					app.quit();
				},
			},
		],
	},
];

if (process.platform === "darwin") {
	menuTemplate.unshift({ label: "" });
}

if (process.env.NODE_ENV !== "production") {
	menuTemplate.push({
		label: "View",
		submenu: [
			{ role: "reload" },
			{
				label: "Toggle Developer Tools",
				accelerator: process.platform === "darwin" ? "Command+Alt+I" : "Ctrl+Shift+I",
				click(item, focusedWindow) {
					focusedWindow.toggleDevTools();
				},
			},
		],
	});
}
