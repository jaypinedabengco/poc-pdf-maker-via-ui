import moment from 'moment'

export default {
  /**
   * vuejs-datepicker
   */
  changeDateFormatForVueJSDatePicker (format) {
    // handle day 'DD', change to 'dd
    format = format.replace('DD', 'dd')
    // handle year 'YYYY', change to 'yyyy'
    format = format.replace('YYYY', 'yyyy')
    return format
  },

  /**
   *
   * @param {*} date
   * @param {*} format
   */
  formatDate (date, format) {
    // if date is empty, then return string with 1 space
    if (!date || date === '') {
      return ' '
    }
    // update format based on moment
    return moment(date).format(format)
  }
}
