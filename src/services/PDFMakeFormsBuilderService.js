export default {

  /**
   * * inputDefinition 
   *  - type (string)
   *    - 'empty' (default)
   *    - 'line' 
   *    - 'dashed'
   *    - 'box'
   *  - value (string)
   * 
   * @param {*} inputDefinition 
   */
  buildInputText(inputDefinition) {
    // canvas for dashed 	{canvas: [ { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, dash: {length: 2, space: 1} } ]}
    // canvas for line 	{canvas: [ { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 } ]},    

  },

  /**
   * 
   * @param imageUrl 
   */
  convertImageUrlToBase64ViaFileReader(imageUrl) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
          return resolve(reader.result);
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = function () {
        return reject({
          message: 'Something went wrong on convertImageUrlToBase64ViaFileReader',
          xhr_status: xhr.status,
          xhr: xhr
        });
      };
      xhr.open('GET', imageUrl);
      xhr.responseType = 'blob';
      xhr.send();
    });
  },

  /**
   * 
   * @param {*} imageUrl 
   */
  convertImageUrlToBase64ViaCanvas(imageUrl) {
    return new Promise((resolve, reject) => {

      let canvas = document.createElement('canvas');
      let img = document.createElement('img');
      img.src = imageUrl;

      // load
      img.onload = function () {
        canvas.height = img.height;
        canvas.width = img.width;
        let base64 = canvas.toDataURL('image/png');
        canvas = null; // clean
        return resolve(base64);
      };
      // if fails
      img.onerror = function (error) {
        return reject(error);
      };
    });
  }
};