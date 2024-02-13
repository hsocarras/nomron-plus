/**
** Omron's hostlink master.
* @module client/nodbus_serial_client
* @author Hector E. Socarras.
* @version 1.0.0
*/

const HostLink = require('./hostlink');
const SerialChannel = require('./serialchannel')
const EventEmitter = require('events')

/**
* Class representing a modbus serial client ready to use.
* @extends ModbusSerialMaster
*/
class HostLinkClient extends  EventEmitter {
  
    constructor(){
        super();

        var self = this;

        
        this.channels = new Map();
       
        
    }

    get isIdle(){
      if (this.activeRequest == null){
        return true
      }
      else return false
    }

    /**
     * Function to add a channel object to master
     * @param {string} id: channel's id. Unique por channel
     * @param {string} ip: channel's ip address. Default 'localhost'
     * @param {number} port: channel's port. Default 502
     * @param {number} timeout time in miliseconds to emit timeout for a request.     
     */
    addChannel(id, type = 'tcp1', channelCfg = {ip: 'localhost', port: 502, timeout:250}){

              
        let channel = new SerialChannelChannel(channelCfg);
      
        /**
        * Emit connect and ready events
        * @param {object} target Socket object
        * @fires ModbusTCPClient#connect {object}
        * @fires ModbusTCPClient#ready
        */
        channel.onConnectHook = () => {
            /**
             * connection event.
             * Emited when new connecton is sablished
             * @event NodbusTcpClient#connection
             * @type {object}
             * @see https://nodejs.org/api/net.html
             */          
            this.emit('connection', id);
        };

        channel.onCloseHook = () => {
            /**
             * connection-closed event.
             * @event ModbusnetServer#connection-closed
             * @type {object}
             */
            this.emit('connection-closed', id)
        };

        channel.onDataHook = (dataFrame) => {
            /**
            * indication event.
            * @event ModbusnetServer#indication
            */
            this.emit('data', id, dataFrame);
        };

        channel.onMbAduHook = (resAdu) => {
            
            let res = {};

            res.timeStamp = Date.now(); 
            if(this._asciiRequest)  {
                let rtuResAdu = this.aduAsciiToRtu(resAdu);
                let len = rtuResAdu.length; 
                res.unitId = rtuResAdu[0];
                res.functionCode = rtuResAdu[1];                
                res.data = rtuResAdu.subarray(2, len-2);
            }  
            else{
                let len = resAdu.length; 
                res.unitId = resAdu[0];
                res.functionCode = resAdu[1];                
                res.data = resAdu.subarray(2, len-2);                
            }       
            
            this.processResAdu(resAdu, this._asciiRequest);
            
            this.emit('response', id, res)
            
        }

        channel.onErrorHook = (err) =>{
            /**
             * error event.
             * @event ModbusNetServer#error
             */
            this.emit('error', id, err);
        };

        channel.onWriteHook = (reqAdu) => {           
            
            let req = {};

            req.timeStamp = Date.now();
            if(this._asciiRequest){
                let rtuReqAdu = this.aduAsciiToRtu(reqAdu);
                let len = rtuReqAdu.length; 
                req.unitId = rtuReqAdu[0];
                req.functionCode = rtuReqAdu[1];                
                req.data = rtuReqAdu.subarray(2, len-2);
            }
            else{
                let len = reqAdu.length; 
                req.unitId = reqAdu[0];
                req.functionCode = reqAdu[1];                
                req.data = reqAdu.subarray(2, len-2); 
            }            
            
            if(req.unitId == 0){
                this.setTurnAroundDelay(channelCfg.timeout);   //start the timer for timeout event
            }
            else{
                this.setReqTimer(channelCfg.timeout);   //start the timer for timeout event
            }
            this.emit('request', id, req);

            /**
             * response event.
             * @event ModbusnetServer#response
             */
            this.emit('write', id, reqAdu);
        
        };

        channel.validateFrame = (frame)=>{
            if(frame.length > 3){

               return true
            }
            return false;
        }

        this.channels.set(id, channel);
      
    }

     /**
    * Function to delete a channel from the list
    * @param {string} id 
    */
     delChannel(id){

        if(this.channels.has(id)){
          this.channels.delete(id);      
        }      
    }

    isChannelReady(id){

        if(this.channels.has(id)){
          let channel = this.channels.get(id);
          return channel.isConnected();
        }
        else return false;      
    }

   /**
    *Stablish connection
    */
	connect(id){

        let self = this;
        let successPromise;
        let channel = self.channels.get(id);

        if(channel == undefined){            
            return Promise.reject(channel.ip, channel.port);
        }
        else if(channel.isConnected()){  
                  
            return Promise.resolve(id);
        }
        else{            
            successPromise = channel.connect();
            return successPromise
        }
		  
    }

    /**
    *disconnect from server
    */
	disconnect(id){
        
        let self = this;
        let successPromise;
        let channel = self.channels.get(id)

		if(channel == undefined){            
            return Promise.resolve(id);
                    
        }
        else if(channel.isConnected()){ 
            successPromise = channel.disconnect();
            return successPromise;
        }
        else{
            return Promise.resolve(id);
            
        }
    }

    /**
     * Function to send read coils status request to a modbus server.
     * @param {string} channelId Identifier use as key on channels dictionary.
     * @param {number} unitId Modbus address. A value between 1 -255
     * @param {number} startCoil Starting coils at 0 address
     * @param {number} coilsCuantity 
     * @param {boolean} asciiMode A flag that indicate the request is build in ascii format. Default false.
     * @returns {Boolean} true if succses otherwise false
     */
    readDM(unitId, start, Cuantity){
        let self = this;
        //check if channel is connected
        if(this.isChannelReady(channelId)){

            let channel = this.channels.get(channelId);
            let command = HostLink.commandDmArearead(unitId, start, Cuantity);
            let reqAdu = this.makeRequest(unitId, pdu, asciiMode);
            
            if(self.storeRequest(reqAdu, asciiMode)){                
                    
                return channel.write(reqAdu);                    
               
            }
            else{
                return false
            }
        }
        else{
            return false
        }

    }

    

    /**
     * Function to send preset single register request to a modbus server.
     * @param {Buffer} value Two bytes length buffer.
     * @param {string} channelId Identifier use as key on channels dictionary.
     * @param {number} unitId Modbus address. A value between 1 -255
     * @param {number} startRegister Starting coils at 0 address    
     * @param {boolean} asciiMode A flag that indicate the request is build in ascii format. Default false. 
     * @returns {Boolean} true if succses otherwise false
     */
    writeDM(value, channelId, unitId, startRegister, asciiMode = false){
        let self = this;
        //check if channel is connected
        if(this.isChannelReady(channelId)){

            let channel = this.channels.get(channelId);            
            let pdu = this.presetSingleRegisterPdu(value, startRegister);
            let reqAdu = this.makeRequest(unitId, pdu, asciiMode);

            if(self.storeRequest(reqAdu, asciiMode)){                
                    
                return channel.write(reqAdu);                    
               
            }
            else{
                return false
            }
        }
        else{
            return false
        }
    } 

    /**
     * Function to store the request in activeRequest and set the ascii flag is the request is in ascii Format.     
     * @param {Buffer} bufferReq
     * @returns {boolean} true if is succesful stored, false otherwise
     */
    storeRequest(bufferReq){

        let len = bufferReq.length;

        //storing request on the pool
        if(this.activeRequest == null){
            
            this.activeRequest = bufferReq;
            return true
        }
        else{
            return false;
        }

    }

    

}



module.exports = NodbusSerialClient;
