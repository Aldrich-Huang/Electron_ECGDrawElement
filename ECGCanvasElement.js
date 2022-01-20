// -----------------------------------------------------------------------------------------------------
//     *File Name: ECGCanvasElement.js
//     *Author:    Ken Huang.
//     *Date:      2022.01.20
//     *Version:   1.0.0
//     *explanation:
//         -public function:

// -------------------------------------------------------------------------------------------------------

const ECGDataRegisterClass = require('./ECGDataRegister.js').ECGDataRegister;

class ECGCanvasElement{
    static CallBackFuncID = {'WindowResize': 0, 'ECGElementMouseMove':1,'ECGElementMouseDown':2,'ECGElementMouseUp':3}

    #Canvas_Info = {'Color': '#00c100', 'LineWidth': 1,'GridShowSec':-1};
    #Element;
    #Elementctx;
    #ECGDataRegister;
    #ECGIntervalID

    #DrawECGIndex = 0;
    #NowEcgData=0;
    #PreEcgData=0;

    constructor(ElementID, RegisterSize=5000) {

        this.#Element = document.getElementById(ElementID);
        if(this.#Element.getContext){
            this.#Elementctx = this.#Element.getContext('2d');
        }

        this.#ECGDataRegister = new ECGDataRegisterClass(RegisterSize);



    }

    GetCanvasInfo(){
        return this.#Canvas_Info;
    }

    SetCanvasSize = (Width, Height) => {
        this.#Element.width  = Width;
        this.#Element.height = Height;
        
    }
    AddEventCallBack = (CallBackMode, CallBackFunc) => {

        switch(CallBackMode){
            case ECGCanvasElement.CallBackFuncID.ECGElementMouseMove:    this.#Element.addEventListener('mousemove', CallBackFunc);       break;
            case ECGCanvasElement.CallBackFuncID.ECGElementMouseDown:    this.#Element.addEventListener('mousedown', CallBackFunc);       break;
            case ECGCanvasElement.CallBackFuncID.ECGElementMouseUp:      this.#Element.addEventListener("mouseup", CallBackFunc);         break;
            default:                                                    return false;
        }
        
        return true;
    }

    SetDrawLinePara = (LineColor, LineWidth) => {
        this.#Canvas_Info.Color = LineColor;
        this.#Canvas_Info.LineWidth = LineWidth;
    }

    PushECGData(ECGData){
        this.#ECGDataRegister.SetData(ECGData);
    }

    StartDrawECG = (milliseconds) => {
        this.ResetIndex();
        this.#ECGIntervalID = setInterval(this.#DrawECG, milliseconds); 
    }
    
    CloseDrawECG = () => {
        clearInterval(this.#ECGIntervalID);
    }

    #DrawECG = ()=>{
        var DrawRange =Math.floor( this.#ECGDataRegister.GetSize() / this.#Element.width);
        this.#ECGDataRegister.SetDateSpace(DrawRange);

        do{
            this.#NowEcgData = this.#ECGDataRegister.GetData();
            if(this.#NowEcgData != -1){
                this.#Elementctx.strokeStyle = this.#Canvas_Info.Color;
                this.#Elementctx.lineWidth = this.#Canvas_Info.LineWidth;

                this.#Elementctx.beginPath();
                
                this.#Elementctx.clearRect(this.#DrawECGIndex, 0, 25, this.#Element.height)

                
                this.#Elementctx.moveTo(this.#DrawECGIndex-1, (this.#Element.height/2) + this.#PreEcgData);
                this.#Elementctx.lineTo(this.#DrawECGIndex, (this.#Element.height/2) + this.#NowEcgData);
                this.#DrawECGIndex = (this.#DrawECGIndex + 1) % this.#Element.width;
                
                this.#PreEcgData = this.#NowEcgData;

                this.#Elementctx.stroke();
                this.#Elementctx.closePath();
            }
        }while(this.#NowEcgData != -1);
    }

    ClearView = () => {
        this.#Elementctx.beginPath();
        this.#Elementctx.clearRect(0, 0, this.#Element.width, this.#Element.height);
        this.#Elementctx.closePath();
    }

    ResetIndex(){
        this.#DrawECGIndex = 0;
    }
}

module.exports = {
    ECGCanvasElement
}