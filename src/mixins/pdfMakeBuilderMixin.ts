export default {
    methods: {
        convertJSONToDocDefinition(doc) {
            return new Promise((resolve, reject) => {
            });
        },
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

                /*
                et canvas = document.createElement('canvas');
                let img = document.createElement('img');
                img.src = imageUrl;

                img.onload = function () {
                    let ctx = canvas.getContext('2d');
                    let dataURL;
                    canvas.height = img.naturalHeight;
                    canvas.width = img.naturalWidth;
                    ctx.drawImage(img, 0, 0);
                    dataURL = canvas.toDataURL('image/png');
                    resolve(dataURL);
                };

                // if fails
                img.onerror = function (error) {
                    return reject(error);
                };                
                */

                // if fails
                img.onerror = function (error) {
                    return reject(error);
                };
            });
        }, 
        convertImageUrlToBase64ViaFileReader(imageUrl){
            return new Promise((resolve, reject) => {
                var xhr = new XMLHttpRequest();
                xhr.onload = function() {
                  var reader = new FileReader();
                  reader.onloadend = function() {
                    return resolve(reader.result);
                  }
                  reader.readAsDataURL(xhr.response);
                };
                xhr.onerror = function(){
                    return reject({
                        message: 'Something went wrong on convertImageUrlToBase64ViaFileReader', 
                        xhr_status: xhr.status, 
                        xhr: xhr
                    }); 
                }
                xhr.open('GET', imageUrl);
                xhr.responseType = 'blob';
                xhr.send();
            })
            
        }
    }
}
