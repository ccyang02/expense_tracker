const tools = {
  hello: function (name) {
    console.log('hello ' + name)
  },
  date2String: function (date) {
    return `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`
  }
}


module.exports = tools
