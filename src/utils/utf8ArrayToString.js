const Utf8ArrayToString = (array) => {
  const length = array.length;
  let response = '';
  let i = 0;
  let c;
  let char2;
  let char3;

  // Disable use of eslint given heavy use of bitwise operators
  /* eslint-disable */
  while (i < length) {
    c = array[i++];
    switch (c >> 4) {
      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
        // 0xxxxxxx
        response += String.fromCharCode(c);
        break;
      case 12: case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[i++];
        response += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        response += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
        break;
      default:
        break;
    }
  }
  /* eslint-enable */

  return response;
};

export default Utf8ArrayToString;
