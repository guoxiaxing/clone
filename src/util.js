function createData(deep, breadth) {
  var data = {};
  var temp = {};
  for (let i = 0; i < deep; i++) {
    temp = temp['data'] = {};
    for (let j = 0; j < breadth; j++) {
      temp[j] = j;
    }
  }
  return data;
}
module.exports = { createData };
