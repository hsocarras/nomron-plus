/**
* Omron's Host Link Master Base Class module.
* @module protocol/hostlink_master
* @author Hector E. Socarras.
* @version 1.0.0
*/



const bcd = require('./bcd');

/** Defining protocol constant */
const beginer_char = 0x40 //@
const delimitator_char = 0x0D //CR 
const terminator_char = 0x2A //*

max_length = 124 // first multiline block can have up to 127 bytes due to use beginer char, terminator char and unit number

/**
 * Class representing to encapsulate the hostlink protocol.
 * 
*/
class HostlinkProtocol extends EventEmitter {
    
    constructor(){
        super();            
        
    }  
    

    /**
    * Function to make the command block DM Area Read  
    * @param {number} unitNo Hostlink address in multilink system
    * @param {number} startRegister first holding register to read, start at 0.
    * @param {number} registerQuantity number of holding register to read.
    * @return {buffer} pdu buffer.
    */
    commandDmAreaRead(unitNo, beginningWord = 0, numberWords = 1){
        
        let commandBuffer = Buffer.alloc(17);
        commandBuffer[0] = beginer_char;

        //copy unit number into command buffer
        let bufUnitNo = Buffer.from(unitNo.toString(10).toUpperCase(), 'ascii');
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
        buFCS = Buffer.from(fcs.toString(16).toUpperCase(), 'ascii');
        buFCS.copy(commandBuffer, 13)

        commandBuffer[14] = terminator_char;
        commandBuffer[15] = delimitator_char;

        return commandBuffer;
               
    }

    /**
    * Function to make the command block DM Area Write
    * @param {String} wordValues
    * @param {number} unitNo Hostlink address in multilink system
    * @param {number} startRegister first holding register to read, start at 0.
    * @param {number} registerQuantity number of holding register to read.
    * @return {array} array of command buffer.
    */
    commandDmAreaRead(wordValues, unitNo, beginningWord = 0){
        
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

    
}
    

module.exports = HostlinkProtocol;
