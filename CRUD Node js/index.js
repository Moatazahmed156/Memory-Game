const express = require("express");
const fs = require("fs").promises;

const app = express();
app.use(express.json());

const readUsersData = async () => {
  const data = await fs.readFile("./data.json", "utf8");
  return JSON.parse(data);
};

const writeUsersData = async (users) => {
  await fs.writeFile("./data.json", JSON.stringify(users), "utf8");
};

app.get("/users", async (req, res) => {
  const users = await readUsersData();
  res.json(users);
});

app.get("/users/:id", async (req, res) => {
  const users = await readUsersData();
  const user = users.find((u) => u.id == req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.post("/users", async (req, res) => {
  const users = await readUsersData();
  let newID = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
  const newUser = { ...req.body, id: newID };

  if (users.some((user) => user.email == newUser.email)) {
    return res.status(400).json({ message: "Email already exists" });
  }
  users.push(newUser);
  await writeUsersData(users);
  res.status(201).json(newUser);
});

app.patch("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const updatedUserData = req.body;
  const users = await readUsersData();
  const userIndex = users.findIndex((u) => u.id == userId);

  if (userIndex == -1) {
    return res.status(404).json({ message: "User not found" });
  }
  if (
    updatedUserData.email &&
    users.some(
      (user) => user.id != userId && user.email == updatedUserData.email
    )
  ) {
    return res.status(400).json({ message: "Email already exists" });
  }
  users[userIndex] = { ...users[userIndex], ...updatedUserData, id: userId };
  await writeUsersData(users);
  res.json(users[userIndex]);
});

app.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;
  let users = await readUsersData();
  users = users.filter((u) => u.id != userId);
  await writeUsersData(users);
  res
    .status(200)
    .json({ message: `user with id ${userId} deleted successfully` });
});

app.listen(3000, () => {
  console.log(`Server listening on port 3000`);
});
