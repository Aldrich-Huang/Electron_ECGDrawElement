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

class ECGDrawElement{
    static CallBackFuncID = {'WindowResize': 0, 'ECGElementMouseMove':1,'ECGElementMouseDown':2,'ECGElementMouseUp':3}
    static ObjGridMode = {'FixedGridSize':10,'FixedGridQuantity_W':11, 'FixedGridQuantity_H':12}

    Clicked = false;
    WinWidth = 200;
    WinHeight = 200;
    //WinSize = {'Width':200, 'Height':200};
    ShowPos = {'x':0, 'y':0};
    PastEvent = {'x':0, 'y':0};


    #Canvas_GridInfo = {'Color': '#999999', 'LineWidth': 1,'GridMode':ECGDrawElement.ObjGridMode.FixedGridSize, 'smGridSize': 5, 'GridQuantity':-1};
    #Canvas_ECGInfo = {'Color': '#00c100', 'LineWidth': 1,'GridShowSec':-1}
    #CallBackFunList;

    #ECGDataList;

    #ECGIntervalID; 
    #DrawECGIndex = 0;
    #NowEcgData=0;
    #PreEcgData=0;

    //Obj Element Ctrl
    #ObjGridElement

    constructor(MainWinId) {

        this.#ECGDataList = new ECGDataRegisterClass(5000);
        
        

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
        
        
        this.#ObjGridElement = new ECGGridCanvasElementClass(gridelementid);
        this.#ObjGridElement.SetCanvasSize(this.WinWidth, this.WinHeight);


        this.ECGElement = document.getElementById(ecgelementid);
        
        this.ECGElement.width  = this.WinWidth;
        this.ECGElement.height = this.WinHeight;

        if(this.ECGElement.getContext){
            this.ECGElementctx = this.ECGElement.getContext('2d');
        }
        this.ECGElement.addEventListener('mousemove', this.#ECGElementMouseMove);
        this.ECGElement.addEventListener('mousedown', this.#ECGElementMouseDown);
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
    SetGridSize = (gridsize) =>{
        this.#Canvas_GridInfo.smGridSize = gridsize;
    }

    GetGridSize = () => {
        return this.#Canvas_GridInfo.smGridSize;
    }

    DrawGrid = ()=>{
        this.#ObjGridElement.Draw();
    }

    ClearGrid=()=>{
        this.#ObjGridElement.ClearView();
    }

    SetDrawECGPara = (gridColor, gridWidth)=>{
        
        this.#Canvas_ECGInfo.Color = gridColor;
        this.#Canvas_ECGInfo.LineWidth = gridWidth;
    }


    SetECGShowSec = (sec)=>{
        if(sec>5){
            this.#Canvas_ECGInfo.GridShowSec=sec;
            this.ECGElement.width  = (this.#Canvas_GridInfo.smGridSize * 5 * 2) * this.#Canvas_ECGInfo.GridShowSec;
        }else{
            this.ECGElement.width  = this.WinWidth;
            this.#Canvas_ECGInfo.GridShowSec=-1;
        }

    }

    ClearECG=()=>{
        this.ECGElementctx.beginPath();
        this.ECGElementctx.clearRect(0, 0, this.WinWidth, this.WinHeight);
        this.ECGElementctx.closePath();
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
        this.#ECGIntervalID = setInterval(this.#DrawECG, 10); 

    }

    #DrawECG = () =>{
        var WinInfo = this.GetWinInfo();
        var DrawRange =Math.floor( this.#ECGDataList.GetSize() / WinInfo.width);
        this.#ECGDataList.SetDateSpace(DrawRange);

        do{
            this.#NowEcgData = this.#ECGDataList.GetData();
            if(this.#NowEcgData != -1){
                this.ECGElementctx.strokeStyle = this.#Canvas_ECGInfo.Color;
                this.ECGElementctx.lineWidth = this.#Canvas_ECGInfo.LineWidth;

                this.ECGElementctx.beginPath();
                
                this.ECGElementctx.clearRect(this.#DrawECGIndex, 0, 25, WinInfo.height)

                
                this.ECGElementctx.moveTo(this.#DrawECGIndex-1, (WinInfo.height/2) + this.#PreEcgData);
                this.ECGElementctx.lineTo(this.#DrawECGIndex, (WinInfo.height/2) + this.#NowEcgData);
                this.#DrawECGIndex = (this.#DrawECGIndex + 1) % WinInfo.width;
                
                this.#PreEcgData = this.#NowEcgData;
                

                this.ECGElementctx.stroke();
                this.ECGElementctx.closePath();
            }
        }while(this.#NowEcgData != -1);
    }

    CloseDrawECG = () => {
        clearInterval(this.#ECGIntervalID);
    }

    SetECGData = (data)=>{
        this.#ECGDataList.SetData(data);
    }
    //********************************************************************************/
    //                              Event callback function
    //********************************************************************************/

    #WinElementResize = (event)=>{

        var WinPosInfo = this.GetWinInfo();
        if(this.WinWidth != WinPosInfo.width || this.WinHeight != WinPosInfo.height){
            this.WinWidth = this.WinElement.offsetWidth; 
            this.WinHeight = this.WinElement.offsetHeight;
            
            // this.GridElement.width  = this.WinWidth;
            // this.GridElement.height = this.WinHeight;

            
            this.ECGElement.width  = this.#Canvas_ECGInfo.GridShowSec>=5? (this.#Canvas_GridInfo.smGridSize * 5 * 2) * this.#Canvas_ECGInfo.GridShowSec: this.WinWidth;
            this.ECGElement.height = this.WinHeight;

            this.DrawGrid();
            //this.DrawECG();

            if(this.#CallBackFunList[ECGDrawElement.CallBackFuncID.WindowResize]!=undefined){
                this.#CallBackFunList[ECGDrawElement.CallBackFuncID.WindowResize](this.WinElement.id,this.GetWinInfo());
            }

            //重新繪製
            switch(this.#Canvas_GridInfo.GridMode){
                case ECGDrawElement.ObjGridMode.FixedGridQuantity_W:
                    this.#Canvas_GridInfo.smGridSize=(WinPosInfo.width/this.#Canvas_GridInfo.GridQuantity)/5;
                break;
                case ECGDrawElement.ObjGridMode.FixedGridQuantity_H:
                    this.#Canvas_GridInfo.smGridSize=(WinPosInfo.height/this.#Canvas_GridInfo.GridQuantity)/5;
                break;
            }

            this.#ObjGridElement.SetCanvasSize(this.WinWidth,this.WinHeight);
            this.#ObjGridElement.Draw ();

            this.ClearECG();
            this.#DrawECGIndex = 0;
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




