


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

/**
 * Function to get a ascii ejncoded buffer from the words buffer.
 * @param {Buffer} words. Buffer with words value. Word is a two byte datatype. First word's byte are even buffer's byte (0, 2, 4, ...) 
 * @param {number} radix. See Number.prototype.toString() docs
 * @returns Buffer with word's values encoded in ascii characters.
 */
function words2AsciiBuffer(words, radix = 10){

    let wordsCount = Math.floor(words.length / 2);
    let buffStr = Buffer.alloc(4 * wordsCount);

    for (let i = 0; i < wordsCount; i++){

        //Getting hight and low bytes fron data word
        let hsb = words[i + 1];
        let lsb = words[i];
    
        //Ascii encoding
        let strHSB = utils.num2str(hsb, 2, radix);
        let strLSB = utils.num2str(lsb, 2, radix);
    
        //Creating buffer
        let bufHSB = Buffer.from(strHSB, 'ascii');
        let bufLSB = Buffer.from(strLSB, 'ascii');
    
        bufHSB.copy(buffStr, 2*i);
        bufLSB.copy(buffStr, 1 + 2*i);
    }

    return buffStr;

}

/**
 * Function to split a word's segment into multiples chunks of given size.
 * Examle a segment of 20 words will spliten y a array of 7 chunks of 3 words if the function is called with chinkSize ecual to 3.
 * @param {Buffer} words Buffer with words value.
 * @param {number} chunkSize Size of chunks in number of 16 bits words.
 * @returns {Array} Array with chunks of words.
 */
function splitWords(words, chunkSize = 30){

    let wordsChunks = [];
    let chunk = Buffer.alloc(2 * chunkSize);

    let wordsLenght = Math.floor(words.length/2);

    if(wordsLenght < chunkSize){
        wordsChunks.push(words);
        return wordsChunks;
    }

    let splitSize = Math.floor(wordsLenght/chunkSize);

    if(wordsLenght % chunkSize > 0){
        splitSize++
    }

    for(let i = 0; i < splitSize; i++){

        let start = i*chunkSize;
        let end = start + chunkSize;

        if (end > words.length){
            end = words.length;
        }

        chunk = words.subarray(start, end);
        wordsChunks.push(chunk)
    }

    return wordsChunks;

}


module.exports.encodeBuff = encodeBuffer;

module.exports.num2str = num2str;

module.exports.words2AsciiBuffer = words2AsciiBuffer;

module.exports.splitWords = splitWords;