const fs = require("fs");
const removeExpiredTodo = require("./removeExpiredTodo");

// Database Path
const dataPath = process.env.DATABASE;

const readFile = (
  callback,
  returnEditedJson = false,
  filePath = dataPath,
  encoding = "utf8"
) => {
  fs.readFile(filePath, encoding, (err, data) => {
    if (err) {
      throw err;
    }

    // Expired todos are deleted each time the json file is read
    const { expiredTodoFound, cleanJson } = removeExpiredTodo(data);

    // Ensures that the json file is also cleaned and avoids double writing and race conditions
    if (expiredTodoFound && returnEditedJson) {
      cleanJsonFile(cleanJson);
    }

    // Returns clean json so below code also works
    cleanedJson = JSON.stringify(cleanJson);

    // Hiding private data (timestamp), by returing edited json or not
    callback(
      returnEditedJson
        ? JSON.parse(cleanedJson, (key, value) => {
            return key == "dateCreated" ? undefined : value;
          })
        : JSON.parse(cleanedJson)
    );
  });
};

const writeFile = (
  fileData,
  callback,
  filePath = dataPath,
  encoding = "utf8"
) => {
  fs.writeFile(filePath, fileData, encoding, (err) => {
    if (err) {
      throw err;
    }

    callback();
  });
};

// Removes expired todo when request method doesn't overwrite the json file
const cleanJsonFile = (cleanJson) => {
  writeFile(JSON.stringify(cleanJson, null, 2), () => {});
};

module.exports = { readFile, writeFile };
