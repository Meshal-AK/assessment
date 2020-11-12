// String. Unique identifier of the todo (can't be set)
const getTodoId = (data) => {
  const todoIds = data.map((todo) => todo.id);
  const newTodoId = todoIds.length > 0 ? Math.max(...todoIds) + 1 : 1;
  return newTodoId.toString();
};

module.exports = getTodoId;
