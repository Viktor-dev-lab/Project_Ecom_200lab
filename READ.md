1. Initialize the Project
First, let’s create a new directory for our project and initialize it with npm:

mkdir my-express-app
cd my-express-app
npm init -y

2. Install Dependencies
Next, we need to install Express and the necessary TypeScript and development dependencies:

npm install express
npm install -D typescript @types/node @types/express ts-node nodemon

3. : Configure TypeScript
Initialize TypeScript
Initialize TypeScript in your project:

npx tsc --init
Update tsconfig.json
Open the generated tsconfig.json file and ensure the following settings are present:

{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}

4. : Setup the Application Structure
Create the Directory Structure
Create a src directory for our TypeScript source files and an entry point file:

mkdir src
touch src/index.ts
Create an Express Server
Add the following code to src/index.ts:

import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello, TypeScript with Express!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


5. : Setup Nodemon
Create Nodemon Configuration
Create a nodemon.json file to configure Nodemon:

{
  "watch": ["src"],
  "ext": "ts",
  "ignore": ["src/**/*.spec.ts"],
  "exec": "ts-node ./src/index.ts"
}
Update package.json Scripts
Add the following scripts to your package.json:

"scripts": {
  "start": "node dist/index.js",
  "dev": "nodemon --config nodemon.json"
}

6. : Run the Application
Run in Development Mode
To start the application in development mode, use:

npm run dev
Build and Run in Production Mode
For production, build the TypeScript code and then start the application:

npx tsc
npm start