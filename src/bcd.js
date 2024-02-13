


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

function decodeBuffer(buf, encode = true){
    
}

module.exports.encodeBuff = encodeBuffer;