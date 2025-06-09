const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt() {
  rl.question("$ ", (answer) => {
    const builtin = ["exit", "echo", "type"];
    const input = answer.split(" ");
    const command = input.shift();
    const args = input.join(" ");

    switch (command) {
      case "exit":
        handleExit(args);
      case "echo":
        console.log(args);
        prompt();
        break;
      case "type":
        if (builtin.includes(args)) {
          console.log(`${args} is a shell builtin`);
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
