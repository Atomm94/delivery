// Define the regex pattern
const regex = /^(?!.*\/(signIn|signUp)$).*/;

// Test some example paths
const paths = [
  '/user/signIn',
  '/account/signUp',
  '/profile',
  '/signInMore',
  '/signIn',
  '/signUp'
];

// Test the paths against the regex
paths.forEach(path => {
  console.log(`${path}: ${regex.test(path)}`);
});
