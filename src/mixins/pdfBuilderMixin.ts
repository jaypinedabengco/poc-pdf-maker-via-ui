export default {
  methods: {
    getBase64FromJsPdf (doc) {
      return new Promise((resolve, reject) => {
        if (!doc) {
          return reject('doc is empty')
        }
        if (!doc.output) {
          return reject('invalid doc content')
        }
        if (navigator.msSaveBlob) {
          return reject('Sorry, we cannot show live PDFs in MSIE')
        }

        try {
          // get bloburi (base64)
          return resolve(doc.output('bloburi'))
        } catch (e) {
          return reject(e)
        }
      })
    }
  }
}
