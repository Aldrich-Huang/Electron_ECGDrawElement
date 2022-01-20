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
        this.#InputIndex = -1;
        this.#InputOverflow = false;
        this.#OutputIndex = 0;
        this.#DataSpace = 1;
    }

    SetDateSpace(Space){
        this.#DataSpace = Space;
    }

    GetSize = ()=>{
        return this.#DataList.length;
    }

    SetData = (Data) =>{
        try{
            if(this.#InputIndex + 1 >= this.#DataList.length){
                this.#InputIndex = 0;
                this.#InputOverflow = true;
                //console.error('SetData: ', this.#InputOverflow)
            }else{
                this.#InputIndex = (this.#InputIndex + 1) % this.#DataList.length;
            }

            this.#DataList[this.#InputIndex] = Data;

        }catch(e){
            return false;
        }
        return true;
    }

    GetData(){
        if(this.#InputOverflow){
            //console.log(this.#OutputIndex + this.#DataSpace,this.#InputIndex + this.#DataList.length);
            if(this.#OutputIndex + this.#DataSpace >= this.#DataList.length){
                if(this.#OutputIndex + this.#DataSpace >= this.#InputIndex + this.#DataList.length){
                    //console.error('this.#OutputIndex + this.#DataSpace >= this.#InputIndex + this.#DataList.length');
                    return -1;
                }
                if(this.#InputOverflow <= 0){
                    //console.error('this.#InputOverflow <= 0');
                    return -1;
                }
                this.#InputOverflow = false;
                //console.error('GetData: ',this.#InputOverflow)
            }
            //console.log('InputIndex: ',this.#InputIndex,', OutputIndex: ',this.#OutputIndex,', DataSpace: ',this.#DataSpace);
            this.#OutputIndex = (this.#OutputIndex + this.#DataSpace) % this.#DataList.length;
            return this.#DataList[this.#OutputIndex];

        }else{
            if(this.#OutputIndex + this.#DataSpace >= this.#InputIndex){
                return -1;
            }
            
            this.#OutputIndex = (this.#OutputIndex + this.#DataSpace) % this.#DataList.length;
            return this.#DataList[this.#OutputIndex];
        }

    }

}

module.exports = {
    ECGDataRegister
}