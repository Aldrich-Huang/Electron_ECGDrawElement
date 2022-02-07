

class ECGBasicLineCorrection{
    #Total;
    #Quantity;
    constructor() {
        this.Clear();
    }

    SetData = (ECGData)=>{
        this.#Total =this.#Total + ECGData;
        this.#Quantity = this.#Quantity + 1;
    }

    GetBasicLine = ()=>{
        return this.#Total / this.#Quantity;
    }

    Clear = ()=>{
        this.#Total = 0;
        this.#Quantity = 0;
    }
}

module.exports = {
    ECGBasicLineCorrection
}