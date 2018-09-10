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
  buildInputText (inputDefinition) {
    // canvas for dashed {canvas: [ { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, dash: {length: 2, space: 1} } ]}
    // canvas for line {canvas: [ { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 } ]},
  },

  /**
   *
   * @param imageUrl
   */
  convertImageUrlToBase64ViaFileReader (imageUrl) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest()
      xhr.onload = function () {
        var reader = new FileReader()
        reader.onloadend = function () {
          return resolve(reader.result)
        }
        reader.readAsDataURL(xhr.response)
      }
      xhr.onerror = function () {
        return reject(
          new Error({
            message:
              'Something went wrong on convertImageUrlToBase64ViaFileReader',
            xhr_status: xhr.status,
            xhr: xhr
          })
        )
      }
      xhr.open('GET', imageUrl)
      xhr.responseType = 'blob'
      xhr.send()
    })
  },

  /**
   *
   */
  convertImageUrlToBase64ViaFetch (imageUrl) {
    return new Promise((resolve, reject) => {
      return fetch(imageUrl)
        .then(
          response => (response.ok ? response.blob() : Promise.reject(response))
        )
        .then(blob => {
          if (blob.type === 'text/html') {
            return Promise.reject(new Error(`File not found`))
          }
          let reader = new FileReader()
          reader.readAsDataURL(blob)
          reader.onloadend = function () {
            let base64data = reader.result
            resolve(base64data)
          }
        })
        .catch(reject)
    })
  },

  /**
   *
   * @param {*} imageUrl
   */
  convertImageUrlToBase64ViaCanvas (imageUrl) {
    return new Promise((resolve, reject) => {
      let canvas = document.createElement('canvas')
      let img = document.createElement('img')
      img.src = imageUrl

      // load
      img.onload = function () {
        canvas.height = img.height
        canvas.width = img.width
        let base64 = canvas.toDataURL('image/png')
        canvas = null // clean
        return resolve(base64)
      }
      // if fails
      img.onerror = function (error) {
        return reject(error)
      }
    })
  },

  /**
   * * Array of objects
   *  * ref_id
   *  * value
   *  * type
   * @param {*} formDefinition
   */
  getAllFieldReferenceIdAndValuesFromFormDefinition (formDefinition) {
    return new Promise((resolve, reject) => {
      let fieldReferencesAndValues = []

      // recursive function to get all content
      let recursiveContentGetter = childFormDefinition => {
        let refAndValue = childFormDefinition

        // add logic here for type based checker
        if (refAndValue.type === 'container') {
          // if container, then do nothing..
        } else {
          // if text
          // if checkbox
          fieldReferencesAndValues.push(refAndValue)
        }

        if (childFormDefinition.children) {
          childFormDefinition.children.forEach(innerChildFormDefinition => {
            recursiveContentGetter(innerChildFormDefinition)
          })
        }
      }

      // trigger
      recursiveContentGetter(formDefinition)

      return resolve(fieldReferencesAndValues)
    })
  },

  /**
   *
   * @param {*} documentDefinition
   */
  getAllDocumentDefinitionObjectWithReferenceIds (documentDefinition) {
    return new Promise((resolve, reject) => {
      let objectsWithRefId = []
      let _getObjectsWithReferenceIds = targetObject => {
        // if array
        if (targetObject instanceof Array) {
          targetObject.forEach(arrayContent => {
            // pass array content to recursive
            _getObjectsWithReferenceIds(arrayContent)
          })
        } else if (targetObject instanceof Object) {
          // object && has ref_id

          // add to list
          if (targetObject.ref_id) {
            objectsWithRefId.push(targetObject)
          }

          // loop through object contents
          let keys = Object.keys(targetObject)
          keys.forEach(key => {
            _getObjectsWithReferenceIds(targetObject[key])
          })
        }
      }

      // trigger recursive object getter
      _getObjectsWithReferenceIds(documentDefinition)

      return resolve(objectsWithRefId)
    })
  },

  /**
   * Will not include 'container' type
   * @param {*} formDefinition
   */
  async extractFieldsWithReferenceFromFormDefinition (formDefinition) {
    try {
      let fieldReferencesAndValues = []

      // recursive function to get all content
      let recursiveContentGetter = childFormDefinition => {
        let refAndValue = childFormDefinition

        // add logic here for type based checker
        if (refAndValue.type === 'container') {
          // if container, then do nothing..
        } else {
          // add to 1 layer list
          fieldReferencesAndValues.push(childFormDefinition)
        }

        // if has children, then trigger recursive on child
        if (childFormDefinition.children) {
          childFormDefinition.children.map(innerChildFormDefinition => recursiveContentGetter(innerChildFormDefinition))
          // childFormDefinition.children.forEach(innerChildFormDefinition => {
          //   recursiveContentGetter(innerChildFormDefinition)
          // })
        }
      }

      // trigger recursive function
      recursiveContentGetter(formDefinition)

      return fieldReferencesAndValues
    } catch (error) {
      throw error
    }
  },

  /**
   * Will not include 'container' type
   * @param {*} formDefinition
   */
  async extractClonedFieldsWithReferenceFromFormDefinition (formDefinition) {
    try {
      let fieldReferencesAndValues = []

      // recursive function to get all content
      let recursiveContentGetter = childFormDefinition => {
        let refAndValue = childFormDefinition

        // add logic here for type based checker
        if (refAndValue.type === 'container') {
          // if container, then do nothing..
        } else {
          let refAndValueClone = JSON.parse(JSON.stringify(childFormDefinition))

          // we do cleanup before adding to list
          // if has children, then delete them
          // we only need the current form definitions content & other info,
          // but not children
          if (refAndValueClone.children) {
            delete refAndValueClone.children
          }

          fieldReferencesAndValues.push(refAndValueClone)
        }

        if (childFormDefinition.children) {
          childFormDefinition.children.map(recursiveContentGetter)
          // childFormDefinition.children.forEach(innerChildFormDefinition => {
          //   recursiveContentGetter(innerChildFormDefinition)
          // })
        }
      }

      // trigger recursive function
      recursiveContentGetter(formDefinition)

      return fieldReferencesAndValues
    } catch (error) {
      throw error
    }
  }
}
