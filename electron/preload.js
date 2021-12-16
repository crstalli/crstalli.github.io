const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('data', {
  mapData:  (channel, func) => {
            let validChannels = ["data:mapData"];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        },
  getData: () => ipcRenderer.invoke('data:get-data'),
  receiveData: (channel, func) => {
            let validChannels = ["data:sendData"];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        },
  receiveSubs: (channel, func) => {
            let validChannels = ["data:receiveSubs"];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        },
   toggleQuests: (channel, func) => {
            let validChannels = ["data:toggleQuests"];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        },
           cycleQuests: (channel, func) => {
            let validChannels = ["data:cycleQuests"];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        }
})




