/**
* Omron's Host Link Master  module.
* @module protocol/hostlink_master
* @author Hector E. Socarras.
* @version 1.0.0
*/


/** Defining protocol constant */
const beginer_char = 0x40 //@
const delimitator_char = 0x0D //CR 
const terminator_char = 0x2A //*

max_length = 124 // first multiline block can have up to 127 bytes due to use beginer char, terminator char and unit number

/**
 * Class for encapsulate the hostlink protocol.
 * 
*/
class HostlinkProtocol {
    
    constructor(){                  
        
    }  

    /**
    * Function to make the command block CIO (Core Input/Output) Area Read  
    * @param {number} unitNo Hostlink unit number in multilink system
    * @param {number} beginningWord first DM word to read, start at 0.
    * @param {number} numberWords number of consecutive words to read.
    * @throws {RangeError} Throw an error if unit number is out 0 t 31 range.
    * @return {Array} Buffer array with frames.
    */
    commandCIOAreaRead(unitNo, beginningWord = 0, numberWords = 1){

        //check range for beginningword
        if (beginningWord < 0 && beginningWord > 6143){
            throw new RangeError("Error at CIO area read, beginning word must be between 0 and 6143")
        }

        if (numberWords < 1 && numberWords > 6144){
            throw new RangeError("Error at CIO area read, number of words must be between 1 and 6144")
        }
        
        let frameArray = [];
        let commandBuffer = this.commandAreaRead(unitNo, 'RR', beginningWord, numberWords);
        
        frameArray.push(commandBuffer);

        return frameArray;
               
    }

    /**
    * Function to make the command block LR Area Read  
    * @param {number} unitNo Hostlink unit number in multilink system
    * @param {number} beginningWord first DM word to read, start at 0.
    * @param {number} numberWords number of consecutive words to read.
    * @throws {RangeError} Throw an error if unit number is out 0 t 31 range.
    * @return {Array} Buffer array with frames.
    */
    commandLRAreaRead(unitNo, beginningWord = 0, numberWords = 1){

        //check range for beginningword
        if (beginningWord < 0 && beginningWord > 199){
            throw new RangeError("Error at LR area read, beginning word must be between 0 and 199")
        }

        if (numberWords < 1 && numberWords > 200){
            throw new RangeError("Error at LR area read, number of words must be between 1 and 200")
        }
        
        let frameArray = [];
        let commandBuffer = this.commandAreaRead(unitNo, 'LR', beginningWord, numberWords);
        
        frameArray.push(commandBuffer);

        return frameArray;
               
    }

    /**
    * Function to make the command block Holding HR Area Read  
    * @param {number} unitNo Hostlink unit number in multilink system
    * @param {number} beginningWord first DM word to read, start at 0.
    * @param {number} numberWords number of consecutive words to read.
    * @throws {RangeError} Throw an error if unit number is out 0 t 31 range.
    * @return {Array} Buffer array with frames.
    */
    commandHRAreaRead(unitNo, beginningWord = 0, numberWords = 1){

        //check range for beginningword
        if (beginningWord < 0 && beginningWord > 511){
            throw new RangeError("Error at HR area read, beginning word must be between 0 and 511")
        }

        if (numberWords < 1 && numberWords > 512){
            throw new RangeError("Error at HR area read, number of words must be between 1 and 512")
        }
        
        let frameArray = [];
        let commandBuffer = this.commandAreaRead(unitNo, 'HR', beginningWord, numberWords);
        
        frameArray.push(commandBuffer);

        return frameArray;
               
    }
    
    //TIMER/COUNTER PV READ – – RC
     /**
    * Function to make the command block Holding RC Area Read  
    * @param {number} unitNo Hostlink unit number in multilink system
    * @param {number} beginningWord first DM word to read, start at 0.
    * @param {number} numberWords number of consecutive words to read.
    * @throws {RangeError} Throw an error if unit number is out 0 t 31 range.
    * @return {Array} Buffer array with frames.
    */
     commandRCAreaRead(unitNo, beginningWord = 0, numberWords = 1){

        //check range for beginningword
        if (beginningWord < 0 && beginningWord > 4095){
            throw new RangeError("Error at CR area read, beginning word must be between 0 and 4095")
        }

        if (numberWords < 1 && numberWords > 512){
            throw new RangeError("Error at HR area read, number of words must be between 1 and 2048")
        }
        
        let frameArray = [];
        let commandBuffer = this.commandAreaRead(unitNo, 'RC', beginningWord, numberWords);
        
        frameArray.push(commandBuffer);

        return frameArray;
               
    }

    /**
    * Function to make the command block DM Area Read  
    * @param {number} unitNo Hostlink unit number in multilink system
    * @param {number} beginningWord first DM word to read, start at 0.
    * @param {number} numberWords number of consecutive words to read.
    * @throws {RangeError} Throw an error if unit number is out 0 t 31 range.
    * @return {Array} Buffer array with frames.
    */
    commandDmAreaRead(unitNo, beginningWord = 0, numberWords = 1){
        
        let frameArray = [];
        let commandBuffer = Buffer.alloc(17);
        commandBuffer[0] = beginer_char;

        
        if (unitNo < 0 && unitNo > 31){
            throw new RangeError("Error Unit Number must be between 0 and 31")
        }

        if (unitNo > 9){
            var strUnitNo = '0' + unitNo.toString(10).toUpperCase()
        }
        else{
            strUnitNo = unitNo.toString(10).toUpperCase()
        }        

        //copy unit number into command buffer
        let bufUnitNo = Buffer.from(strUnitNo, 'ascii');
        bufUnitNo.copy(commandBuffer, 1);

        //copy header into command buffer
        let bufHeader = Buffer.from('RD', 'ascii');
        bufHeader.copy(commandBuffer, 3)

        //copy beginning word into command buffer
        let bufBeginningWord = Buffer.from(beginningWord.toString(10).toUpperCase(), 'ascii');
        bufBeginningWord.copy(commandBuffer, 5)

        //copy number words into command buffer
        let bufNumberWords = Buffer.from(numberWords.toString(10).toUpperCase(), 'ascii');
        bufNumberWords.copy(commandBuffer, 9)

        //copy fcs into command buffer
        fcs = this.calcFCS(commandBuffer.subarray(0, 13))
        bufFCS = Buffer.from(fcs.toString(16).toUpperCase(), 'ascii');
        bufFCS.copy(commandBuffer, 13)

        //Termination charset
        commandBuffer[14] = terminator_char;
        commandBuffer[15] = delimitator_char;

        frameArray.push(commandBuffer);

        return frameArray;
               
    }

    /**
    * Function to make the command block DM Area Write
    * @param {String} wordValues
    * @param {number} unitNo Hostlink address in multilink system
    * @param {number} startRegister first holding register to read, start at 0.
    * @param {number} registerQuantity number of holding register to read.
    * @throws {RangeError} Throw an error if unit number is out 0 t 31 range.
    * @return {array} array of command buffer.
    */
    commandDmAreaW(wordValues, unitNo, beginningWord = 0){
        
        let commandBufferArray = [];
        let valuesArray = []

        /**
         * When the frame is greater than allowed frame size the the command block
         * must be splitten in several frames.
         * first frame can have a maz length of 131 char that is equivalent to 122 chars in text field length
         * the rest of frame must have 128 char max that is equivalent to 124 chars in text field length
         */
        if (wordValues.length > 118) {

            valuesArray.push(wordValues.slice(0, 118));     //first frame include four bytes from begin word
            let restValues = wordValues.slice(118)

            while (restValues.length > 124){
                valuesArray.push(restValues.slice(0, 124));
                restValues = wordValues.slice(124)
            }
            valuesArray.push(wordValues.slice(0));
        }

        if (valuesArray.length > 1){

            for (i = 0; i < valuesArray.length; i++){
                
            }

        }
        else{
            frameLength = valuesArray[0].length + 9
            commandBuffer = Buffer.alloc(frameLength)
            commandBuffer[0] = beginer_char;

             //copy unit number into command buffer
            let bufUnitNo = Buffer.from(unitNo.toString(10).toUpperCase(), 'ascii');
            bufUnitNo.copy(commandBuffer, 1);

            //copy header into command buffer
            let bufHeader = Buffer.from('WD', 'ascii');
            bufHeader.copy(commandBuffer, 3)

            //copy beginning word into command buffer
            let bufBeginningWord = Buffer.from(beginningWord.toString().toUpperCase(), 'ascii');
            bufBeginningWord.copy(commandBuffer, 5)

            let bufWriteData = Buffer.from(valuesArray[0].toUpperCase(), 'ascii')
            bufWriteData.copy(commandBuffer, 7)

            //copy fcs into command buffer
            fcs = this.calcFCS(commandBuffer.subarray(0, frameLength - 4))
            buFCS = Buffer.from(fcs.toString(16).toUpperCase(), 'ascii');
            buFCS.copy(commandBuffer, frameLength - 4)

            commandBuffer[frameLength - 2] = terminator_char;
            commandBuffer[frameLength - 1] = delimitator_char;

            commandBufferArray.push(commandBuffer)
        }
       

        return commandBufferArray;
               
    }

    /**
    * Calculate the FCS from text in hostlink frame.
    * @param {Buffer} bufText .
    * @return {number} the FCS.
    */
    calcFCS(bufText){

        
        var  byteFCS;        

        for(var i = 0; i < bufText.length; i++){
            byteFCS = byteFCS ^ bufText[i];
        }
        return byteFCS;

    }

    /**
    * Utilitary function to create the command block for Area Read.  
    * @param {number} unitNo Hostlink unit number in multilink system.
    * @param {String} header Two char string with comand header.
    * @param {number} beginningWord first DM word to read, start at 0.
    * @param {number} numberWords number of consecutive words to read.
    * @throws {RangeError} Throw an error if unit number is out 0 t 31 range.
    * @return {Buffer} comand frame.
    */
    commandAreaRead(unitNo, header, beginningWord = 0, numberWords = 1){        
       
        let commandBuffer = Buffer.alloc(17);
        commandBuffer[0] = beginer_char;

        
        if (unitNo < 0 && unitNo > 31){
            throw new RangeError("Error Unit Number must be between 0 and 31")
        }

        if (unitNo > 9){
            var strUnitNo = '0' + unitNo.toString(10).toUpperCase()
        }
        else{
            strUnitNo = unitNo.toString(10).toUpperCase()
        }        

        //copy unit number into command buffer
        let bufUnitNo = Buffer.from(strUnitNo, 'ascii');
        bufUnitNo.copy(commandBuffer, 1);

        //copy header into command buffer
        let bufHeader = Buffer.from(header, 'ascii');
        bufHeader.copy(commandBuffer, 3)

        //copy beginning word into command buffer
        let bufBeginningWord = Buffer.from(beginningWord.toString(10).toUpperCase(), 'ascii');
        bufBeginningWord.copy(commandBuffer, 5)

        //copy number words into command buffer
        let bufNumberWords = Buffer.from(numberWords.toString(10).toUpperCase(), 'ascii');
        bufNumberWords.copy(commandBuffer, 9)

        //copy fcs into command buffer
        fcs = this.calcFCS(commandBuffer.subarray(0, 13))
        bufFCS = Buffer.from(fcs.toString(16).toUpperCase(), 'ascii');
        bufFCS.copy(commandBuffer, 13)

        //Termination charset
        commandBuffer[14] = terminator_char;
        commandBuffer[15] = delimitator_char;

        return commandBuffer;
               
    }

    
}
    

module.exports = HostlinkProtocol;
