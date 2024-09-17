import express from "express";
import { DecisionTree } from "./decisionTree";
import { condition, loop, sequence } from "./data";

const app = express();
app.use(express.json());

// for speeding up development and testing we can pass our objects right here instead of making requests
// const decisionTree = DecisionTree.deserialize(condition);
// decisionTree.execute();

app.post("/execute", (req, res) => {
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).send("Invalid input");
  }
  try {
    const decisionTree = DecisionTree.deserialize(req.body);
    decisionTree.execute();
    res.status(200).send("Decision tree executed");
  } catch (error: any) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
