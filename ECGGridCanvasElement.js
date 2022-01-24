// -----------------------------------------------------------------------------------------------------
//     *File Name: ECGGridCanvasElement.js
//     *Author:    Ken Huang.
//     *Date:      2022.01.20
//     *Version:   1.0.0
//     *explanation:
//         -public function:
//             =>SetGridMode
//                 *) Input: 
//                      ->gridmode: grid drawing method. (ObjGridMode)
//                      ->value: input data.
//                 *) Output: If the setting is successful, the return is true. If it fails, the return is false.
//                 *) Function: The selection mode controls the grid drawing method.  
//             =>SetCanvasSize
//                 *) Input: 
//                      ->Width:Set element width.
//                      ->Height:Set element height.
//                 *) Output: Null.
//                 *) Function: Set element width and height.  
//             =>SetDrawLinePara
//                 *) Input: 
//                      ->LineColor: Line color.
//                      ->LineWidth: Line width.
//                 *) Output: Null.
//                 *) Function: Set the width and color of the Canvas line .  
//             =>AddEventCallBack
//                 *) Input: 
//                      ->CallBackMode: callback function mode. (CallBackFuncID)
//                      ->CallBackFunc: Input function point.
//                 *) Output: If the setting is successful, the return is true. If it fails, the return is false.
//                 *) Function: The interval setting of the data obtained by the user.  
//             =>Draw
//                 *) Input: Null.
//                 *) Output: Null.
//                 *) Function: Drawing grid.  
//             =>ClearView
//                 *) Input: Null.
//                 *) Output: Null.
//                 *) Function: Clear canvas.  
// -------------------------------------------------------------------------------------------------------

/*
SetGridMode: 
    FixedGridSize => 依照輸入PX大小會至表格。
    FixedGridQuantity_W => 依照視窗寬度均等分配表格大小。
    FixedGridQuantity_H => 依照視窗高度均等分配表格大小。
*/
class ECGGridCanvasElement{
    static CallBackFuncID = {'WindowResize': 0, 'ECGElementMouseMove':1,'ECGElementMouseDown':2,'ECGElementMouseUp':3}
    static ObjGridMode = {'FixedGridSize':10,'FixedGridQuantity_W':11, 'FixedGridQuantity_H':12,'d':20,'C':21}

    #Canvas_Info = {'Color': '#999999', 'LineWidth': 1,'GridMode': ECGGridCanvasElement.ObjGridMode.FixedGridSize, 'smGridSize': 5, 'GridQuantity':-1};

    #Element;
    #Elementctx;
    
    constructor(ElementID) {

        this.#Element = document.getElementById(ElementID);
        if(this.#Element.getContext){
            this.#Elementctx = this.#Element.getContext('2d');
        }

    }

    SetGridMode = (gridmode, value)=>{
        switch(gridmode){
            case ECGGridCanvasElement.ObjGridMode.FixedGridSize:
                this.#Canvas_Info.GridMode=gridmode;
                this.#Canvas_Info.smGridSize=value;
                this.#Canvas_Info.GridQuantity=-1;
            break;
            case ECGGridCanvasElement.ObjGridMode.FixedGridQuantity_W:
                this.#Canvas_Info.GridMode=gridmode;
                this.#Canvas_Info.GridQuantity=value;
                this.#Canvas_Info.smGridSize=(this.#Element.width/this.#Canvas_Info.GridQuantity)/5;
            break;
            case ECGGridCanvasElement.ObjGridMode.FixedGridQuantity_H:
                this.#Canvas_Info.GridMode=gridmode;
                this.#Canvas_Info.GridQuantity=value;
                this.#Canvas_Info.smGridSize=(this.#Element.height/this.#Canvas_Info.GridQuantity)/5;
            break;
            default:
                return false;
        }
        return true;
    }

    SetCanvasSize = (Width, Height) => {
        this.#Element.width  = Width;
        this.#Element.height = Height;
        console.log('this.#Canvas_Info.GridMode',this.#Canvas_Info.GridMode);
        switch(this.#Canvas_Info.GridMode){
            case ECGGridCanvasElement.ObjGridMode.FixedGridQuantity_W:
                this.#Canvas_Info.smGridSize=(this.#Element.width/this.#Canvas_Info.GridQuantity)/5;
            break;
            case ECGGridCanvasElement.ObjGridMode.FixedGridQuantity_H:
                this.#Canvas_Info.smGridSize=(this.#Element.height/this.#Canvas_Info.GridQuantity)/5;
            break;
        }
    }

    SetDrawLinePara = (LineColor, LineWidth) => {
        this.#Canvas_Info.Color = LineColor;
        this.#Canvas_Info.LineWidth = LineWidth;
    }
    
    AddEventCallBack = (CallBackMode, CallBackFunc) => {

        switch(CallBackMode){
            case ECGGridCanvasElement.CallBackFuncID.ECGElementMouseMove:    this.Element.addEventListener('mousemove', CallBackFunc);       break;
            case ECGGridCanvasElement.CallBackFuncID.ECGElementMouseDown:    this.Element.addEventListener('mousedown', CallBackFunc);       break;
            case ECGGridCanvasElement.CallBackFuncID.ECGElementMouseUp:      this.Element.addEventListener("mouseup", CallBackFunc);         break;
            default:                                                    return false;
        }
        
        return true;
    }

    Draw = ()=>{
        this.#Elementctx.strokeStyle = this.#Canvas_Info.Color;
        this.#Elementctx.lineWidth = this.#Canvas_Info.LineWidth;

        this.ClearView();

        this.#Elementctx.beginPath();

        // grid Point
        for(let x = this.#Canvas_Info.smGridSize; x <= this.#Element.width; x += this.#Canvas_Info.smGridSize){
            //Top
            for(let y = this.#Element.height/2; y > 0; y -= this.#Canvas_Info.smGridSize){
                this.#Elementctx.strokeRect(x,y,1,1);
                this.#Elementctx.stroke();
            }
            //Botton
            for(let y = this.#Element.height/2; y <= this.#Element.height; y += this.#Canvas_Info.smGridSize){
                this.#Elementctx.strokeRect(x,y,1,1);
                this.#Elementctx.stroke();
            }
            
        }
        this.#Elementctx.closePath();

        this.#Elementctx.beginPath();
        for(let x = 0; x <= this.#Element.width; x += this.#Canvas_Info.smGridSize*5){
            this.#Elementctx.moveTo(x,0.5);
            this.#Elementctx.lineTo(x,this.#Element.height+.5);
            this.#Elementctx.stroke();
        }
        
        for(let y = this.#Element.height/2; y <= this.#Element.height; y += this.#Canvas_Info.smGridSize*5){
            this.#Elementctx.moveTo(0,y+0.5);
            this.#Elementctx.lineTo(this.#Element.width,y+0.5);
            this.#Elementctx.stroke();
        }

        for(let y = this.#Element.height/2; y > 0; y -= this.#Canvas_Info.smGridSize*5){
            this.#Elementctx.moveTo(0,y+0.5);
            this.#Elementctx.lineTo(this.#Element.width,y+0.5);
            this.#Elementctx.stroke();
        }
        this.#Elementctx.closePath();
    }

    ClearView = () => {
        this.#Elementctx.beginPath();
        this.#Elementctx.clearRect(0, 0, this.#Element.width, this.#Element.height);
        this.#Elementctx.closePath();
    }

    GetCanvasInfo(){
        return this.#Canvas_Info;
    }

}

module.exports = {
    ECGGridCanvasElement
}