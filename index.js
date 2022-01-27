console.log("index.js");

const ECGDrawElementClass = require('./ECGDrawElement.js').ECGDrawElement;
//import ECGDrawElementClass from './ECGDrawElement.js';
const ECGDrawElementCtrlClass = require('./ECGDrawElementCtrl.js').ECGDrawElementCtrl;



//const { interval ,range, filter, map, take } = require('rxjs')

/*let DrawECGWindow1 = new ECGDrawElementClass('WindowsForECG','ECGGrid','ECG',1000,Test);

DrawECGWindow1.DrawGrid(5,'#999999',1);
DrawECGWindow1.DrawECG('#00c100',1);


function Test(id){
    console.log("CallBack",id);
}*/



var elementInfoArr=[]
var elementInfoObj={}
var elementInfoObj1={}



elementInfoObj.MainWin = 'ID_ECGMainWindows';
elementInfoArr.push(elementInfoObj);

elementInfoObj1.MainWin = 'ID_ECGMainWindows1';
elementInfoArr.push(elementInfoObj1);

var IntervalID;

var dataSource= '-12 -13 -14 -17 -17 -15 -12 -12 -13 -14 -12 -12 -10 -10 -12 -13 -15 -17 -16 -16 -14 -13 -14 -16 -18 -16 -17 -18 -17 -16 -15 -14 -14 -13 -12 -15 -14 -15 -17 -20 -21 -18 -16 -16 -11 -9 -10 -10 -12 -13 -15 -16 -14 -15 -17 -16 -17 -15 -15 -14 -13 -15 -12 -10 -14 -14 -14 -14 -12 -13 -15 -15 -16 -16 -17 -16 -13 -13 -14 -13 -14 -14 -14 -15 -15 -15 -17 -18 -17 -15 -12 -13 -15 -17 -16 -17 -16 -13 -17 -17 -15 -18 -16 -17 -20 -17 -18 -19 -15 -13 -14 -16 -17 -16 -16 -15 -14 -16 -15 -16 -19 -18 -17 -15 -15 -19 -20 -17 -17 -18 -17 -16 -17 -14 -10 -14 -15 -11 -12 -12 -12 -14 -13 -13 -13 -11 -11 -10 -9 -9 -8 -10 -11 -13 -13 -9 -10 -10 -5 -5 -7 -6 -5 -4 -4 -4 1 1 -3 -6 -10 -14 -14 -14 -12 -15 -17 -18 -20 -22 -21 -19 -18 -20 -20 -19 -22 -22 -23 -25 -24 -22 -22 -23 -27 -25 -26 -24 -23 -25 -24 -21 -18 -18 -19 -21 -22 -24 -25 -24 -24 -23 -23 -23 -21 -17 -15 -16 -16 -11 -9 -1 10 21 29 40 51 66 85 99 99 99 102 90 71 52 28 9 -17 -46 -60 -60 -58 -55 -48 -42 -38 -35 -31 -31 -28 -26 -24 -22 -22 -22 -17 -17 -21 -21 -21 -20 -19 -20 -19 -18 -16 -16 -16 -17 -17 -17 -14 -14 -15 -15 -15 -14 -14 -16 -17 -15 -11 -9 -11 -11 -11 -13 -10 -13 -12 -10 -12 -13 -10 -8 -5 -4 -4 -8 -9 -8 -7 -9 -9 -10 -8 -4 -2 -2 -1 -2 -4 -4 -5 -5 -5 -4 -1 -2 0 -3 -4 -3 -1 2 1 -1 1 4 6 5 5 6 4 4 6 7 6 9 8 10 11 11 13 14 13 15 15 18 20 23 23 22 22 24 23 23 24 28 34 36 36 36 36 39 38 38 41 43 43 43 44 46 47 51 50 47 49 49 50 50 47 49 53 51 50 48 49 48 43 40 37 33 31 27 23 21 19 18 13 7 6 3 0 1 5 4 -1 -5 -6 -6 -6 -6 -7 -10 -11 -12 -12 -14 -12 -9 -10 -11 -11 -11 -11 -13 -14 -15 -18 -14 -10 -11 -12 -15 -16 -16 -18 -18 -19 -19 -14 -13 -13 -11 -11 -14 -14 -13 -12 -12 -13 -13 -13 -15 -15 -15 -14 -14 -14 -15 -17 -16 -16 -17 -15 -15 -15 -15 -15 -15 -16 -18 -13 -11 -13 -13 -14 -13 -11 -9 -10 -14 -14 -14 -14 -13 -12 -12 -9 -12 -11 -9 -10 -12 -13 -13 -12 -12 -14 -14 -16 -14 -11 -12 -12 -14 -14 -16 -17 -16 -16 -17 -16 -15 -13 -10 -10 -11 -11 -11 -13 -16 -15 -16 -16 -14 -12 -10 -12 -15 -12 -12 -16 -17 -18 -16 -16 -17 -19 -21 -19 -16 -13 -11 -12 -15 -14 -14 -15 -15 -16 -17 -19 -20 -17 -16';
var ECGDataList = [];
var ECGDataListIndex = 0;
var arr = dataSource.split(' ');

var ECGBUF=0;

for (let i = 0, buf; i < 5000; i++) {
    buf = i % arr.length;
    ECGDataList.push(arr[buf]*1);
}



let DrawECGWindowCtrler = new ECGDrawElementCtrlClass(elementInfoArr,'#999999',1,'#00c100',2);




var ElementIdList =  DrawECGWindowCtrler.GetElementIDList()

for(var run=0;run<15000;run++){
    for(var i = 0 ;i<this.ElementIdList.length;i++){
      DrawECGWindowCtrler.SetECGData(ElementIdList[i],ECGBUF);
    }
    ECGDataListIndex =(ECGDataListIndex+1) % ECGDataList.length;
    if(ECGDataListIndex % 1000 ===0){
      ECGBUF=0.1;
    }
    if(ECGDataListIndex % 2000 ===0){
      ECGBUF=0.2;
    }
    if(ECGDataListIndex % 3000 ===0){
      ECGBUF=0.3;
    }
    if(ECGDataListIndex % 4000 ===0){
      ECGBUF=0.4;
    }
    if(ECGDataListIndex % 5000 ===0){
      ECGBUF=0;
    }
}


// DrawECGWindowCtrler.SetDrawMode(null,ECGDrawElementCtrlClass.ObjElementMode.Dynamic_DrawingECG);
TestFunction = ()=>{
  try{
      if(ElementIdList.length>0){
          for(var run=0;run<5;run++){
              for(var i = 0 ;i<ElementIdList.length;i++){
                DrawECGWindowCtrler.SetECGData(ElementIdList[i],ECGBUF);
                
              }
              ECGDataListIndex =(ECGDataListIndex+1) % ECGDataList.length;
              if(ECGDataListIndex % 1000 ===0){
                ECGBUF=0.1;
              }
              if(ECGDataListIndex % 2000 ===0){
                ECGBUF=0.2;
              }
              if(ECGDataListIndex % 3000 ===0){
                ECGBUF=0.3;
              }
              if(ECGDataListIndex % 4000 ===0){
                ECGBUF=0.4;
              }
              if(ECGDataListIndex % 5000 ===0){
                ECGBUF=0;
              }
          }
      }
  }catch(err){
      console.log(err);
  }
}

if(ElementIdList.length>0){
    console.log('Start')
    // IntervalID = setInterval(TestFunction, 10); 
}

DrawECGWindowCtrler.StartDrawECG();




