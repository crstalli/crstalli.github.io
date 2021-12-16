var http = require('http');
var fs = require('fs');
const path = require('path')
const express = require('express')
const app = express()
const port = 8080


app.get('/', (req, res) => {
  fs.readFile('index.html', function (err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
})

app.get('/data', (req, res) => {

  res.send(JSON.stringify(readFiles()));
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

function readFiles() {
  let abc = fs.readFileSync('../lighthouse.txt', 'UTF-8').split('\n')
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

  let metaData = {x: {}, y: {}, z: {}}
  let metaFile = fs.readFileSync('../lighthouseMeta.txt', 'UTF-8')
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
  return {metaData: metaData, pointData: pointData}
}

