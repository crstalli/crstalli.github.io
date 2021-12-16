const {app, BrowserWindow, ipcMain, globalShortcut} = require('electron')
const path = require('path')
const fs = require('fs');


let pointData = [];
let metaData = {
  x: {
    max: 0,
    min: 0
  },

  y: {
    max: 0,
    min: 0
  },

  z: {
    max: 0,
    min: 0
  }
};


function writeFile() {
  try {
    fs.writeFileSync('C:/\dev/\counter/\lighthouse.txt', "");


    let str = "";
    console.log(pointData.toString());
    for (let i = 0; i < pointData.length; i++) {
      let a = pointData[i].x.toString() + "," +
        pointData[i].y.toString() + "," +
        pointData[i].z.toString() + "," +
        pointData[i].pointType.toString() + "," +
        pointData[i].type.toString() + "\n";
      console.log(a)
      fs.appendFileSync('C:/\dev/\counter/\lighthouse.txt', a);
    }


  } catch (e) {
    console.log('Failed to save the file!' + e.toString());
  }
  try {
    let b = metaData.x.max.toString() + "," +
      metaData.x.min.toString() + "," +
      metaData.y.max.toString() + "," +
      metaData.y.min.toString() + "," +
      metaData.z.max.toString() + "," +
      metaData.z.min.toString();
    fs.writeFileSync('C:/\dev/\counter/\lighthouseMeta.txt', b);
  } catch (e) {
    console.log('Failed to save the metadata file!' + e.toString());
  }

}

function readFiles() {
  let abc = fs.readFileSync('C:/\dev/\counter/\lighthouse.txt', 'UTF-8').split('\n')
  try {
    pointData = [];

    for (var i = 0; i < abc.length - 1; i++) {
      console.log(i.toString());
      let line = abc[i].split(",");
      let lineObj = {
        x: parseInt(line[0]),
        y: parseInt(line[1]),
        z: parseInt(line[2]),
        pointType: parseInt(line[3]),
        type: parseInt(line[4])
      };
      pointData.push(lineObj);

    }
    console.log("f");
  } catch (e) {
    console.log("cant read file" + e);
  }
  console.log("metadata")
  let metaFile = fs.readFileSync('C:/\dev/\counter/\lighthouseMeta.txt', 'UTF-8')
  try {
    let meta = metaFile.split(",");
    metaData.x.max = parseInt(meta[0]);
    metaData.x.min = parseInt(meta[1]);
    metaData.y.max = parseInt(meta[2]);
    metaData.y.min = parseInt(meta[3]);
    metaData.z.max = parseInt(meta[4]);
    metaData.z.min = parseInt(meta[5]);

  } catch (e) {
    console.log("Cant read metadata file" + e);
  }
}

function createWindow() {
  win = new BrowserWindow({
    width: 1920,
    height: 1080,
    // autoHideMenuBar: true,
    backgroundThrottling: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  readFiles();
  win.loadFile('index.html')

  ipcMain.handle('data:get-data', () => {
    console.log("invoke");
    win.webContents.send("data:mapData", {metaData: metaData, pointData: pointData});
    return {metaData: metaData, pointData: pointData};
  })


}

//chgange the path if you
function getLastScreenshotInfo() {
  let fileName = getLatestFile("C:/\Users/\cztl/\Documents/\Escape from Tarkov/\Screenshots")
  let fileAttrs = fileName.split("_");

  let points = fileAttrs[1].split(", ");
  console.log(points.toString());
  return {
    x: parseInt(parseFloat(points[0]) * 10),
    y: parseInt(parseFloat(points[2]) * 10),
    z: parseInt(parseFloat(points[1]) * 10)
  };

}

function getLatestFile(dirpath) {

  // Check if dirpath exist or not right here
  let latest;

  const files = fs.readdirSync(dirpath);
  files.forEach(filename => {
    // Get the stat
    const stat = fs.lstatSync(path.join(dirpath, filename));
    // Pass if it is a directory
    if (stat.isDirectory())
      return;

    // latest default to first file
    if (!latest) {
      latest = {filename, ctime: stat.ctime};
      return;
    }
    // update latest if mtime is greater than the current latest
    if (stat.ctime > latest.ctime) {
      latest.filename = filename;
      latest.ctime = stat.ctime;
    }
  });

  return latest.filename;
}

function setmetaData(ssInfo) {
  if (ssInfo.x > metaData.x.max) {
    metaData.x.max = ssInfo.x;
  }
  if (ssInfo.x < metaData.x.min) {
    metaData.x.min = ssInfo.x;
  }
  if (ssInfo.y > metaData.y.max) {
    metaData.y.max = ssInfo.y;
  }
  if (ssInfo.y < metaData.y.min) {
    metaData.y.min = ssInfo.y;
  }
  if (ssInfo.z > metaData.z.max) {
    metaData.z.max = ssInfo.z;
  }
  if (ssInfo.z < metaData.z.min) {
    metaData.z.min = ssInfo.z;
  }
}

function bindTripple(what, to) {
  //road - fill
  globalShortcut.register('CommandOrControl+' + what, () => {
    let ssInfo = getLastScreenshotInfo();
    console.log(ssInfo);
    ssInfo.pointType = to;
    ssInfo.type = 1;
    setmetaData(ssInfo)
    pointData.push(ssInfo);
    win.webContents.send("data:mapData", {metaData: metaData, pointData: pointData});
    writeFile();
  });

  //road - fill
  globalShortcut.register('alt+' + what, () => {
    let ssInfo = getLastScreenshotInfo();
    console.log(ssInfo);
    ssInfo.pointType = to;
    ssInfo.type = -1;
    setmetaData(ssInfo)
    pointData.push(ssInfo);
    win.webContents.send("data:mapData", {metaData: metaData, pointData: pointData});
    writeFile();
  });
//road -2
  globalShortcut.register(what, () => {
    let ssInfo = getLastScreenshotInfo();
    console.log(ssInfo);
    ssInfo.pointType = to;
    ssInfo.type = 0;
    setmetaData(ssInfo)
    pointData.push(ssInfo);
    win.webContents.send("data:mapData", {metaData: metaData, pointData: pointData});
    writeFile();
  });

}

function bindSingle(what, to) {
//road -2
  globalShortcut.register(what, () => {
    let ssInfo = getLastScreenshotInfo();
    console.log(ssInfo);
    ssInfo.pointType = to;
    ssInfo.type = 0;
    setmetaData(ssInfo)
    pointData.push(ssInfo);
    win.webContents.send("data:mapData", {metaData: metaData, pointData: pointData});
    writeFile();
  });

}

// last - 1135,-9415,61,13,0
// numsub - map edge - 1,
// nummult - road - 2
// numdiv  - wall-small -3
// numadd - building -4
// num4 - guardhouse -5
// num2 - water - 6
// num9 road-small -7
// num8 - walllarge -8
// num7 - mines - 9
// num6 rocks -10
// num 5 - large elevation change - 11
// num1 - pmc extract. - 13
//ctrl+num1 - scav extract - 14
// num0 - spawn - 12

app.whenReady().then(() => {
  //map edge -1
  bindSingle('numsub', 1);


//num1 - extract -13
  bindSingle('num1', 13);


//mines-9
  bindSingle('num7', 9);

//small road - 7
  bindSingle('num9', 7);

  //wall-large -8
  bindSingle('num8', 8);

  //wall-small -3
  bindSingle('numdiv', 3);

  //road - fill
  bindTripple('nummult', 2);


  //building-numadd -4
  bindTripple('numadd', 4);


//guard tower
  bindSingle('num4', 5);


  //num6 rocks -10
  bindTripple('num6', 10);

  // num1: 14 - scav extract
  bindSingle('CommandOrControl+num1', 14);


// num2: 6 - water

  bindTripple('num2', 6);


  bindSingle('num5', 11);

  //platfoprm 
  bindTripple("Up", 15);
  //Train
  bindTripple("Right", 16);
  //conex stack
  bindTripple("Left", 17)


  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
});


app.on('window-all-closed', () => {

  if (process.platform !== 'darwin') {
    app.quit()
  }
})


