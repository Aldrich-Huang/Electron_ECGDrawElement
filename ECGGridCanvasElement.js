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
    static ObjGridMode = {'FixedGridSize':10,'FixedGridQuantity_W':11, 'FixedGridQuantity_H':12,'FixedGridQuantity_ALL':13}

    #Canvas_GridInfo = {'Color': '#999999', 'LineWidth': 1};
    #Canvas_TitleTextInfo = {'TitleTextColor':'#ffffff','TitleTextSize':'25px','TitleTextFont':'Century','Title':'I','TitleDistance_X':0.5,'TitleDistance_Y':1}
    #Canvas_Info = {'GridMode': ECGGridCanvasElement.ObjGridMode.FixedGridSize, 'smGridSize': 5};
    #SymmVText;

    #Element;
    #Elementctx;
    
    constructor(ElementID) {

        this.#Element = document.getElementById(ElementID);
        this.#CSSCtrl_Element();
        if(this.#Element.getContext){
            this.#Elementctx = this.#Element.getContext('2d');
        }

    }
/*
    SetGridMode = (gridmode, value, value2=undefined)=>{
        switch(gridmode){
            case ECGGridCanvasElement.ObjGridMode.FixedGridSize:
                this.#Canvas_Info.GridMode=gridmode;
                this.#Canvas_Info.smGridSize=value;
                this.#Canvas_Info.WidthGridQuantity=-1;
            break;
            case ECGGridCanvasElement.ObjGridMode.FixedGridQuantity_W:
                this.#Canvas_Info.GridMode=gridmode;
                this.#Canvas_Info.WidthGridQuantity=value;
                this.#Canvas_Info.smGridSize=(this.#Element.width/(this.#Canvas_Info.WidthGridQuantity+0.6))/5;
            break;
            case ECGGridCanvasElement.ObjGridMode.FixedGridQuantity_H:
                this.#Canvas_Info.GridMode=gridmode;
                this.#Canvas_Info.HeightGridQuantity=value;
                this.#Canvas_Info.smGridSize=(this.#Element.height/this.#Canvas_Info.HeightGridQuantity)/5;
            break;
            case ECGGridCanvasElement.ObjGridMode.FixedGridQuantity_ALL:
            
                //break;
            default:
                return false;
        }
        return true;
    }*/

    SetCanvasSize = (Width, Height) => {        
        this.#Element.width  = Width;
        this.#Element.height = Height;
    }

    SetsmGridSize = (gridsize)=>{
        this.#Canvas_Info.smGridSize=gridsize;
    }

    SetDrawLinePara = (LineColor, LineWidth) => {
        this.#Canvas_GridInfo.Color = LineColor;
        this.#Canvas_GridInfo.LineWidth = LineWidth;
    }

    SetDrawTitleTextPara = (textcolor, textsize, textfont,distance_x,distance_y) => {
        this.#Canvas_TitleTextInfo.TitleTextColor = textcolor;
        this.#Canvas_TitleTextInfo.TitleTextSize = textsize;
        this.#Canvas_TitleTextInfo.TitleTextFont = textfont;
        this.#Canvas_TitleTextInfo.TitleDistance_X = distance_x;
        this.#Canvas_TitleTextInfo.TitleDistance_Y = distance_y;
    }

    SetTitleText=(title)=>{
        this.#Canvas_TitleTextInfo.Title = title;
    }

    SetSymmVText = (mv)=>{
        this.#SymmVText = mv+'mV';
        this.Draw();
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
        this.#Elementctx.strokeStyle = this.#Canvas_GridInfo.Color;
        this.#Elementctx.lineWidth = this.#Canvas_GridInfo.LineWidth;
        
        this.ClearView();

        this.#DrawSmGrid(this.#Canvas_Info.smGridSize,this.#Element.width,0,this.#Element.height);

        this.#DrawVerticalLine (this.#Canvas_Info.smGridSize*3, this.#Element.width, this.#Canvas_Info.smGridSize*5);

        this.#DrawParallelLine(0, this.#Element.height, this.#Canvas_Info.smGridSize*5);

        this.#DrawSym();

        this.#DrawTitleText();

        //this.#Elementctx.beginPath();
        // // grid Point
        // for(let x = this.#Canvas_Info.smGridSize; x <= this.#Element.width; x += this.#Canvas_Info.smGridSize){
        //     //Top
        //     for(let y = this.#Element.height/2; y > 0; y -= this.#Canvas_Info.smGridSize){
        //         this.#Elementctx.strokeRect(x,y,1,1);
        //         this.#Elementctx.stroke();
        //     }
        //     //Botton
        //     for(let y = this.#Element.height/2; y <= this.#Element.height; y += this.#Canvas_Info.smGridSize){
        //         this.#Elementctx.strokeRect(x,y,1,1);
        //         this.#Elementctx.stroke();
        //     }
            
        // }
        // this.#Elementctx.closePath();
        

        //this.#Elementctx.beginPath();
        // for(let x = this.#Canvas_Info.smGridSize*3; x <= this.#Element.width; x += this.#Canvas_Info.smGridSize*5){
        //     this.#Elementctx.moveTo(x,0.5);
        //     this.#Elementctx.lineTo(x,this.#Element.height+.5);
        //     this.#Elementctx.stroke();
        // }
        // for(let y = this.#Element.height/2; y <= this.#Element.height; y += ){
        //     this.#Elementctx.moveTo(0,y+0.5);
        //     this.#Elementctx.lineTo(this.#Element.width,y+0.5);
        //     this.#Elementctx.stroke();
        // }
        // for(let y = this.#Element.height/2; y > 0; y -= this.#Canvas_Info.smGridSize*5){
        //     this.#Elementctx.moveTo(0,y+0.5);
        //     this.#Elementctx.lineTo(this.#Element.width,y+0.5);
        //     this.#Elementctx.stroke();
        // }
        // this.#Elementctx.closePath();

        
        // this.#Elementctx.fillStyle = "#00c100";
        // this.symbleUnit = Math.floor(this.#Canvas_Info.smGridSize/2);
        // this.#Elementctx.fillRect(this.symbleUnit, this.#Element.height/2, this.symbleUnit * 2, this.symbleUnit * -1);
        // this.#Elementctx.fillRect(this.symbleUnit * 2, this.#Element.height/2 , this.symbleUnit * 1, this.#Canvas_Info.smGridSize * -1 * 10);
        // this.#Elementctx.fillRect(this.symbleUnit * 2, this.#Element.height/2 - this.#Canvas_Info.smGridSize * 9.5 , this.symbleUnit * 3, this.symbleUnit * -1);
        // this.#Elementctx.fillRect(this.symbleUnit * 4, this.#Element.height/2 - (this.#Canvas_Info.smGridSize * 10), this.symbleUnit * 1, this.#Canvas_Info.smGridSize * 10);
        // this.#Elementctx.fillRect(this.symbleUnit * 4, this.#Element.height/2, this.symbleUnit * 2, this.symbleUnit * -1);


        // this.#Elementctx.font = 'Bold '+this.#Canvas_Info.smGridSize*1.2 + 'px Arial'
        // this.#Elementctx.fillStyle="#00c100"
        // this.#Elementctx.textAlign = "left";
        // this.#Elementctx.textBaseline = "top";
        // this.#Elementctx.fillText('1mv', this.symbleUnit , this.#Element.height/2 + this.symbleUnit)


        

        // this.#Elementctx.font = this.#Canvas_TitleTextInfo.TitleTextSize+' '+this.#Canvas_TitleTextInfo.TitleTextFont
        // this.#Elementctx.fillStyle=this.#Canvas_TitleTextInfo.TitleTextColor
        // this.#Elementctx.textAlign = "left";
        // this.#Elementctx.textBaseline = "top";
        // this.#Elementctx.fillText(this.#Canvas_TitleTextInfo.Title, Math.round(this.#Canvas_Info.smGridSize * this.#Canvas_TitleTextInfo.TitleDistance_X), Math.round(this.#Canvas_Info.smGridSize * this.#Canvas_TitleTextInfo.TitleDistance_Y))  //填滿文字
    }

    ClearView = () => {
        this.#Elementctx.beginPath();
        this.#Elementctx.clearRect(0, 0, this.#Element.width, this.#Element.height);
        this.#Elementctx.closePath();
    }

    GetCanvasInfo(){
        return this.#Canvas_Info;
    }

//----------------------------------------------------------------------------------------------------------
    #CSSCtrl_Element = ()=>{
        this.#Element.style['position'] = 'absolute'
    }

    #DrawSmGrid = (startX,endX,startY,endY)=>{
        this.#Elementctx.beginPath();
        
        // grid Point
        for(let x = startX; x <= endX; x += this.#Canvas_Info.smGridSize){
            //Top
            for(let y = this.#Element.height/2; y > startY; y -= this.#Canvas_Info.smGridSize){
                this.#Elementctx.strokeRect(x,y,1,1);
                this.#Elementctx.stroke();
            }
            //Botton
            for(let y = this.#Element.height/2; y <= endY; y += this.#Canvas_Info.smGridSize){
                this.#Elementctx.strokeRect(x,y,1,1);
                this.#Elementctx.stroke();
            }
            
        }
        this.#Elementctx.closePath();

    }

    #DrawVerticalLine = (start,end,distance)=>{
        this.#Elementctx.beginPath();

        for(let x = start; x <= end; x += distance){
            this.#Elementctx.moveTo(x,0.5);
            this.#Elementctx.lineTo(x,this.#Element.height+.5);
            this.#Elementctx.stroke();
        }

        this.#Elementctx.closePath();
    }

    #DrawParallelLine = (start,end,distance)=>{
        this.#Elementctx.beginPath();

        for(let y = this.#Element.height/2; y <= end; y += distance){
            this.#Elementctx.moveTo(0,y+0.5);
            this.#Elementctx.lineTo(this.#Element.width,y+0.5);
            this.#Elementctx.stroke();
        }

        for(let y = this.#Element.height/2; y > start; y -= distance){
            this.#Elementctx.moveTo(0,y+0.5);
            this.#Elementctx.lineTo(this.#Element.width,y+0.5);
            this.#Elementctx.stroke();
        }
        this.#Elementctx.closePath();
    }

    #DrawTitleText(){
        this.#Elementctx.font = this.#Canvas_TitleTextInfo.TitleTextSize+' '+this.#Canvas_TitleTextInfo.TitleTextFont
        this.#Elementctx.fillStyle=this.#Canvas_TitleTextInfo.TitleTextColor
        this.#Elementctx.textAlign = "left";
        this.#Elementctx.textBaseline = "top";
        
        this.#Elementctx.fillText(this.#Canvas_TitleTextInfo.Title, Math.round(this.#Canvas_Info.smGridSize * this.#Canvas_TitleTextInfo.TitleDistance_X), Math.round(this.#Canvas_Info.smGridSize * this.#Canvas_TitleTextInfo.TitleDistance_Y))  //填滿文字
    }

    #DrawSym(){
        this.#Elementctx.fillStyle = "#00c100";
        this.symbleUnit = Math.floor(this.#Canvas_Info.smGridSize/2);
        this.#Elementctx.fillRect(this.symbleUnit, this.#Element.height/2, this.symbleUnit * 2, this.symbleUnit * -1);
        this.#Elementctx.fillRect(this.symbleUnit * 2, this.#Element.height/2 , this.symbleUnit * 1, this.#Canvas_Info.smGridSize * -1 * 10);
        this.#Elementctx.fillRect(this.symbleUnit * 2, this.#Element.height/2 - this.#Canvas_Info.smGridSize * 9.5 , this.symbleUnit * 3, this.symbleUnit * -1);
        this.#Elementctx.fillRect(this.symbleUnit * 4, this.#Element.height/2 - (this.#Canvas_Info.smGridSize * 10), this.symbleUnit * 1, this.#Canvas_Info.smGridSize * 10);
        this.#Elementctx.fillRect(this.symbleUnit * 4, this.#Element.height/2, this.symbleUnit * 2, this.symbleUnit * -1);

        this.#Elementctx.font = 'Bold '+this.#Canvas_Info.smGridSize*1.2 + 'px Arial'
        this.#Elementctx.fillStyle="#00c100"
        this.#Elementctx.textAlign = "left";
        this.#Elementctx.textBaseline = "top";
        this.#Elementctx.fillText(this.#SymmVText, this.symbleUnit , this.#Element.height/2 + this.symbleUnit)
    }

}

module.exports = {
    ECGGridCanvasElement
}