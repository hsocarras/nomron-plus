


/**
 * Function to encode a number into a buffer in bcd format 
 * @param {number} num Number to encode
 * @param {boolean} encode Encode de number in big endian if true otherwhise in litle endian. Default true
 * @returns {Buffer} encode result in LE format 
 */
function encodeBuffer(num, encode = true){

    let result
    let temp = []

    //type check
    if (typeof num === 'number'){

        while (num > 10) {
            temp.push(num % 10)
        }

        temp.push(num % 1)

        if (encode){
            result = Buffer.from(temp.reverse())
        }
        else{
            result = Buffer.from(temp)
        }

        return Buffer

    }
    else throw TypeError('Argument to bcs2buffer function must be a number')

}

/**
 * Function to encode a number into a string  
 * @param {number} num Number to encode
 * @param {number} size Fixed length in char for string. Will be 0 padding
 * @param {number} radix See Number.prototype.toString() docs
 * @param {boolean} encode Encode de number in big endian if true otherwhise in litle endian. Default true
 * @returns {String} Strint with 0 left pading 
 */
function num2str(num, size, radix = 10) {

    let strNum = num.toString(radix).toUpperCase();
    let s = "000000" + num;
    return s.substring(s.length-size);
}

module.exports.encodeBuff = encodeBuffer;

module.exports.num2str = num2str;