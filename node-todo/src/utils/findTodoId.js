// Returns a todo object with it's Id and the index in the json file
const findTodoId = (data, todoId) => {
  let index;
  let todo;
  data.find((value, i) => {
    if (value.id === todoId) {
      index = i;
      todo = value;
    }
  });

  return { todo, index };
};

module.exports = findTodoId;
