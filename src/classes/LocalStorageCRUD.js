export default class LocalStorageCRUD {
  constructor (storageName) {
    this.storageName = storageName
  }

  /**
   * Will use set storage name if not supplied
   * @param {*} name
   */
  async saveToList (itemToSave, name = this.storageName) {
    let list = JSON.parse(localStorage.getItem(name))
    // if null, then
    if (!list) {
      list = []
    }
    list.push(itemToSave)
    localStorage.setItem(name, JSON.stringify(list))
    return list
  }
}
