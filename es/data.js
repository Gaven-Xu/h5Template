faker.locale = "zh_CN";

function fakeData() {
  var data = [];
  for (let index = 0; index < 5; index++) {
    let start = faker.date.past();
    let end = faker.date.recent();
    let bookNum = 7;
    data[index] = {
      time: `${start.getFullYear()}.${start.getMonth() + 1}.${start.getDate()}-${end.getMonth() + 1}.${end.getDate()}`,
      bookList: []
    }

    if (index === 4) {
      bookNum = 3;
    }

    for (let n = 0; n < bookNum; n++) {
      data[index]['bookList'].push({
        cover: faker.image.imageUrl(),
        code: faker.random.uuid(),
        name: faker.random.words(),
        desc: faker.lorem.paragraph(),
        checked: faker.random.boolean()
      })
    }
  }
  return data;
}
