const readline = require("readline");
const { delimiter } = require("node:path");
const fs = require("fs");
const path = require("node:path");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt() {
  rl.question("$ ", (answer) => {
    const builtin = ["exit", "echo", "type"];
    const input = answer.split(" ");
    const command = input.shift();
    const args = input.join(" ").trim();

    switch (command) {
      case "":
        prompt();
        break;
      case "clear":
        console.clear();
        prompt();
        break;
      case "exit":
        handleExit(args);
      case "echo":
        console.log(args);
        prompt();
        break;
      case "type":
        if (builtin.includes(args)) {
          console.log(`${args} is a shell builtin`);
        } else if (isCommandValid(args)) {
          console.log(`${args} is ${findCommand(args)}`);
        } else {
          console.log(`${args}: not found`);
        }
        prompt();
        break;
      default:
        console.log(`${answer}: command not found`);
        prompt();
    }
  });
}

prompt();

function handleExit(input) {
  input ? process.exit(input) : process.exit(0);
}

function getPaths() {
  return process.env.PATH.split(delimiter);
}

function isCommandValid(command) {
  const username = require("os").userInfo().username;

  const paths = getPaths();
  let found = false;

  try {
    paths
      .filter((path) => {
        const pathArgs = path.split("/");
        if (
          !pathArgs.includes("mnt") &&
          !pathArgs.includes(username) &&
          !pathArgs.includes("node_modules") &&
          !pathArgs.includes("snap") &&
          !pathArgs.includes("sbin")
        ) {
          return path;
        }
      })
      .find((path) => {
        const files = fs.readdirSync(path, {
          recursive: true,
        });
        if (files.includes(command)) {
          found = files.includes(command);
        }
      });
  } catch (err) {
    console.error(err);
  }

  return found;
}

function findCommand(command) {
  const username = require("os").userInfo().username;
  const paths = getPaths();

  let foundPathToCommand = "";

  try {
    foundPathToCommand = paths
      .filter((path) => {
        const pathArgs = path.split("/");
        if (
          !pathArgs.includes("mnt") &&
          !pathArgs.includes(username) &&
          !pathArgs.includes("node_modules") &&
          !pathArgs.includes("snap") &&
          !pathArgs.includes("sbin")
        ) {
          return path;
        }
      })
      .find((path) => {
        const files = fs.readdirSync(path);
        if (files.includes(command)) {
          return path;
        }
      });
  } catch (err) {
    console.error(err);
  }

  return `${foundPathToCommand}/${command}`;
}
