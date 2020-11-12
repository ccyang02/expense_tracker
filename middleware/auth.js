module.exports = {
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) {
      console.log('@auth pass')
      return next()
    } else {
      console.log('@auth fail')
      return res.redirect('/user/login')
    }
  }
}