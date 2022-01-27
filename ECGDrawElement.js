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
    
    #DataAndGridInfo={'WinTotleSec':10,'WinTotlemV':6,'smGrid_mV':0.2,'smGrid_Time':0.1}
    #MainWinPosInfo;
    
    ShowerWinElement;

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
        var ecgshowerelement = MainWinId + '_shower';
        var outerwinelementid = MainWinId + '_outer';
        var innerwinelementid = MainWinId + "_inner";
        var gridelementid = MainWinId + "_CanvasGrid";
        var ecgelementid = MainWinId + "_CanvasECG";

        this.#CallBackFunList = new Array(Object.keys(ECGDrawElement.CallBackFuncID).length);

        this.MainWinElement = document.getElementById(MainWinId);
        this.MainWinElement.innerHTML ='<style>.ShowECGWindow-inner::-webkit-scrollbar {display: none;}</style><div id="'+ecgshowerelement+'">'+
        '<canvas id="'+gridelementid+'"></canvas>'+
        '<div id="'+outerwinelementid+'">'+
            '<div id="'+innerwinelementid+'" class="ShowECGWindow-inner">'+
            '<canvas id="'+ecgelementid+'"></canvas></div>'+
        '</div></div>';

        this.#MainWinPosInfo = this.GetMainWinInfo();

        this.ShowerWinElement = document.getElementById(ecgshowerelement);
        this.#CSSCtrl_ShowerWin();
        //Get Windows size.
        this.WinId = innerwinelementid;
        this.InnerWinElement = document.getElementById(innerwinelementid);
        this.#CSSCtrl_Innter();
        this.OuterWinElement = document.getElementById(outerwinelementid);
        this.#CSSCtrl_Outer();
        //Build draw ECG grid class
        this.#ObjGridElement = new ECGGridCanvasElementClass(gridelementid);
        this.#ObjGridElement.SetCanvasSize(this.#MainWinPosInfo.width, this.#MainWinPosInfo.height);
        var WidthGridQuantity = this.#DataAndGridInfo.WinTotleSec/this.#DataAndGridInfo.smGrid_Time;

        this.#ObjGridElement.SetsmGridSize((this.#MainWinPosInfo.width/(WidthGridQuantity+0.6))/5);


        //Build draw ECG class
        this.#oECGCanvasElement = new ECGCanvasElementClass(ecgelementid);
        this.SetDrawMode(ECGElementDrawMode);
        this.#oECGCanvasElement.SetConstData(this.#DataAndGridInfo.smGrid_Time,this.#DataAndGridInfo.smGrid_mV);
        this.#oECGCanvasElement.SetsmGridSize((this.#MainWinPosInfo.width/(WidthGridQuantity+0.6))/5);

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

    SetCanvasPara(Sec,mV,smSec,smmV){
        this.#DataAndGridInfo.WinTotleSec = Sec
        this.#DataAndGridInfo.WinTotlemV = mV
        this.#DataAndGridInfo.smGrid_Time = smSec
        this.#DataAndGridInfo.smGrid_mV = smmV

        var WidthGridQuantity = this.#DataAndGridInfo.WinTotleSec/(this.#DataAndGridInfo.smGrid_Time*5);

        this.#ObjGridElement.SetsmGridSize((this.#MainWinPosInfo.width/(WidthGridQuantity+0.6))/5);
        var ECGElementInfo = this.#oECGCanvasElement.GetCanvasInfo();
        var GridElementInfo = this.#ObjGridElement.GetCanvasInfo();
        this.#ObjGridElement.SetSymmVText(this.#DataAndGridInfo.smGrid_mV * ECGElementInfo.Gain * 10);
        this.OuterWinElement.style['left'] =Math.round(GridElementInfo.smGridSize * 3)+'px';
        this.OuterWinElement.style['width'] = (this.#MainWinPosInfo.width-Math.round(GridElementInfo.smGridSize * 3))+'px';

        switch(this.#Element_Info.Mode){
            case ECGDrawElement.ObjElementMode.Dynamic_DrawingECG:
                this.#oECGCanvasElement.SetCanvasSize(this.#MainWinPosInfo.width - GridElementInfo.smGridSize * 3, this.#MainWinPosInfo.height);        
                break;
            case ECGDrawElement.ObjElementMode.Static_DrawingECG:
                this.#oECGCanvasElement.SetCanvasSize(ECGElementInfo.ECGData_Sec / this.#DataAndGridInfo.smGrid_Time * GridElementInfo.smGridSize , this.#MainWinPosInfo.height);    
                break;
        }

        this.#oECGCanvasElement.SetConstData(this.#DataAndGridInfo.smGrid_Time,this.#DataAndGridInfo.smGrid_mV);
        this.#oECGCanvasElement.SetsmGridSize((this.#MainWinPosInfo.width/(WidthGridQuantity+0.6))/5);
    }

    SetGridMode = (gridmode, value)=>{
        /*if(!this.#ObjGridElement.SetGridMode(gridmode, value))
            return false;
        var ECGElementInfo = this.#ObjGridElement.GetCanvasInfo();
        console.log('ECGElementInfo.smGridSize',ECGElementInfo.smGridSize);
        this.#oECGCanvasElement.SetsmGridSize(ECGElementInfo.smGridSize);
        return true;*/
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

    SetRegisterPara = (ResolutionOfSec, Sec)=>{
        this.#oECGCanvasElement.SetRegisterPara(ResolutionOfSec, Sec);
        var GridElementInfo = this.#ObjGridElement.GetCanvasInfo();
        switch(this.#Element_Info.Mode){
            case ECGDrawElement.ObjElementMode.Dynamic_DrawingECG:
                this.#oECGCanvasElement.SetCanvasSize(this.#MainWinPosInfo.width - GridElementInfo.smGridSize * 3, this.#MainWinPosInfo.height);        
                break;
            case ECGDrawElement.ObjElementMode.Static_DrawingECG:
                this.#oECGCanvasElement.SetCanvasSize(Sec / this.#DataAndGridInfo.smGrid_Time * GridElementInfo.smGridSize , this.#MainWinPosInfo.height);    
                break;
        }
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

        this.InnerWinElement.scrollTo(this.ShowPos.x, this.ShowPos.y);
    }

    GetMainWinInfo=()=>{
        var Info = {};
        Info.top = this.MainWinElement.offsetTop;
        Info.left = this.MainWinElement.offsetLeft;
        Info.width= this.MainWinElement.offsetWidth; 
        Info.height = this.MainWinElement.offsetHeight;
        Info.Id = this.MainWinElement.id;
        return Info;
    }

    GetWinInfo=()=>{
        var Info = {};
        Info.top = this.InnerWinElement.offsetTop;
        Info.left = this.InnerWinElement.offsetLeft;
        Info.width= this.InnerWinElement.offsetWidth; 
        Info.height = this.InnerWinElement.offsetHeight;
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
                if(!this.#oECGCanvasElement.SetGainInfo(gain))
                    return false;
                break;
            default:
                return false;
                break;
        }
        var ECGElementInfo = this.#oECGCanvasElement.GetCanvasInfo();
        this.#ObjGridElement.SetSymmVText(this.#DataAndGridInfo.smGrid_mV * ECGElementInfo.Gain * 10);
        return true;
    }

    SetDrawMode(ElementMode){
        if(this.#Element_Info.Mode === ECGDrawElement.ObjElementMode.Static_DrawingECG)
            this.CloseDrawECG();

        var ECGElementInfo = this.#oECGCanvasElement.GetCanvasInfo();
        var GridElementInfo = this.#ObjGridElement.GetCanvasInfo();
        this.OuterWinElement.style['left'] = Math.round(GridElementInfo.smGridSize * 3)+'px';
        this.OuterWinElement.style['width'] = (this.#MainWinPosInfo.width-Math.round(GridElementInfo.smGridSize * 3))+'px';
        switch(ElementMode){
            case ECGDrawElement.ObjElementMode.Dynamic_DrawingECG:          
                this.#Element_Info.Mode = ElementMode;  
                this.#oECGCanvasElement.SetCanvasSize(this.#MainWinPosInfo.width - GridElementInfo.smGridSize * 3, this.#MainWinPosInfo.height);      
                break;
            case ECGDrawElement.ObjElementMode.Static_DrawingECG:       
                this.#Element_Info.Mode = ElementMode;
                this.#oECGCanvasElement.SetCanvasSize(ECGElementInfo.ECGData_Sec / this.#DataAndGridInfo.smGrid_Time * GridElementInfo.smGridSize, this.#MainWinPosInfo.height);
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
        // console.log('GetDrawMode',this.GetDrawMode());
        if(this.GetDrawMode() === ECGDrawElement.ObjElementMode.Static_DrawingECG){
            // console.log('Static');
            this.#oECGCanvasElement.StaticDrawECG();
        }else{
            //console.log('Dynamic')
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
        this.#MainWinPosInfo = this.GetMainWinInfo();

        if(this.#CallBackFunList[ECGDrawElement.CallBackFuncID.WindowResize]!=undefined){
            this.#CallBackFunList[ECGDrawElement.CallBackFuncID.WindowResize](this.InnerWinElement.id,this.GetWinInfo());
        }
        this.ClearGrid();
        this.#ObjGridElement.SetCanvasSize(this.#MainWinPosInfo.width,this.#MainWinPosInfo.height);

        var WidthGridQuantity = this.#DataAndGridInfo.WinTotleSec/(this.#DataAndGridInfo.smGrid_Time * 5);

        this.#ObjGridElement.SetsmGridSize((this.#MainWinPosInfo.width/(WidthGridQuantity+0.6))/5);

        this.DrawGrid();
        

        this.CloseDrawECG();

        var GridElementInfo = this.#ObjGridElement.GetCanvasInfo();
        var ECGElementInfo= this.#oECGCanvasElement.GetCanvasInfo();

        this.OuterWinElement.style['left'] = Math.round(GridElementInfo.smGridSize * 3)+'px';
        this.OuterWinElement.style['width'] = (this.#MainWinPosInfo.width-Math.round(GridElementInfo.smGridSize * 3))+'px';

        switch(this.#Element_Info.Mode){
            case ECGDrawElement.ObjElementMode.Dynamic_DrawingECG:
                this.#oECGCanvasElement.SetCanvasSize(this.#MainWinPosInfo.width - GridElementInfo.smGridSize * 3, this.#MainWinPosInfo.height);        
                break;
            case ECGDrawElement.ObjElementMode.Static_DrawingECG:
                this.#oECGCanvasElement.SetCanvasSize(ECGElementInfo.ECGData_Sec / this.#DataAndGridInfo.smGrid_Time * GridElementInfo.smGridSize , this.#MainWinPosInfo.height);    
                break;
        }

        this.#oECGCanvasElement.SetsmGridSize(GridElementInfo.smGridSize);

        this.#oECGCanvasElement.ResetIndex();
        this.StartDrawECG();
            
        
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

            this.InnerWinElement.scrollTo(this.ShowPos.x, this.ShowPos.y);

            if(this.#CallBackFunList[ECGDrawElement.CallBackFuncID.ECGElementMouseMove]!=undefined){
                this.#CallBackFunList[ECGDrawElement.CallBackFuncID.ECGElementMouseMove](this.InnerWinElement.id,this.GetWinPosition());
            }
        }
    }
    
    #ECGElementMouseDown = (event) => {
        console.log(event.pageX, event.pageY);
        this.Clicked = true;
        if(this.#CallBackFunList[ECGDrawElement.CallBackFuncID.ECGElementMouseDown]!=undefined){
            this.#CallBackFunList[ECGDrawElement.CallBackFuncID.ECGElementMouseDown](this.InnerWinElement.id,this.GetWinPosition());
        }
    }

    #ECGElementMouseUp=(event)=>{
        if(this.Clicked){
            this.Clicked = false;
            if(this.#CallBackFunList[ECGDrawElement.CallBackFuncID.ECGElementMouseUp]!=undefined){
                this.#CallBackFunList[ECGDrawElement.CallBackFuncID.ECGElementMouseUp](this.InnerWinElement.id,this.GetWinPosition());
            }
        }
    }


    #CSSCtrl_ShowerWin=()=>{
        this.ShowerWinElement.style['position']='relative';
        this.ShowerWinElement.style['background-color']='#000000';
        this.ShowerWinElement.style['width']='100%';
        this.ShowerWinElement.style['height']='100%';
    }
    #CSSCtrl_Outer = ()=>{
        this.OuterWinElement.style['position'] = 'relative';
        this.OuterWinElement.style['overflow'] = 'hidden';
        this.OuterWinElement.style['width']='100%';
        this.OuterWinElement.style['height']='100%';
    }

    #CSSCtrl_Innter = ()=>{
        this.InnerWinElement.style['position'] = 'absolute';
        this.InnerWinElement.style['top'] = '0px'
        this.InnerWinElement.style['left'] = '0px'
        this.InnerWinElement.style['overflow-x'] = 'scroll'
        this.InnerWinElement.style['overflow-y'] = 'scroll'
        this.InnerWinElement.style['width'] = '100%';
        this.InnerWinElement.style['height'] = '100%';
        this.InnerWinElement.style['::-webkit-scrollbar'] = '100%';
    }
}

module.exports = {
    ECGDrawElement
}




