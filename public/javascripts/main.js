// date format converter for index.html
try {
  const timeDivs = document.querySelectorAll('.unix-timestamp')
  for (timeDiv of timeDivs) {
    timeDiv.innerHTML = date2String(timeDiv.innerText)
  }

} catch (error) {
  console.log('No data in rows.')
}

try {
  // produce date dropdown
  const nowTimestamp = new Date()
  const getHowManyYears = 2

  const yearsInterval = Array.from({ length: getHowManyYears }, (_, k) => k + nowTimestamp.getFullYear() - (getHowManyYears - 1))
  const monthInterval = Array.from({ length: 12 }, (_, k) => k + 1)

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

  // replace category name with category id
  replaceFilterName('.dropdown-toggle-category', '.dropdown-menu-category')
  replaceFilterName('.dropdown-toggle-timestamp', '.dropdown-menu-timestamp')

} catch (error) {
  console.log('Not in index page')
}

// date format converter for edit.html & new.html
try {
  const calendarInput = document.querySelector('.calendar')
  console.log('>>>', calendarInput.defaultValue, calendarInput.value)
  calendarInput.value = date2String(calendarInput.defaultValue)

  const timestampModifier = document.querySelector('.date-timestamp')
  calendarInput.addEventListener('change', (event) => {
    timestampModifier.value = string2date(event.target.value)
  })
} catch (error) {
  console.log('Not in edit or new page')
}

function date2String(unixTimestampString) {
  console.log('>>>>', unixTimestampString)
  const unixTimestamp = Number(unixTimestampString)
  const unixDate = new Date(unixTimestamp)

  let mm = unixDate.getMonth()
  let dd = unixDate.getDate()
  console.log('It is mm-dd: ', mm, dd)
  mm = (mm < 10) ? `0${mm}` : `${mm}`
  dd = (dd < 10) ? `0${dd}` : `${dd}`
  console.log('date2String: ', mm, dd)
  return `${unixDate.getFullYear()}-${mm}-${dd}`
}

function string2date(timestampString) {
  const tokens = timestampString.split('-')
  console.log('tokens: ', tokens)
  const unixDate = new Date(tokens[0], tokens[1], tokens[2])
  console.log(unixDate.getTime())

  return unixDate.getTime()
}

function getTimeInterval(year, month) {
  const dayInterval = [-1, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  const dayIntervalSpecial = [-1, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
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

function replaceFilterName(toggleClass, menuClass) {
  const filterBar = document.querySelector(toggleClass)
  if (filterBar.innerText.includes('：')) {
    const menu = document.querySelector(menuClass)
    const cate = filterBar.innerText.split('：')[1].trim()
    let outcome = undefined
    for (child of menu.children) {
      if (child.href.includes(cate)) outcome = child.innerText
    }
    filterBar.innerText = filterBar.innerText.replace(cate, outcome)
  }
}