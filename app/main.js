const readline = require("readline");
const { delimiter, join } = require("node:path");
const { execFileSync, execFile } = require("child_process");
const fs = require("fs");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt() {
  rl.question("$ ", (answer) => {
    const builtin = ["exit", "echo", "type"];
    const input = answer.split(" ");
    const command = input.shift().trim();
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
          console.log(`${args} is ${findCommandPath(args)}`);
        } else {
          console.log(`${args}: not found`);
        }
        prompt();
        break;
      default:
        if (isCommandValid(command)) {
          console.log(executeCommand(command, args));
        } else {
          console.log(`${answer}: command not found`);
        }
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

function filterPaths(paths) {
  const username = require("os").userInfo().username;

  return paths.filter((path) => {
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
  });
}

function isCommandValid(command) {
  const paths = getPaths();
  let found = false;

  try {
    filterPaths(paths).find((path) => {
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

function findCommandPath(command) {
  const paths = getPaths();

  let foundPathToCommand = "";
  try {
    foundPathToCommand = filterPaths(paths).find((path) => {
      const files = fs.readdirSync(path);
      if (files.includes(command)) {
        return path;
      }
    });
  } catch (err) {
    console.error(err);
  }

  return join(foundPathToCommand, command);
}

function executeCommand(command, args) {
  let stdout = "";

  try {
    if (args) {
      stdout = execFileSync(command, [args], {
        stdio: "pipe",
        encoding: "utf8",
      });
    } else {
      stdout = execFileSync(command, {
        stdio: "pipe",
        encoding: "utf8",
      });
    }
  } catch (err) {
    console.error(err.code);
  }

  return stdout.trim();
}

function execLs() {
  execFile(
    "ls",
    {
      encoding: "utf8",
    },
    (error, stdout, stderr) => {
      if (error) {
        throw error;
      }
      console.log(stdout);
    }
  );
}
