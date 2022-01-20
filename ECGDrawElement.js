/*-----------------------------------------------------------------------------------------------------
    *File Name: ECGDrawElement.js
    *Author:    BriteMED Ken Huang.
    *Date:      2022.01.13
    *explanation:
        -public function:
            ->  SetGridMode
            ->  SetDrawGridPara
            ->  SetGridSize
            ->  GetGridSize
            ->
            ->
            ->
            ->

-------------------------------------------------------------------------------------------------------*/

const ECGDataRegisterClass = require('./ECGDataRegister.js').ECGDataRegister;

const ECGGridCanvasElementClass = require('./ECGGridCanvasElement.js').ECGGridCanvasElement;

const ECGCanvasElementClass = require('./ECGCanvasElement.js').ECGCanvasElement;

class ECGDrawElement{
    static CallBackFuncID = {'WindowResize': 0, 'ECGElementMouseMove':1,'ECGElementMouseDown':2,'ECGElementMouseUp':3}
    static ObjGridMode = {'FixedGridSize':10,'FixedGridQuantity_W':11, 'FixedGridQuantity_H':12}

    Clicked = false;
    WinWidth = 200;
    WinHeight = 200;
    //WinSize = {'Width':200, 'Height':200};
    ShowPos = {'x':0, 'y':0};
    PastEvent = {'x':0, 'y':0};

    
    #CallBackFunList;

    //Obj Element Ctrl
    #ObjGridElement
    #oECGGridCanvasElement

    constructor(MainWinId) {

        var winelementid = MainWinId + "_Show";
        var gridelementid = MainWinId + "_CanvasGrid";
        var ecgelementid = MainWinId + "_CanvasECG";

        this.#CallBackFunList = new Array(Object.keys(ECGDrawElement.CallBackFuncID).length);

        this.MainWinElement = document.getElementById(MainWinId);
        this.MainWinElement.innerHTML ='<div class="ECGMainWindows_Shower">'+
        '<canvas id="'+gridelementid+'" class="CanvasShowGrid"></canvas>'+
        '<div id="ID_ShowECGWindow_Outer" class="ShowECGWindow-outer">'+
            '<div id="'+winelementid+'" class="ShowECGWindow-inner">'+
            '<div class="ShowECGWindow-Shower"><canvas id="'+ecgelementid+'"></canvas></div>'+
        '</div></div></div>';


        //Get Windows size.
        this.WinId = winelementid;
        this.WinElement = document.getElementById(winelementid);

        this.WinWidth = this.WinElement.offsetWidth; 
        this.WinHeight = this.WinElement.offsetHeight;
        
        //Build draw ECG grid class
        this.#ObjGridElement = new ECGGridCanvasElementClass(gridelementid);
        this.#ObjGridElement.SetCanvasSize(this.WinWidth, this.WinHeight);


        //Build draw ECG class
        this.#oECGGridCanvasElement = new ECGCanvasElementClass(ecgelementid);
        this.#oECGGridCanvasElement.SetCanvasSize(this.WinWidth, this.WinHeight);
        this.#oECGGridCanvasElement.AddEventCallBack(ECGCanvasElementClass.CallBackFuncID.ECGElementMouseMove, this.#ECGElementMouseMove);
        this.#oECGGridCanvasElement.AddEventCallBack(ECGCanvasElementClass.CallBackFuncID.ECGElementMouseDown, this.#ECGElementMouseDown);


        window.addEventListener('resize', this.#WinElementResize);
        //-----------------------------------
        //set all element mouseup event.
        //-----------------------------------
        this.elementsArray = document.querySelectorAll("*");
        for(var i = 0 ;i<this.elementsArray.length;i++){
            this.elementsArray[i].addEventListener("mouseup", this.#ECGElementMouseUp);
        }
        
    }

    SetGridMode = (gridmode, value)=>{
        return this.#ObjGridElement.SetGridMode(gridmode, value);
    }

    SetDrawGridPara = (linecolor, linewidth)=>{
        this.#ObjGridElement.SetDrawLinePara(linecolor, linewidth);
    }

    DrawGrid = ()=>{
        this.#ObjGridElement.Draw();
    }

    ClearGrid=()=>{
        this.#ObjGridElement.ClearView();
    }

    //--------------------------------------------

    SetDrawECGPara = (ECGLineColor, ECGLineWidth)=>{
        this.#oECGGridCanvasElement.SetDrawLinePara(ECGLineColor,ECGLineWidth);
    }


    SetECGShowSec = (sec)=>{
        // if(sec>5){
        //     this.#Canvas_ECGInfo.GridShowSec=sec;
        //     this.ECGElement.width  = (this.#Canvas_GridInfo.smGridSize * 5 * 2) * this.#Canvas_ECGInfo.GridShowSec;
        // }else{
        //     this.ECGElement.width  = this.WinWidth;
        //     this.#Canvas_ECGInfo.GridShowSec=-1;
        // }

    }

    ClearECG=()=>{
        this.#oECGGridCanvasElement.ClearView();
    }

    GetWinPosition=()=>{
        var PositionInfo={};
        PositionInfo.x = this.ShowPos.x;
        PositionInfo.y = this.ShowPos.y;

        PositionInfo.pastx = this.PastEvent.x;
        PositionInfo.pasty = this.PastEvent.y;

        return PositionInfo;
    }

    SetWinPosition=(PositionInfoInfo)=>{

        this.ShowPos.x =PositionInfoInfo.x;
        this.ShowPos.y = PositionInfoInfo.y;

        this.PastEvent.x = PositionInfoInfo.pastx;
        this.PastEvent.y = PositionInfoInfo.pasty;

        this.WinElement.scrollTo(this.ShowPos.x, this.ShowPos.y);
    }

    GetWinInfo=()=>{
        var Info = {};
        Info.top = this.WinElement.offsetTop;
        Info.left = this.WinElement.offsetLeft;
        Info.width= this.WinElement.offsetWidth; 
        Info.height = this.WinElement.offsetHeight;
        Info.Id = this.WinId;
        return Info;
    }

    AddEventCallBack = (CallBackMode, CallBackFunc) => {
        
        switch(CallBackMode){
            case ECGDrawElement.CallBackFuncID.WindowResize:           this.#CallBackFunList[ECGDrawElement.CallBackFuncID.WindowResize] = CallBackFunc;              break;
            case ECGDrawElement.CallBackFuncID.ECGElementMouseMove:    this.#CallBackFunList[ECGDrawElement.CallBackFuncID.ECGElementMouseMove] = CallBackFunc;       break;
            case ECGDrawElement.CallBackFuncID.ECGElementMouseDown:    this.#CallBackFunList[ECGDrawElement.CallBackFuncID.ECGElementMouseDown] = CallBackFunc;       break;
            case ECGDrawElement.CallBackFuncID.ECGElementMouseUp:      this.#CallBackFunList[ECGDrawElement.CallBackFuncID.ECGElementMouseUp] = CallBackFunc;         break;
            default:                                                    return false;
        }
        
        return true;
    }



    StartDrawECG = () => {
        this.#oECGGridCanvasElement.StartDrawECG(10);
    }

    CloseDrawECG = () => {
        this.#oECGGridCanvasElement.CloseDrawECG();
    }

    SetECGData = (data)=>{
        this.#oECGGridCanvasElement.PushECGData(data);
    }
    //********************************************************************************/
    //                              Event callback function
    //********************************************************************************/

    #WinElementResize = (event)=>{

        var WinPosInfo = this.GetWinInfo();
        if(this.WinWidth != WinPosInfo.width || this.WinHeight != WinPosInfo.height){
            this.WinWidth = this.WinElement.offsetWidth; 
            this.WinHeight = this.WinElement.offsetHeight;
            
            var GridElementInfo= this.#ObjGridElement.GetCanvasInfo();
            var ECGElementInfo= this.#oECGGridCanvasElement.GetCanvasInfo();

            this.#oECGGridCanvasElement.SetCanvasSize(ECGElementInfo.GridShowSec>=5? (GridElementInfo.smGridSize * 5 * 2) * ECGElementInfo.GridShowSec: this.WinWidth, this.WinHeight)

            this.DrawGrid();


            if(this.#CallBackFunList[ECGDrawElement.CallBackFuncID.WindowResize]!=undefined){
                this.#CallBackFunList[ECGDrawElement.CallBackFuncID.WindowResize](this.WinElement.id,this.GetWinInfo());
            }

            this.#ObjGridElement.SetCanvasSize(this.WinWidth,this.WinHeight);
            this.#ObjGridElement.Draw ();

            this.ClearECG();

            this.#oECGGridCanvasElement.ResetIndex();

        }
    }

    #ECGElementMouseMove = (event) => {
        if(this.Clicked){
            var WinPosInfo = this.GetWinInfo();
            if(event.pageX>this.PastEvent.x)
            this.ShowPos.x = this.ShowPos.x-1;
            else if(event.pageX<this.PastEvent.x)
            this.ShowPos.x = this.ShowPos.x+1;

            if(this.ShowPos.x<0)
            this.ShowPos.x=0;
        
            if(this.ShowPos.x > (this.ECGElement.offsetWidth-WinPosInfo.width)){
                this.ShowPos.x=(this.ECGElement.offsetWidth-WinPosInfo.width);
            }

            if(event.pageY>this.PastEvent.y)
            this.ShowPos.y = this.ShowPos.y+1;
            else if(event.pageY<this.PastEvent.y)
            this.ShowPos.y = this.ShowPos.y-1;

            if(this.ShowPos.y<0)
            this.ShowPos.y=0;
            
            if(this.ShowPos.y>(this.ECGElement.offsetHeight-WinPosInfo.height))
            this.ShowPos.y = (this.ECGElement.offsetHeight-WinPosInfo.height);

            
            this.PastEvent.x = event.pageX;
            this.PastEvent.y = event.pageY;

            this.WinElement.scrollTo(this.ShowPos.x, this.ShowPos.y);

            if(this.#CallBackFunList[ECGDrawElement.CallBackFuncID.ECGElementMouseMove]!=undefined){
                this.#CallBackFunList[ECGDrawElement.CallBackFuncID.ECGElementMouseMove](this.WinElement.id,this.GetWinPosition());
            }
        }
    }
    
    #ECGElementMouseDown = (event) => {
        //console.log(event.pageX, event.pageY);
        this.Clicked = true;
        if(this.#CallBackFunList[ECGDrawElement.CallBackFuncID.ECGElementMouseDown]!=undefined){
            this.#CallBackFunList[ECGDrawElement.CallBackFuncID.ECGElementMouseDown](this.WinElement.id,this.GetWinPosition());
        }
    }

    #ECGElementMouseUp=(event)=>{
        if(this.Clicked){
            this.Clicked = false;
            if(this.#CallBackFunList[ECGDrawElement.CallBackFuncID.ECGElementMouseUp]!=undefined){
                this.#CallBackFunList[ECGDrawElement.CallBackFuncID.ECGElementMouseUp](this.WinElement.id,this.GetWinPosition());
            }
        }
    }
}

module.exports = {
    ECGDrawElement
}




