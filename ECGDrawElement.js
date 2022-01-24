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
    static ObjGridMode = ECGGridCanvasElementClass.ObjGridMode;
    static ObjElementMode = {'Dynamic_DrawingECG':50,'Static_DrawingECG': 51};
    static ObjGainItem = ECGCanvasElementClass.ObjGainItem;
    

    Clicked = false;
    WinWidth = 200;
    WinHeight = 200;
    //WinSize = {'Width':200, 'Height':200};
    ShowPos = {'x':0, 'y':0};
    PastEvent = {'x':0, 'y':0};

    #Element_Info = {'Mode':ECGDrawElement.ObjElementMode.Static_DrawingECG};
    #CallBackFunList;

    //Obj Element Ctrl
    #ObjGridElement
    #oECGCanvasElement

    constructor(MainWinId, ECGElementDrawMode = ECGDrawElement.ObjElementMode.Static_DrawingECG) {

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
        this.#oECGCanvasElement = new ECGCanvasElementClass(ecgelementid);
        this.SetDrawMode(ECGElementDrawMode);


        this.#oECGCanvasElement.AddEventCallBack(ECGCanvasElementClass.CallBackFuncID.ECGElementMouseMove, this.#ECGElementMouseMove);
        this.#oECGCanvasElement.AddEventCallBack(ECGCanvasElementClass.CallBackFuncID.ECGElementMouseDown, this.#ECGElementMouseDown);
        




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
        if(!this.#ObjGridElement.SetGridMode(gridmode, value))
            return false;
        var ECGElementInfo = this.#ObjGridElement.GetCanvasInfo();
        console.log('ECGElementInfo.smGridSize',ECGElementInfo.smGridSize);
        this.#oECGCanvasElement.SetsmGridSize(ECGElementInfo.smGridSize);
        return true;
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
        this.#oECGCanvasElement.SetDrawLinePara(ECGLineColor,ECGLineWidth);
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
        this.#oECGCanvasElement.ClearView();
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

    SetGain = (gain) => {
        switch(gain){
            case ECGDrawElement.ObjGainItem['Gain_0.5']:
            case ECGDrawElement.ObjGainItem['Gain_1.0']:
            case ECGDrawElement.ObjGainItem['Gain_2.0']:
            case ECGDrawElement.ObjGainItem['Gain_4.0']:
                return ECGCanvasElementClass.SetGainInfo(gain);
                break;
            default:
                return false;
                break;
        }
    }

    SetDrawMode(ElementMode){
        if(this.#Element_Info.Mode === ECGDrawElement.ObjElementMode.Static_DrawingECG)
            this.CloseDrawECG();

        switch(ElementMode){
            case ECGDrawElement.ObjElementMode.Dynamic_DrawingECG:          
                this.#Element_Info.Mode = ElementMode;  
                this.#oECGCanvasElement.SetCanvasSize(this.WinWidth, this.WinHeight); 
                console.log('SetDrawMode','ECGDrawElement.ObjElementMode.Dynamic_DrawingECG');       
                break;
            case ECGDrawElement.ObjElementMode.Static_DrawingECG:           
                this.#Element_Info.Mode = ElementMode;    
                var ECGElementInfo = this.#oECGCanvasElement.GetCanvasInfo();
                var GridElementInfo = this.#ObjGridElement.GetCanvasInfo();
                console.log('SetDrawMode','ECGDrawElement.ObjElementMode.Static_DrawingECG');    
                this.#oECGCanvasElement.SetCanvasSize(ECGElementInfo.ECGData_Sec * (GridElementInfo.smGridSize * 5 * 2), this.WinHeight);      
                break;
            default:                                                        
                return false;
        }
        return true;
    }


    GetDrawMode(){
        return this.#Element_Info.Mode;
    }

    StartDrawECG = () => {
        console.log('GetDrawMode',this.GetDrawMode());
        if(this.GetDrawMode() === ECGDrawElement.ObjElementMode.Static_DrawingECG){
            console.log('Static');
            this.#oECGCanvasElement.StaticDrawECG();
        }else{
            console.log('Dynamic')
            this.#oECGCanvasElement.StartDynamicDrawECG(10);
        }

        
        return true;
    }

    CloseDrawECG = () => {
        this.#oECGCanvasElement.CloseDynamicDrawECG();
    }

    SetECGData = (data)=>{
        this.#oECGCanvasElement.PushECGData(data);
    }
    //********************************************************************************/
    //                              Event callback function
    //********************************************************************************/

    #WinElementResize = (event)=>{

        var WinPosInfo = this.GetWinInfo();
        if(this.WinWidth != WinPosInfo.width || this.WinHeight != WinPosInfo.height){
            this.WinWidth = this.WinElement.offsetWidth; 
            this.WinHeight = this.WinElement.offsetHeight;
            
            


            if(this.#CallBackFunList[ECGDrawElement.CallBackFuncID.WindowResize]!=undefined){
                this.#CallBackFunList[ECGDrawElement.CallBackFuncID.WindowResize](this.WinElement.id,this.GetWinInfo());
            }

            this.#ObjGridElement.SetCanvasSize(this.WinWidth,this.WinHeight);
            this.DrawGrid();
            

            this.CloseDrawECG();

            var GridElementInfo = this.#ObjGridElement.GetCanvasInfo();
            var ECGElementInfo= this.#oECGCanvasElement.GetCanvasInfo();

            switch(this.#Element_Info.Mode){
                case ECGDrawElement.ObjElementMode.Dynamic_DrawingECG:
                    this.#oECGCanvasElement.SetCanvasSize(this.WinWidth, this.WinHeight);        
                    break;
                case ECGDrawElement.ObjElementMode.Static_DrawingECG:
                    this.#oECGCanvasElement.SetCanvasSize(ECGElementInfo.ECGData_Sec * (GridElementInfo.smGridSize * 5 * 2), this.WinHeight);      
                    break;
            }

            this.#oECGCanvasElement.SetsmGridSize(GridElementInfo.smGridSize);

            this.#oECGCanvasElement.ResetIndex();
            this.StartDrawECG();
            
        }
    }

    #ECGElementMouseMove = (event) => {
        if(this.Clicked){
            var WinPosInfo = this.GetWinInfo();
            var ECGElementInfo = this.#oECGCanvasElement.GetCanvasSize();

            if(event.pageX>this.PastEvent.x)
            this.ShowPos.x = this.ShowPos.x-1;
            else if(event.pageX<this.PastEvent.x)
            this.ShowPos.x = this.ShowPos.x+1;

            if(this.ShowPos.x<0)
            this.ShowPos.x=0;
        
            if(this.ShowPos.x > (ECGElementInfo.width - WinPosInfo.width)){
                this.ShowPos.x=(ECGElementInfo.width - WinPosInfo.width);
            }

            if(event.pageY>this.PastEvent.y)
            this.ShowPos.y = this.ShowPos.y+1;
            else if(event.pageY<this.PastEvent.y)
            this.ShowPos.y = this.ShowPos.y-1;

            if(this.ShowPos.y<0)
            this.ShowPos.y=0;
            
            if(this.ShowPos.y>(ECGElementInfo.height - WinPosInfo.height))
            this.ShowPos.y = (ECGElementInfo.height - WinPosInfo.height);

            
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




