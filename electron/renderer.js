const typeLoookup = {
   1: "#666666",
   9: "#ff0000",
   2: "#707070",
   10: "#4d4d4d",
   3: "#8f6143",
   8: "#637487",
   6: "#003cff",
   7: "#383027",
   4: "#493615",
   3: "#998600",
   13:"#233123",
   5: "#3D2CC5",
   16: "#631B10",
   15: "#484B55",
   17: "#2FD040",
   14: "#9DDD22"

}


const typeFill = {
   1: "#999999",
   9: "#fc2626",
   2: "#9e9e9e",
   10: "#303030",
   6: "#0091ff",
   4: "#76551D",
   13: "#25B125",
   5: "#2A1E8C",
   16: "#dc563c",
   15: "#555348",
   17: "#D02FBF",
   14: "#CCEE11"

}

const typeThick = {
   1: 2,
   9: 10,
   2: 2,
   10: 3,
   3: 2,
   8: 3,
   13: 4,
   6: 2,
   7: 16,
   13: 10,
   14: 10,
   5: 10,
   16: 30,
   15: 20,
   17: 15
}

let singlePoints = {
  13: true,
  5: true,
  14: true
}

let circles = {
  13: true,
  14: true
}

let extractTypes = {
  2: {
    text: "Southern Road",
    x: 700,
    y:-100
  },
  3: {text:"Side Tunnel",
  x: 50,
    y:0
  },
  4: {text: "Path to Shoreline",
  x: 1000,
    y:0
  },
  5: {text: "Road to Military",
  x: 1000,
    y:0
  },
  6:{text: "Industrial zone gates",
  x: -200,
    y:0
  },
  7: {text: "Hideout under the landing stage",
  x: -400,
    y:0
  },
  8: {text: "Northern Checkpoint",
  x: 1000,
    y:0
  },
  9: {text: "Scav Hideout at Grotto",
  x: 1000,
    y:0
  },
  10: {text: "South Road Landslide",
  x: 1000,
    y:0
  },
  11: {text: "Armored Train",
    x: 500,
    y:400
  },
  12: {text: "Mountain pass",
  x: 500,
    y:-50
  }
}

let offsets = {x:0, y:0};
let setUp = false;

function plotData(data){
    const {metaData, pointData}=data;
  offsetX = (-1*metaData.x.min);
  offsetY = (-1*metaData.y.min);
 
  offsets.x = offsetX;
  offsets.y = offsetY;
  const size = {x: metaData.x.max - metaData.x.min, y: metaData.y.max - metaData.y.min}; 
    let  ctx = drawChart(size);
    
     setUpHover();
    console.log("doing it!")

  console.log("loadijng")
  let numberPoints = 0;
  for(let i=0;i<pointData.length;i+=numberPoints){
    if(pointData[i].type == -1){
      throw "Should start with a starting point";
    }
    try{
      if(singlePoints[pointData[i].pointType]){
        numberPoints = drawInterest(pointData, i, ctx, offsetX, offsetY, size);
      } else {
        numberPoints = drawPiece(pointData, i, ctx, offsetX, offsetY, size);
        if(i+numberPoints <= pointData.length
         && singlePoints[pointData[i+numberPoints-1].pointType] ){
          drawInterest(pointData, i+numberPoints-1, ctx, offsetX, offsetY, size);
        } 
      }
      console.log(i+numberPoints);
    } catch (e){
      console.log(e);
    }
    drawLegend(ctx, offsetX, offsetY, size)

  }
}




function setUpHover(){
  if(!setUp){
  var canvas = document.getElementById("mycanvas");
      var ctx = canvas.getContext("2d");
      
      canvas.addEventListener("mousemove", function(e) { 
          var cRect = canvas.getBoundingClientRect();        // Gets CSS pos, and width/height
          var canvasX = e.clientX - cRect.left;  // Subtract the 'left' of the canvas 
          var canvasY = e.clientY - cRect.top;   // from the X/Y positions to make  
          let offsetsX = offsets.x?offsets.x:0;
          let offsetsY = offsets.y?offsets.y:0;
          let width = cRect.width;
          let height = cRect.height;
          document.getElementById("ypointer").innerText = "Y: "+(((width-offsetsY - canvasX)/10).toFixed(1)).toString();
          document.getElementById("xpointer").innerText = "X: "+(((height -offsetsX - canvasY)/10).toFixed(1)).toString();
          let temp = document.getElementById("mouseposition")
          temp.style.top =(e.clientY +30 )+ "px";
          temp.style.left=(e.clientX +30) + "px";
          
          
      });

      document.getElementById("mycanvas").addEventListener("click", function(e) { 
          var cRect = canvas.getBoundingClientRect();        // Gets CSS pos, and width/height
          var canvasX = e.clientX - cRect.left;  // Subtract the 'left' of the canvas 
          var canvasY = e.clientY - cRect.top;   // from the X/Y positions to make  
          let offsetsX = offsets.x?offsets.x:0;
          let offsetsY = offsets.y?offsets.y:0;
          let width = cRect.width;
          let height = cRect.height;
          
           navigator.clipboard.writeText((height -offsetsX - canvasY).toFixed(0).toString() + ","+(width-offsetsY - canvasX).toFixed(0).toString()+",0,,")
        
          
          
      });
      setUp=true;
  }
}
function drawChart(size){
 let canvas = document.getElementById("mycanvas");
  canvas.style.width  = size.y.toString()+'px';
  canvas.style.height = size.x.toString()+'px';
  canvas.height = size.x.toString();
  canvas.width = size.y.toString();
  let ctx = canvas.getContext("2d"); 

  ctx.width  = size.y;
  ctx.height = size.x; 
 ctx.clearRect(0, 0, ctx.width|| 0, ctx.height|| 0);
  return ctx;

   
}

function drawPiece(pointData, i, ctx, offsetX, offsetY, size ){
    let j = i;
    let type = pointData[j].pointType

    ctx.beginPath();
    console.log("offsetX:"+ offsetX+ " offsetY:" + offsetY )
    ctx.moveTo(size.y - (pointData[j].y + offsetY), size.x -(pointData[j].x + offsetX));
    console.log(pointData[j].x.toString()+ ", "+pointData[j].y.toString())
    j++;
    let shouldReset = false;  
  
    while(j < pointData.length && pointData[j].pointType == type ) {
      shouldReset = pointData[j].type == -1 
      ctx.lineTo(size.y - (pointData[j].y + offsetY), size.x -(pointData[j].x + offsetX))
      console.log("2->"+size.y - (pointData[j].y + offsetY), size.x -(pointData[j].x + offsetX))
      ctx.lineWidth = typeThick[pointData[j].pointType]?typeThick[pointData[j].pointType]:2;
      ctx.strokeStyle = typeLoookup[pointData[j].pointType];
      ctx.stroke();
      console.log(j)
      if(shouldReset){
        break;
      }
      
      j++;
    } 
    
    if(shouldReset){
        ctx.fillStyle = typeFill[pointData[j-1].pointType];
        ctx.fill();
        ctx.closePath();
        console.log("done")
        j++;
    } 

  ctx.closePath();

    return j-i; 
}

function drawInterest(pointData, i, ctx, offsetX, offsetY, size ){

    let j = i;
    let type = pointData[j].pointType

    
    ctx.beginPath();
    if(circles[type]){
          

      
       
      ctx.arc(size.y - (pointData[j].y + offsetY), size.x -(pointData[j].x + offsetX), 100, 0 , 2 * Math.PI);
      ctx.lineWidth = typeThick[pointData[j].pointType]?typeThick[pointData[j].pointType]:2;
      ctx.strokeStyle = typeLoookup[pointData[j].pointType];
       ctx.fillStyle = typeFill[pointData[j].pointType];
      ctx.stroke();
      ctx.fill();
      ctx.closePath();
      ctx.beginPath();
      const {text, x, y} = extractTypes[pointData[j].type];
      ctx.font = 'bold 100px serif';
      ctx.fillStyle = "#FF0000";
      ctx.fillText(text, size.y - (pointData[j].y + offsetY + x), size.x -(pointData[j].x + offsetX+y));
 
 
     
    } else  {
      ctx.rect(size.y - (pointData[j].y + offsetY), size.x -(pointData[j].x + offsetX), 20, 20);
      ctx.lineWidth = typeThick[pointData[j].pointType]?typeThick[pointData[j].pointType]:2;
      ctx.strokeStyle = typeLoookup[pointData[j].pointType];
      ctx.stroke();
      ctx.fillStyle = typeFill[pointData[j].pointType];
    }

    ctx.closePath();
    return 1; 
}


function drawLegend(ctx, offsetX, offsetY, size ){

    ctx.beginPath();
   ctx.moveTo(200,200);

        ctx.lineTo(1200, 200);
        ctx.lineWidth = 20;
        ctx.stroke();
        ctx.moveTo(189,100);
        ctx.lineTo(189,300);
        ctx.lineWidth = 21;
        ctx.stroke();
        ctx.moveTo(1211,100);
        ctx.lineTo(1211,300);
        ctx.stroke();
        ctx.font = 'bold 100px serif';
        ctx.fillText('100m', 200, 350);
        ctx.closePath();
}

window.data.mapData("data:mapData", (data) => {
  plotData(data);
}
);

window.data.getData();

