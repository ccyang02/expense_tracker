// date format converter for index.html
try {
  const timeDiv = document.querySelector('.unix-timestamp')
  timeDiv.innerHTML = date2String(timeDiv.innerText)
} catch (error) {
  console.log('No data in rows.')
}

try {
  // produce date dropdown
  const nowTimestamp = new Date()
  const getHowManyYears = 2

  const yearsInterval = Array.from({ length: getHowManyYears }, (_, k) => k + nowTimestamp.getFullYear() - (getHowManyYears - 1))
  const monthInterval = Array.from({ length: 12 }, (_, k) => k + 1)
  const dayInterval = [-1, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  const dayIntervalSpecial = [-1, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

  let timeOptions = ``

  const queryCate = document.querySelector('.sample-time-query').href.split('=')[1]

  yearsInterval.forEach(year => {
    monthInterval.forEach(month => {
      timeInterval = getTimeInterval(year, month)
      timeString = getTimeString(year, month)
      timeOptions = `<a class="dropdown-item timestamp-item" href="/index?queryTimestamp=${timeInterval}&queryCate=${queryCate}">${timeString}</a>` + timeOptions
    })
  })

  const timeDropdown = document.querySelector('.dropdown-time')
  timeDropdown.innerHTML = timeOptions
} catch (error) {
  console.log('Not in index page')
}

// date format converter for edit.html
try {
  const calendarInput = document.querySelector('.calendar')
  calendarInput.value = date2String(calendarInput.value)
} catch (error) {
  console.log('Not in edit page')
}


function date2String(unixTimestampString) {
  const unixTimestamp = Number(unixTimestampString)
  const unixDate = new Date(unixTimestamp)

  let mm = unixDate.getMonth()
  let dd = unixDate.getDate()
  mm = (mm < 10) ? `0${mm}` : `${mm}`
  dd = (dd < 10) ? `0${dd}` : `${dd}`

  return `${unixDate.getFullYear()}-${mm}-${dd}`
}

function getTimeInterval(year, month) {
  startTime = new Date(year, month, 1)
  if (year % 4 !== 0) {
    endTime = new Date(year, month, dayInterval[month])
  } else {
    endTime = new Date(year, month, dayIntervalSpecial[month])
  }
  return startTime.getTime() + '' + endTime.getTime()
}

function getTimeString(year, month) {
  month = (month < 10) ? `0${month}` : `${month}`
  return year + '-' + month
}