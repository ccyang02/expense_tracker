const data = {
  categories: [
    {
      code: 'residence',
      name: '家居物業',
      icon: 'fas fa-home'
    },
    {
      code: 'transportation',
      name: '交通出行',
      icon: 'fas fa-shuttle-van'
    },
    {
      code: 'amusement',
      name: '休閒娛樂',
      icon: 'fas fa-grin-beam'
    },
    {
      code: 'food',
      name: '餐飲食品',
      icon: 'fas fa-utensils'
    },
    {
      code: 'others',
      name: '其他',
      icon: 'fas fa-pen'
    }
  ],
  records: [
    {
      name: '打牌輸錢',
      category: 'amusement',
      date: new Date(2020, 10, 20),
      amount: 2000,
    },
    {
      name: '家人吃餐廳',
      category: 'food',
      date: new Date(2020, 10, 21),
      amount: 666,
    }
  ]

}

module.exports = data