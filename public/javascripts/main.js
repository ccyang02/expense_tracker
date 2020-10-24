const tools = {
  hello: function (name) {
    console.log('hello ' + name)
  },
  date2String: function (date) {
    let mm = date.getMonth()
    let dd = date.getDate()
    mm = (mm < 10) ? `0${mm}` : `${mm}`
    dd = (dd < 10) ? `0${dd}` : `${dd}`

    return `${date.getFullYear()}-${mm}-${dd}`
  },

  getTotalAmount: function (tmp) {
    return tmp.map(x => x.amount).reduce((accumulator, currentValue) => accumulator + currentValue)
  },

  transformDateType: function (newData) {
    const tokens = newData.date.split('-')
    return new Date(tokens[0], tokens[1], tokens[2])
  }

}

module.exports = tools
