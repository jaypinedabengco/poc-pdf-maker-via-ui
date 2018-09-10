/**
 * @param {*} storageName
 * @param {*} name
 */
let _getName = (storageName, name) => {
  return name ? [storageName, name].join('-') : storageName
}
export default class LocalStorageCRUD {
  constructor (storageName) {
    this.storageName = storageName
  }

  /**
   *
   * @param {*} itemToSave
   * @param {*} name
   */
  async save (name, itemToSave) {
    let storageName = _getName(this.storageName, name)
    console.log(storageName, itemToSave)
    localStorage.setItem(storageName, JSON.stringify(itemToSave))
    return itemToSave
  }

  /**
   *
   * @param {*} name
   */
  async get (name) {
    let storageName = _getName(this.storageName, name)
    return JSON.parse(localStorage.getItem(storageName))
  }

  /**
   *
   * @param {*} name
   */
  async delete (name) {
    let storageName = _getName(this.storageName, name)
    localStorage.removeItem(storageName)
    return name
  }
}
