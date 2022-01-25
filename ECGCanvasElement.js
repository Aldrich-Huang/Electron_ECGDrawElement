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
    static ObjGainItem = {'Gain_0.5':0.5,'Gain_1.0':1.0,'Gain_2.0':2.0,'Gain_4.0':4.0}; 
    static #ConstData = {'TimeUnit':0.2, 'VoltageUnit':0.1}
    #Canvas_Info = {'Color': '#00c100', 'LineWidth': 1,'smGridSize': 5,'ECGQuantity_Sec':500,'ECGData_Sec':10,'Gain':ECGCanvasElement.ObjGainItem['Gain_1.0']};
    
    #Element;
    #Elementctx;
    #ECGDataRegister;
    #ECGIntervalID

    #DrawECGIndex = 0;
    #CounterIndex = -1;
    #NowEcgData=0;
    #PreEcgData=0;

    #NowEcgData_smGrid = 0;
    #PreEcgData_smGrid = 0;

    constructor(ElementID) {
        this.#Element = document.getElementById(ElementID);
        if(this.#Element.getContext){
            this.#Elementctx = this.#Element.getContext('2d');
        }

        var RegisterSize = this.#Canvas_Info.ECGQuantity_Sec * this.#Canvas_Info.ECGData_Sec;
        this.#ECGDataRegister = new ECGDataRegisterClass(RegisterSize);

    }

    GetCanvasInfo(){
        return this.#Canvas_Info;
    }

    SetCanvasSize = (Width, Height) => {

        this.#Element.width  = Width;
        this.#Element.height = Height;
        
    }

    GetCanvasSize = ()=>{
        return {'width':this.#Element.offsetWidth,'height': this.#Element.offsetHeight}
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

    SetDataQuantitySec(DataQuantity){
        this.#Canvas_Info.ECGQuantity_Sec = DataQuantity;
    }

    SetDataTime(Sec){
        this.#Canvas_Info.ECGData_Sec = Sec;
    }

    SetsmGridSize = (smGridSize)=>{
        this.#Canvas_Info.smGridSize = smGridSize;

    }

    SetDrawLinePara = (LineColor, LineWidth) => {
        this.#Canvas_Info.Color = LineColor;
        this.#Canvas_Info.LineWidth = LineWidth;
    }

    PushECGData(ECGData){
        this.#ECGDataRegister.SetData(ECGData);
    }

    StartDynamicDrawECG = (milliseconds) => {
        this.ResetIndex();
        this.ClearView();
        this.#ECGIntervalID = setInterval(this.#DynamicDrawECG, milliseconds); 
    }
    
    CloseDynamicDrawECG = () => {
        if(this.#ECGIntervalID!=undefined)
            clearInterval(this.#ECGIntervalID);
    }

    #DynamicDrawECG = ()=>{
        var DrawRange =(this.#Canvas_Info.ECGQuantity_Sec *ECGCanvasElement.#ConstData.TimeUnit)/this.#Canvas_Info.smGridSize;// this.#ECGDataRegister.GetSize() / this.#Element.width;
        var indx = Math.floor(this.#DrawECGIndex*DrawRange);

        this.#Elementctx.strokeStyle = this.#Canvas_Info.Color;
        this.#Elementctx.lineWidth = this.#Canvas_Info.LineWidth;

        do{
            this.#NowEcgData = this.#ECGDataRegister.GetData();
            
            if(this.#NowEcgData.state){

                if((this.#CounterIndex)===indx){
                    this.#Elementctx.beginPath();
                    //0.01是模擬mV
                    this.#NowEcgData_smGrid = Math.floor((this.#NowEcgData.ECGData *0.01 / (ECGCanvasElement.#ConstData.VoltageUnit / this.#Canvas_Info.Gain))*(this.#Canvas_Info.smGridSize));
    
                    this.#Elementctx.clearRect(this.#Canvas_Info.smGridSize * 3+this.#DrawECGIndex, 0, 25, this.#Element.height)
    
                    this.#Elementctx.moveTo(this.#Canvas_Info.smGridSize * 3+this.#DrawECGIndex-1, (this.#Element.height/2) + this.#PreEcgData_smGrid );
                    this.#Elementctx.lineTo(this.#Canvas_Info.smGridSize * 3+this.#DrawECGIndex, (this.#Element.height/2) + this.#NowEcgData_smGrid );
    
                    this.#DrawECGIndex = this.#DrawECGIndex + 1;
                    
                    if(this.#DrawECGIndex+this.#Canvas_Info.smGridSize * 3 >= this.#Element.width){
                        this.ResetIndex();
                    }
                    this.#PreEcgData_smGrid = this.#NowEcgData_smGrid;
                    //this.#PreEcgData = this.#NowEcgData;
    
                    this.#Elementctx.stroke();
                    this.#Elementctx.closePath();

                    indx = Math.floor(this.#DrawECGIndex * DrawRange);
                    
                }
                this.#CounterIndex +=1;
            }
        }while(this.#NowEcgData.state);
    }

    StaticDrawECG = () => {
        var DrawRange =this.#ECGDataRegister.GetSize() / this.#Element.width;

        var ECGDataBuf = this.#ECGDataRegister.GetDatas(this.#ECGDataRegister.GetSize());
        this.#Elementctx.strokeStyle = this.#Canvas_Info.Color;
        this.#Elementctx.lineWidth = this.#Canvas_Info.LineWidth;


        for(var pos = 0; pos < this.#Element.width; pos++){
            var indx = Math.floor(pos*DrawRange);
            this.#Elementctx.beginPath();

            //0.01是模擬mV
            this.#NowEcgData_smGrid = Math.floor((ECGDataBuf[indx] *0.01 / (ECGCanvasElement.#ConstData.VoltageUnit / this.#Canvas_Info.Gain))*(this.#Canvas_Info.smGridSize));

            this.#Elementctx.moveTo(this.#DrawECGIndex-1, (this.#Element.height/2) + this.#PreEcgData_smGrid);
            this.#Elementctx.lineTo(this.#DrawECGIndex, (this.#Element.height/2) + this.#NowEcgData_smGrid);
            this.#DrawECGIndex = (this.#DrawECGIndex + 1) % this.#Element.width;
            
            this.#PreEcgData_smGrid = this.#NowEcgData_smGrid;

            this.#Elementctx.stroke();
            this.#Elementctx.closePath();

        }



        // for(var indx = 0;indx < ECGDataBuf.length; indx+=DrawRange){
        //     console.log('this.#DrawECGIndex',this.#DrawECGIndex);
        //     this.#Elementctx.beginPath();

        //     //0.01是模擬mV
        //     this.#NowEcgData_smGrid = Math.floor((ECGDataBuf[indx] *0.01 / (ECGCanvasElement.#ConstData.VoltageUnit * this.#Canvas_Info.Gain))*(this.#Canvas_Info.smGridSize));

        //     this.#Elementctx.moveTo(this.#DrawECGIndex-1, (this.#Element.height/2) + this.#PreEcgData_smGrid);
        //     this.#Elementctx.lineTo(this.#DrawECGIndex, (this.#Element.height/2) + this.#NowEcgData_smGrid);
        //     this.#DrawECGIndex = (this.#DrawECGIndex + 1) % this.#Element.width;
            
        //     this.#PreEcgData_smGrid = this.#NowEcgData_smGrid;

        //     this.#Elementctx.stroke();
        //     this.#Elementctx.closePath();
        // }

        // do{
        //     this.#NowEcgData = this.#ECGDataRegister.GetData();
        //     if(this.#NowEcgData.state){
            
        //         this.#Elementctx.beginPath();

        //         //0.01是模擬mV
        //         this.#NowEcgData_smGrid = Math.floor((this.#NowEcgData.ECGData *0.01 / (ECGCanvasElement.#ConstData.VoltageUnit * this.#Canvas_Info.Gain))*(this.#Canvas_Info.smGridSize));

        //         this.#Elementctx.moveTo(this.#DrawECGIndex-1, (this.#Element.height/2) + this.#PreEcgData_smGrid);
        //         this.#Elementctx.lineTo(this.#DrawECGIndex, (this.#Element.height/2) + this.#NowEcgData_smGrid);
        //         this.#DrawECGIndex = (this.#DrawECGIndex + 1) % this.#Element.width;
                
        //         this.#PreEcgData_smGrid = this.#NowEcgData_smGrid;

        //         this.#Elementctx.stroke();
        //         this.#Elementctx.closePath();
        //     }
        // }while(this.#NowEcgData.state);
    }

    ClearView = () => {
        this.#Elementctx.beginPath();
        this.#Elementctx.clearRect(0, 0, this.#Element.width, this.#Element.height);
        this.#Elementctx.closePath();
    }

    ResetIndex(){
        this.#DrawECGIndex = 0;
        this.#CounterIndex = -1;
    }

    SetGainInfo = (gain) =>{
        switch(gain){
            case ECGCanvasElement.ObjGainItem['Gain_0.5']:
            case ECGCanvasElement.ObjGainItem['Gain_1.0']:
            case ECGCanvasElement.ObjGainItem['Gain_2.0']:
            case ECGCanvasElement.ObjGainItem['Gain_4.0']:
                this.#Canvas_Info.Gain = gain;
                break;
            default:
                return false;
                break;
        }
        return true;
    }
}

module.exports = {
    ECGCanvasElement
}