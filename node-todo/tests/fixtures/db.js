const { writeFile } = require("../../src/utils/fileReaderandWriter");

const now = Date.now();

const todoTest1 = [
  {
    text: "Test One",
    done: true,
    priority: 3,
    dateCreated: now,
    id: "1",
  },
  {
    text: "Text Two (Expired)",
    done: true,
    priority: 3,
    dateCreated: now - 300000,
    id: "2",
  },
  {
    text: "Test Three",
    done: true,
    priority: 3,
    dateCreated: now,
    id: "3",
  },
];

const setupDatabase = () => {
  writeFile(JSON.stringify(todoTest1, null, 2), () => {});
};

module.exports = setupDatabase;
