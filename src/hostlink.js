/**
* Omron's Host Link Master  module.
* @module protocol/hostlink_master
* @author Hector E. Socarras.
* @version 1.0.0
*/

const utils = require('./utils');

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
    * Function to make the command block Timer/Counter PV Read  
    * @param {number} unitNo Hostlink unit number in multilink system
    * @param {number} beginningWord first DM word to read, start at 0.
    * @param {number} numberWords number of consecutive words to read.
    * @throws {RangeError} Throw an error if unit number is out 0 t 31 range.
    * @return {Array} Buffer array with frames.
    */
    commandTCPvRead(unitNo, beginningWord = 0, numberWords = 1){

        //check range for beginningword
        if (beginningWord < 0 && beginningWord > 4095){
            throw new RangeError("Error at RC area read, beginning word must be between 0 and 4095")
        }

        if (numberWords < 1 && numberWords > 2048){
            throw new RangeError("Error at RC area read, number of words must be between 1 and 2048")
        }
        
        let frameArray = [];
        let commandBuffer = this.commandAreaRead(unitNo, 'RC', beginningWord, numberWords);
        
        frameArray.push(commandBuffer);

        return frameArray;
               
    }

    //TIMER/COUNTER Status READ – – RG
    /**
    * Function to make the command block Timer/Counter Status RG Read  
    * @param {number} unitNo Hostlink unit number in multilink system
    * @param {number} beginningWord first DM word to read, start at 0.
    * @param {number} numberWords number of consecutive words to read.
    * @throws {RangeError} Throw an error if unit number is out 0 t 31 range.
    * @return {Array} Buffer array with frames.
    */
    commandTCStatusRead(unitNo, beginningWord = 0, numberWords = 1){

        //check range for beginningword
        if (beginningWord < 0 && beginningWord > 4095){
            throw new RangeError("Error at Timer/Counter area read, beginning word must be between 0 and 4095")
        }

        if (numberWords < 1 && numberWords > 2048){
            throw new RangeError("Error at Timer/Counter area read, number of words must be between 1 and 2048")
        }
        
        let frameArray = [];
        let commandBuffer = this.commandAreaRead(unitNo, 'RG', beginningWord, numberWords);
        
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
        
        //check range for beginningword
        if (beginningWord < 0 && beginningWord > 9999){
            throw new RangeError("Error at DM area read, beginning word must be between 0 and 9999")
        }

        if (numberWords < 1 && numberWords > 9999){
            throw new RangeError("Error at DM area read, number of words must be between 1 and 9999")
        }

        let frameArray = [];
        let commandBuffer = this.commandAreaRead(unitNo, 'RD', beginningWord, numberWords);
        
        frameArray.push(commandBuffer);

        return frameArray;
               
    }

    //Auxiliary Area READ – – RJ
    /**
    * Function to make the command block Auxiliary AR Area Read  
    * @param {number} unitNo Hostlink unit number in multilink system
    * @param {number} beginningWord first DM word to read, start at 0.
    * @param {number} numberWords number of consecutive words to read.
    * @throws {RangeError} Throw an error if unit number is out 0 t 31 range.
    * @return {Array} Buffer array with frames.
    */
    commandARAreaRead(unitNo, beginningWord = 0, numberWords = 1){

        //check range for beginningword
        if (beginningWord < 0 && beginningWord > 959){
            throw new RangeError("Error at AR area read, beginning word must be between 0 and 959")
        }

        if (numberWords < 1 && numberWords > 2048){
            throw new RangeError("Error at AR area read, number of words must be between 1 and 960")
        }
        
        let frameArray = [];
        let commandBuffer = this.commandAreaRead(unitNo, 'RJ', beginningWord, numberWords);
        
        frameArray.push(commandBuffer);

        return frameArray;
               
    }
    
    /**
    * Function to make the command block EM Area Read  
    * @param {number} unitNo Hostlink unit number in multilink system
    * @param {number} beginningWord first DM word to read, start at 0.
    * @param {number} numberWords number of consecutive words to read.
    * @throws {RangeError} Throw an error if unit number is out 0 t 31 range.
    * @return {Array} Buffer array with frames.
    */
    commandEMAreaRead(unitNo,bankNo, beginningWord = 0, numberWords = 1){

        //check range for beginningword
        if (beginningWord < 0 && beginningWord > 9999){
            throw new RangeError("Error at EM area read, beginning word must be between 0 and 9999")
        }

        if (numberWords < 1 && numberWords > 9999){
            throw new RangeError("Error at EM area read, number of words must be between 1 and 9999")
        }
        
        let frameArray = [];
        let commandBuffer = this.commandAreaRead(unitNo, 'RJ', beginningWord, numberWords);
        
        frameArray.push(commandBuffer);

        return frameArray;
               
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

        let strUnitNo = utils.num2str(unitNo, 2, 10);

        //copy unit number into command buffer
        let bufUnitNo = Buffer.from(strUnitNo, 'ascii');
        bufUnitNo.copy(commandBuffer, 1);

        //copy header into command buffer
        let bufHeader = Buffer.from(header, 'ascii');
        bufHeader.copy(commandBuffer, 3)

        //copy beginning word into command buffer
        let strBeginningWord = utils.num2str(beginningWord, 4, 10);
        let bufBeginningWord = Buffer.from(strBeginningWord, 'ascii');
        bufBeginningWord.copy(commandBuffer, 5)

        //copy number words into command buffer
        let strNumberWords = utils.num2str(numberWords, 4, 10);
        let bufNumberWords = Buffer.from(strNumberWords, 'ascii');
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
