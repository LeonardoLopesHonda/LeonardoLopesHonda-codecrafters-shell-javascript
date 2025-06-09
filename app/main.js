const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt() {
  rl.question("$ ", (answer) => {
    const input = answer.split(" ");
    const command = input.shift();

    switch (command) {
      case "exit":
        handleExit(answer);
      case "echo":
        const args = input.join(" ");
        console.log(args);
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
  const exitCode = input.split(" ")[1];
  process.exit(exitCode);
}
