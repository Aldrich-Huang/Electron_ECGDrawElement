
const ECGDrawElementClass = require('./ECGDrawElement.js').ECGDrawElement;

class ECGDrawElementCtrl{
    static ObjGridMode = {'FixedGridSize': ECGDrawElementClass.ObjGridMode.FixedGridSize,
                        'FixedGridQuantity_W': ECGDrawElementClass.ObjGridMode.FixedGridQuantity_W}

    static ObjElementMode = ECGDrawElementClass.ObjElementMode;
    static ObjGainItem = ECGDrawElementClass.ObjGainItem;
    DrawElementList=[];
    IntervalID;
    #ECGDataListIndex = 0;
    #ECGDataList=[];

    constructor(ElementInfo, GridColor = '#999999', GridWidth = 1, ECGColor = '#00c100', ECGWidth = 2) {
        var Index=0;

        for(var i = 0 ;i<ElementInfo.length;i++){
            try{
                
                if( !this.#CheckIDisLive(ElementInfo[i].MainWin))
                    throw "ECGDrawElementCtrl Error: The component does not exist or the ID is wrong ";

                this.DrawElementList.push(new ECGDrawElementClass(ElementInfo[i].MainWin));

                Index = this.DrawElementList.length-1;
                this.DrawElementList[Index].AddEventCallBack( ECGDrawElementClass.CallBackFuncID.ECGElementMouseMove, this.#CallBack_ECGEleMouseMove);
                this.DrawElementList[Index].AddEventCallBack( ECGDrawElementClass.CallBackFuncID.WindowResize, this.#CallBack_WindowResize);
                //this.DrawElementList[Index].SetCanvasPara(10,1.5,0.2,0.1);
                //this.DrawElementList[Index].SetRegisterPara(500,20);
                this.DrawElementList[Index].SetDrawGridPara(GridColor,GridWidth);
                this.DrawElementList[Index].SetDrawECGPara(ECGColor,ECGWidth);
                
            }catch (e){
                console.error(e);
            }
            
        }

    }

//Drawing grid unit.
    SetAllGridCanvasPara = (Sec,mV,smSec,smmV)=>{
        for(var i = 0 ;i<this.DrawElementList.length;i++){
            this.DrawElementList[i].SetCanvasPara(Sec,mV,smSec,smmV);
        }
        
    }

    SetGridCanvasPara = (Sec,mV,smSec,smmV)=>{
        for(var i = 0 ;i<this.DrawElementList.length;i++){
            if(this.DrawElementList[i].GetWinInfo().Id === ElementId){
                this.DrawElementList[i].SetCanvasPara(Sec,mV,smSec,smmV);
            }
        }
        
    }

    SetECGRegisterPara = (ResolutionOfSec, Sec)=>{
        for(var i = 0 ;i<this.DrawElementList.length;i++){
            this.DrawElementList[i].SetRegisterPara(ResolutionOfSec, Sec);
        }

    }

    SetDrawGridPara = (GridColor,GridWidth)=>{
        for(var i = 0 ;i<this.DrawElementList.length;i++){
            this.DrawElementList[Index].SetDrawGridPara(GridColor,GridWidth);
        }

    }

    SetDrawECGPara = (ECGColor,ECGWidth)=>{
        for(var i = 0 ;i<this.DrawElementList.length;i++){
            this.DrawElementList[Index].SetDrawECGPara(ECGColor,ECGWidth);
        }

    }

    SetGain = (gain)=>{
        for(var i = 0 ;i<this.DrawElementList.length;i++){
            this.DrawElementList[i].SetGain(gain);
        }
    }

    GetElementIDList = ()=>{
        var ElementIdList = [];
        for(var i = 0 ;i<this.DrawElementList.length;i++){
            var ElementInfo = this.DrawElementList[i].WinId;
            ElementIdList.push(this.DrawElementList[i].WinId);
        }
        return ElementIdList;
    }

    SetDrawMode(ElementMode){
        for(var i = 0 ;i<this.DrawElementList.length;i++){
            this.DrawElementList[i].SetDrawMode(ElementMode);
        }
    }

    //Set ECG Data.
    SetECGData = (DataList)=>{
        for(var i = 0 ;i<this.DrawElementList.length;i++){
            this.DrawElementList[i].SetECGData(DataList[i])
        }
    }

    //Draw grid.
    DrawGrid(ElementId){
        for(var i = 0 ;i<this.DrawElementList.length;i++){
            if(ElementId==null || this.DrawElementList[i].GetWinInfo().Id === ElementId){
                this.DrawElementList[i].DrawGrid();
            }
        }
    }

    //Draw ECG.
    StartDrawECG = (ElementId)=>{
        for(var i = 0 ;i<this.DrawElementList.length;i++){
            if(ElementId==null || this.DrawElementList[i].GetWinInfo().Id === ElementId){
                this.DrawElementList[i].StartDrawECG();
            }
        }
        
    }


//----------------------------------------------------------------------
    #CallBack_ECGEleMouseMove = (id,postion)=>{
        return new Promise((acc, rej) => {
            if(this.DrawElementList.length<0)
                rej(false);

            for(var i = 0 ;i<this.DrawElementList.length;i++){
                if(this.DrawElementList[i].GetWinInfo().id!=id){
                    this.DrawElementList[i].SetWinPosition(postion);
                }
            }
            acc(true);
        });
    }

    #CallBack_WindowResize =(id,ElementInfo) => {

    }

    #CheckIDisLive = (id)=>{
        if( document.getElementById(id))
            return true;
        else
            return false;
    }

}

module.exports = {
    ECGDrawElementCtrl
}