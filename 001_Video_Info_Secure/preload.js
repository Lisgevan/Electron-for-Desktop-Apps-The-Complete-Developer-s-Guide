const { ipcRenderer, contextBridge, webUtils } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  getPathForFile: (file) => {
    return webUtils.getPathForFile(file);
  },
  submitVideo: (filePath) => {
    ipcRenderer.send("video:submit", filePath);
  },
  receiveVideoMetadata: (onMetadataReceived) => {
    ipcRenderer.on("video:metadata", (event, duration) => {
      onMetadataReceived(duration);
    });
  },
});
