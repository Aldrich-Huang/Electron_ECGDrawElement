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



let DrawECGWindowCtrler = new ECGDrawElementCtrlClass(elementInfoArr,'#999999',1,'#00c100',2);


/*
  const count1To10$ =interval(1000).pipe(
    take(10),
    map(c => DrawECGWindowCtrler.SetECGTest(100))
  ).subscribe(c => console.log(c));
  */

  

//let DrawECGWindowCtrler = new ECGDrawElementCtrlClass(elementInfoArr,'#999999',1,'#00c100',1);

//DrawECGWindowCtrler.SetGeidParameter(20,'#999999',5,'WindowsForECG2');
