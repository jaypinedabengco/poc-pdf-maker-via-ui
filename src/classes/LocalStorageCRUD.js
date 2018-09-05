export default class LocalStorageCRUD {
  constructor(storage_name) {
    this.storage_name = storage_name;
  }

  /**
   * Will use set storage name if not supplied
   * @param {*} name 
   */
  saveToList(item_to_save, name = this.storage_name) {
    return new Promise(resolve => {
      let list = JSON.parse(localStorage.getItem(name));
      // if null, then
      if (!list) {
        list = [];
      }
      list.push(item_to_save);
      localStorage.setItem(name, JSON.stringify(list));
      return list;
    });
  }

}
