import _ from 'underscore'
import moment from 'moment'

const storageFormIdListName = 'saved-forms-id-list'

/**
 *
 * @param {*} id
 */
let _saveIdToList = id => {
  return new Promise((resolve, reject) => {
    let list = JSON.parse(localStorage.getItem(storageFormIdListName))
    // if null, then
    if (!list) {
      list = []
    }
    list.push(id)
    localStorage.setItem(storageFormIdListName, JSON.stringify(list))
    return resolve(list)
  })
}

/**
 *
 * @param {*} id
 */
let _removeIdFromList = id => {
  return new Promise((resolve, reject) => {
    let list = JSON.parse(localStorage.getItem(storageFormIdListName))
    // if null, then
    if (!list) {
      return resolve(`id with value of ${id} not found on list`)
    }

    // get index in list
    let targetIndex = list.indexOf(id)
    if (targetIndex === -1) {
      return reject(
        new Error(`unable to find id with value of ${id} from list`)
      )
    }

    // remove
    list.splice(targetIndex, 1)
    localStorage.setItem(storageFormIdListName, JSON.stringify(list))
    return resolve('removed')
  })
}

/**
 *
 */
let _getAllList = () => {
  return new Promise(resolve => {
    let list = JSON.parse(localStorage.getItem(storageFormIdListName))
    // if null, then
    if (!list) {
      list = []
    }
    return resolve(list)
  })
}

/**
 *
 */
let _createGuid = () => {
  let s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  return (
    s4() +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    s4() +
    s4()
  )
}

export default {
  methods: {
    /**
     *
     * @param {*} id
     */
    getFormDefinition (id) {
      return new Promise((resolve, reject) => {
        let formDefinition = JSON.parse(localStorage.getItem(id))
        if (!formDefinition) {
          return reject(new Error(`id of ${id} not found`))
        }
        return resolve(formDefinition)
      })
    },
    /**
     *
     */
    getAllFormDefinitions () {
      return new Promise((resolve, reject) => {
        _getAllList()
          .then(ids => {
            let fetchInformationsRequests = []
            _.each(ids, id => {
              fetchInformationsRequests.push(
                this.getFormDefinition(id).then(formDefinition => {
                  let storageDefinition = formDefinition.storageDefinition

                  // format dates
                  storageDefinition.date_created_formatted = moment(
                    storageDefinition.date_created
                  ).format('MM/DD/YYYY hh:mm:ss a')
                  storageDefinition.date_updated_formatted = !storageDefinition.date_updated
                    ? null
                    : moment(storageDefinition.date_updated).format(
                      'MM/DD/YYYY hh:mm:ss a'
                    )

                  return formDefinition.storageDefinition
                })
              )
            })
            return Promise.all(fetchInformationsRequests)
          })
          .then(formDefinitions => {
            return formDefinitions
          })
          .then(resolve)
          .catch(reject)
      })
    },
    /**
     *
     * @param {*} formDefinition
     */
    saveOrUpdateFormDefinition (formName, formDefinition) {
      if (!formDefinition) {
        return Promise.reject(new Error('formDefinition is required'))
      }
      // if has storageDefinition then update
      if (formDefinition.storageDefinition) {
        return this.updateFormDefinition(formDefinition)
      } else {
        return this.saveFormDefinition(formName, formDefinition)
      }
    },
    /**
     *
     * @param {*} formDefinition
     */
    saveFormDefinition (formName, formDefinition) {
      return new Promise(resolve => {
        let dateCreated = new Date().getTime()
        let id = _createGuid()

        // structure
        formDefinition.storageDefinition = {
          id: id,
          form_name: formName,
          date_created: dateCreated,
          date_updated: null
        }

        // save to local storage
        localStorage.setItem(id, JSON.stringify(formDefinition))

        // add to list
        _saveIdToList(id)

        return resolve(formDefinition)
      })
    },
    /**
     *
     * @param {*} formDefinition
     */
    updateFormDefinition (formDefinition) {
      return new Promise((resolve, reject) => {
        if (!formDefinition.storageDefinition) {
          return reject(
            new Error(
              `formDefinition for update needs 'storageDefinition' object`
            )
          )
        }

        let formDefinitionContainer = JSON.parse(
          localStorage.getItem(formDefinition.storageDefinition.id)
        )

        if (!formDefinitionContainer) {
          return reject(
            new Error(`id of ${formDefinition.storageDefinition.id} not found`)
          )
        }

        // update date_updated
        formDefinition.storageDefinition.date_updated = new Date().getTime()

        // update to local storage
        localStorage.setItem(
          formDefinition.storageDefinition.id,
          JSON.stringify(formDefinition)
        )

        return resolve(formDefinition)
      })
    },
    /**
     *
     * @param {*} id
     */
    deleteFormDefinition (id) {
      return new Promise(resolve => {
        localStorage.removeItem(id)
        return _removeIdFromList(id)
          .then(() => localStorage.removeItem(id)) // remove from local storage
          .then(() => resolve('deleted'))
      })
    }
  }
}
