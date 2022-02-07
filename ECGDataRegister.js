// -----------------------------------------------------------------------------------------------------
//     *File Name: ECGDataRegister.js
//     *Author:    Ken Huang.
//     *Date:      2022.01.19
//     *Version:   1.0.0
//     *explanation:
//         -Private Variable: 
//              =>#DataList: 
//                  *) Function: Remenber ECG Data.
//              =>#InputIndex:
//                  *) Function: Input index number.
//              =>#InputOverflow: 
//                  *) Function: Whether the InputIndex is back to the origin.
//              =>#OutputIndex: 
//                  *) Function: Output index number.
//              =>#DataSpace: 
//                  *) Function: Intercept output data spacing.
//
//         -public function:
//              =>SetDateSpace()
//                  *) Input: output data spacing.
//                  *) Output: Null.
//                  *) Function: The interval setting of the data obtained by the user.  
//              =>GetSize
//                  *) Input: Null.
//                  *) Output: List Size.
//                  *) Function: Get data array size.
//              =>SetData
//                  *) Input: ECG Data.
//                  *) Output: If the setting is successful, the return is true. If it fails, the return is false.
//                  *) Function: Input ECG data in list.
//              =>GetData
//                  *) Input: Null.
//                  *) Output: If the getting is successful, the return is ECG data. If it fails, the return is -1.
//                  *) Function: Get fixed data spacing.
// -------------------------------------------------------------------------------------------------------

class ECGDataRegister{
    #DataList;
    #InputIndex;
    #InputOverflow;
    #OutputIndex;
    #DataSpace;

    constructor(ListSize) {
        this.#DataList = new Array(ListSize);
        console.log('this.#DataList=>>>>',this.#DataList)
        this.#InputIndex = 0;
        this.#InputOverflow = false;
        this.#OutputIndex = -1;
    }



    GetSize = ()=>{
        return this.#DataList.length;
    }

    SetData = (Data) =>{
        
        this.#DataList[this.#InputIndex] = Data;

        if(this.#InputIndex + 1 >= this.#DataList.length){
            this.#InputIndex = 0;
            this.#InputOverflow = true;
        }else{
            this.#InputIndex = (this.#InputIndex + 1) % this.#DataList.length;
        }

        return true;
    }

    GetData(){
        var Result = {'state':false,'Index': -1,'ECGData':-1}
        if(this.#InputOverflow){
            if(this.#OutputIndex + 1 >= this.#DataList.length){
                if(this.#OutputIndex + 1 >= this.#InputIndex + this.#DataList.length){
                    return Result;
                }
                if(this.#InputOverflow <= 0){
                    return Result;
                }
                this.#InputOverflow = false;
            }
            this.#OutputIndex = (this.#OutputIndex + 1) % this.#DataList.length;

            Result.state = true;
            Result.Index = this.#OutputIndex;
            Result.ECGData = this.#DataList[this.#OutputIndex];
            
            return Result;

        }else{
            if(this.#OutputIndex + 1 >= this.#InputIndex){
                return Result;
            }
            this.#OutputIndex = (this.#OutputIndex + 1) % this.#DataList.length;
            
            Result.state = true;
            Result.Index = this.#OutputIndex;
            Result.ECGData = this.#DataList[this.#OutputIndex];
            
            return Result;
        }

    }

    GetDatas = (Quantity)=>{
        var ECGDataList = [];
        for(var indx = (this.#InputIndex + 1)-Quantity<0? this.#DataList.length + (this.#InputIndex + 1)-Quantity : (this.#InputIndex + 1), Stop = this.#InputIndex; indx != Stop; indx = (indx + 1)% this.#DataList.length){
            ECGDataList.push(this.#DataList[indx]);
        }
        return ECGDataList;
    }

    //-----
    Resize(NewSize){
        if(NewSize>this.GetSize()){
            while(NewSize > this.GetSize())
                this.#DataList.push(0);
        }else if(NewSize < this.GetSize()){
            this.#DataList.length = NewSize;
        }
        console.log('this.#DataList.length',this.#DataList.length)
        this.#InputIndex = -1;
        this.#InputOverflow = false;
        this.#OutputIndex = -1;
    }
}

module.exports = {
    ECGDataRegister
}