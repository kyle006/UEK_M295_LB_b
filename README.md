# UEK_M295_LB_b
Author: Kyle Meier

## Description
THis is a simple REST API for Tasks. It allows the User to create new Task, update already existing ones, delete tasks and get a list of all the tasks.

## Development Environment Setup
1. Clone the repository: `git clone https://github.com/kyle006/UEK_M295_LB_b.git`
2. Navigate to the project directory: `cd UEK_M295_LB_b`
3. Install dependencies: `npm install`
4. Navigate into the src directory: `cd src`
4. Start the server: `node server.js`
The server will be accesible at `http://localhost:3000`

## 

## API Endpoints
The documentation for all the API enpoints are also accesible at `http://localhost:3000/swagger-ui` here a brief explanation:

- `POST /login`: Logs in a user. Requires an email and password in the request body.
- `GET /verify`: Verifies if a user is logged in.
- `DELETE /logout`: Logs out a user.
- `GET /tasks`: Returns all tasks.
- `POST /tasks`: Creates a new task. Requires a title, description, dueDate, and done status in the request body.
- `GET /tasks/:id`: Returns the task with the given id.
- `PUT /tasks/:id`: Updates the task with the given id. Requires a title, description, dueDate, and done status in the request body.
- `DELETE /tasks/:id`: Deletes the task with the given id.

## License
This project is licensed under the MIT License. See the LICENSE file for details.