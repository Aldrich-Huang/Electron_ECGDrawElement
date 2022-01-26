




class ECGBoundaryCheck{

    #objBoundary={'Maximum':-1,'Minimum':-1};

    #ChannExtremumArr;
    #ChannelSize;
    #Overlap;
    #CHMF;


    constructor() {

        
        this.#CHMF = false;
    }

    SetBoundaryInfo = (max,min)=>{
        this.objBoundary.Maximum = max;
        this.objBoundary.Minimum = min;
    }

    GetBundaryInfo = ()=>{
        return objBoundary;
    }

    SetChannelSize = (channelsize)=>{
        this.#ChannelSize = channelsize;

        if(this.#Overlap != undefined)
            delete this.#Overlap;
            this.#Overlap
        
        this.#Overlap = new Array(this.#ChannelSize);
        this.#CHMF = false;
    }

    Start = ()=>{
        var OverlapTotle = 0;
        
        

        for(var ChannelIndex = 0; ChannelIndex < this.#ChannelSize; ChannelIndex++){
            switch(ChannelIndex){
                case 0:
                    this.#Overlap[ChannelIndex] = this.#ChannExtremumArr[ChannelIndex].max - this.objBoundary.Maximum;
                break;
                case: (channelsize-1):
                    this.#Overlap[ChannelIndex] = (this.#ChannExtremumArr[ChannelIndex].max - this.#ChannExtremumArr[ChannelIndex].min) + (this.objBoundary.Maximum - this.#ChannExtremumArr[ChannelIndex].max);
                    break;
                default:
                    this.#Overlap[ChannelIndex] = (this.#ChannExtremumArr[ChannelIndex].max - this.#ChannExtremumArr[ChannelIndex-1].min)
                    break;
            }
            OverlapTotle = OverlapTotle + this.#Overlap[ChannelIndex];
            this.#CHMF = this.#Overlap[ChannelIndex] < 0 ? true : false;            
        }

        if(!this.#CHMF)
            return false;

        var Offset = new Array(this.#ChannelSize);
        var OverLapAverage = 0;

        OverLapAverage = OverlapTotle / this.#ChannelSize;

        if()


    }

}

module.exports = {
    ECGBoundaryCheck
}