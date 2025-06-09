const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt() {
  rl.question("$ ", (answer) => {
    const command = answer.split(" ")[0];

    switch (command) {
      case "exit":
        handleExit(answer);
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
