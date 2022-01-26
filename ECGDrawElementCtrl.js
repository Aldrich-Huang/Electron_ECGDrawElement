
const ECGDrawElementClass = require('./ECGDrawElement.js').ECGDrawElement;

class ECGDrawElementCtrl{
    static ObjGridMode = {'FixedGridSize': ECGDrawElementClass.ObjGridMode.FixedGridSize,
                        'FixedGridQuantity_W': ECGDrawElementClass.ObjGridMode.FixedGridQuantity_W}

    static ObjElementMode = ECGDrawElementClass.ObjElementMode;
    
    DrawElementList=[];
    IntervalID;
    #ECGDataListIndex = 0;
    #ECGDataList=[];
    constructor(ElementInfo, GridColor,GridWidth,ECGColor,ECGWidth) {
        var Index=0;

        for(var i = 0 ;i<ElementInfo.length;i++){
            try{
                
                if( !this.#CheckIDisLive(ElementInfo[i].MainWin))
                    throw "ECGDrawElementCtrl Error: The component does not exist or the ID is wrong ";

                this.DrawElementList.push(new ECGDrawElementClass(ElementInfo[i].MainWin));

                Index = this.DrawElementList.length-1;
                this.DrawElementList[Index].AddEventCallBack( ECGDrawElementClass.CallBackFuncID.ECGElementMouseMove, this.#CallBack_ECGEleMouseMove);
                this.DrawElementList[Index].AddEventCallBack( ECGDrawElementClass.CallBackFuncID.WindowResize, this.#CallBack_WindowResize);
                this.DrawElementList[Index].SetCanvasPara(10,1.5,0.2,0.1);
                //this.DrawElementList[Index].SetGridMode(ECGDrawElementCtrl.ObjGridMode.FixedGridQuantity_W, 10);
                this.DrawElementList[Index].SetDrawGridPara(GridColor,GridWidth);
                this.DrawElementList[Index].SetDrawECGPara(ECGColor,ECGWidth);
                this.DrawElementList[Index].DrawGrid();
                //this.DrawElementList[Index].SetGain(ECGDrawElementClass.ObjGainItem['Gain_4.0']);
            }catch (e){
                console.error(e);
            }
            
        }

    }

    SetECGTest = (Data)=>{
        this.DrawElementList[0].SetECGData(Data);
    }

    GetElementIDList = ()=>{
        var ElementIdList = [];
        for(var i = 0 ;i<this.DrawElementList.length;i++){
            var ElementInfo = this.DrawElementList[i].WinId;
            ElementIdList.push(this.DrawElementList[i].WinId);
        }
        return ElementIdList;
    }

    SetDrawMode(ElementId,ElementMode){
        for(var i = 0 ;i<this.DrawElementList.length;i++){
            if(ElementId==null || this.DrawElementList[i].GetWinInfo().Id === ElementId){
                this.DrawElementList[i].SetDrawMode(ElementMode);
            }
        }
        
    }

    SetECGData = (ElementId,Data)=>{
        for(var i = 0 ;i<this.DrawElementList.length;i++){
            if(ElementId==null || this.DrawElementList[i].GetWinInfo().Id === ElementId){
                this.DrawElementList[i].SetECGData(Data)
            }
        }
    }

    StartDrawECG = (ElementId)=>{
        for(var i = 0 ;i<this.DrawElementList.length;i++){
            if(ElementId==null || this.DrawElementList[i].GetWinInfo().Id === ElementId){
                this.DrawElementList[i].StartDrawECG();
            }
        }
        
    }


    // SetGeidParameter = (GridColor,GridWidth,Setid=null)=>{
    //     return new Promise((acc, rej) => {
    //         if(this.DrawElementList.length<0){
    //             rej(false);
    //         }
                
    //         for(var i = 0 ;i<this.DrawElementList.length;i++){
    //             if(Setid==null || this.DrawElementList[i].GetWinInfo().Id === Setid){
    //                 console.log('Setid',Setid);
    //                 this.DrawElementList[Index].SetDrawGridPara(GridColor,GridWidth);
    //                 this.DrawElementList[i].DrawGrid();

    //             }
    //         }
            
    //         acc(true);
    //     });
    // }

    // SetGridSize = (GridSize,Setid=null)=>{
    //     return new Promise((acc, rej) => {
    //         if(this.DrawElementList.length<0){
    //             rej(false);
    //         }
                
    //         for(var i = 0 ;i<this.DrawElementList.length;i++){
    //             if(Setid==null || this.DrawElementList[i].GetWinInfo().Id === Setid){
    //                 console.log('Setid',Setid);
    //                 this.DrawElementList[Index].SetGridSize(GridSize);
    //                 this.DrawElementList[i].DrawGrid();

    //             }
    //         }
            
    //         acc(true);
    //     });
    // }

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