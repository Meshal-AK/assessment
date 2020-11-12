const removeExpiredTodo = (todoJson) => {
  let expiredTodoFound = false;
  const cleanJson = JSON.parse(todoJson);

  // Iterating in reverse, to prevent reindexing side effects
  for (i = cleanJson.length - 1; i >= 0; i--) {
    // Adds 5 minutes in milliseconds and then compare with current time
    const after5Miutes = cleanJson[i].dateCreated + 300000;
    if (Date.now() > after5Miutes) {
      cleanJson.splice(i, 1);
      expiredTodoFound = true;
    }
  }

  return { expiredTodoFound, cleanJson };
};

module.exports = removeExpiredTodo;
