import LocalStorageCRUD from './LocalStorageCRUD'
import moment from 'moment'

/**
 *
 */
let _createRandomId = () => {
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

/**
 *
 */
class FormDefinitionContentModel {
  constructor (formName, id, content) {
    this.formName = formName
    this.id = id
    this.content = content
    this.dateCreated = new Date().getTime()
    this.dateUpdated = null // set as empty on initial creation
  }
}

export default class FormDefinitionContentCRUD extends LocalStorageCRUD {
  constructor () {
    super('form-content-local-storage-crud')
    this.listStorageName = 'list'
  }

  /**
   *
   * @param {*} content
   * @param {*} formName
   */
  async save (content, formName) {
    try {
      let formDefinitionContent = new FormDefinitionContentModel(
        formName,
        _createRandomId(),
        content
      )

      // save form content
      await super.save(formDefinitionContent.id, formDefinitionContent)
      await this._addToList(formDefinitionContent.id) // record to list
      return formDefinitionContent
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  /**
   *
   * @param {*} id
   * @param {*} content
   */
  async update (id, content) {
    let formDefinitionContent = await this.get(id)
    formDefinitionContent.dateUpdated = new Date()
    return this.save(formDefinitionContent.id, formDefinitionContent)
  }

  /**
   *
   * @param {*} id
   */
  async get (id) {
    let formDefinitionContent = super.get(id)
    if (!formDefinitionContent) {
      throw new Error(`form definition with id of ${id} not found`)
    }
    return formDefinitionContent
  }

  /**
   *
   * @param {*} id
   */
  async getList (id) {
    let listOfIds = await super.get(this.listStorageName)
    if (!listOfIds) {
      return []
    }
    // process list
    let formDefinitionContents = await Promise.all(
      listOfIds.map(id => this.get(id))
    )
    // update structure
    let listView = formDefinitionContents.map(formDefinitionContent => {
      let { id, formName, dateCreated, dateUpdated } = formDefinitionContent
      return {
        id,
        formName,
        dateCreated,
        dateUpdated,
        formattedDateCreated: moment(dateCreated.date_created).format(
          'MM/DD/YYYY hh:mm:ss a'
        ),
        formattedDateUpdated: !dateUpdated
          ? null
          : moment(dateUpdated).format('MM/DD/YYYY hh:mm:ss a')
      }
    })
    return listView
  }

  /**
   *
   * @param {*} id
   */
  async _addToList (id) {
    let listOfIds = await super.get(this.listStorageName)

    // if null, then initialize
    if (!listOfIds) {
      listOfIds = []
    }
    listOfIds.push(id)
    return super.save(this.listStorageName, listOfIds)
  }
}
