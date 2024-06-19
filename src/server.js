const express = require("express");
const session = require("express-session");
const port = 3000;
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const app = express();
let id = 1;

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Tasks API",
            version: "1.0",
            description: "Eine API um Aufgaben/tasks zu verwalten",
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
    },
apis: ["./server.js"],
};

const swaggerSpec = swaggerJsdoc(options);

app.use(express.json());
app.use("/swagger-ui", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false},
}))

const password = "m295";

/**
 * @openapi
 * /login:
 *  post:
 *     tags:
 *      - Authentication
 *     summary: Login for Users
 *     description: User Login with an explicit password.
 *     responses:
 *       200:
 *       description: Succesfully logged in.
 *       403:
 *       description: Wrong Password no acces
 */
app.post("/login", (request, response) => {
    const loginData = request.body;
    if (password === loginData.password) {
        request.session.email = loginData.email;
        response.cookie("user", loginData.email, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true});
        return response.status(200).json({ email: request.session.email});
    }
    return response.status(403).json({ error: "Forbidden"});
});

app.get("/verify", Authenticated,(request, response) => {
    if (request.session.email) {
        return response.status(200).json({ message: "Session is verified" });
    }
    return response.status(401).json({ error: "Session expired" });
} )

app.delete("/logout", Authenticated, (request, response) => {
    if (request.session.email) {
        request.session.destroy();
        return response.status(204).json({ message: "Session stopped"})
    }
    return response.status(401).json({ error: "Not logged in"})
})


function Authenticated(request, response, next) {
    if (request.session.email) {
      next();
    } else {
      response.status(401).json({ error: 'Not logged in'});
    }
  }

let tasks = [
    {
        id: 1,
        title: "Abwaschen",
        description: "Geschirr abwaschen",
        dueDate: "2024-06-20",
        done: "2024-06-19",
      },
    {
        id: 2,
        title: "Putzen",
        description: "Die Wohnung putzen",
        dueDate: "2024-06-20",
        done: "2024-06-19",
    },
    {
        id: 3,
        title: "Einkaufen",
        description: "Essen einkaufen",
        dueDate: "2024-06-24",
        done: "2024-06-22",
    },
    {
        id: 4,
        title: "Packet versenden",
        description: "Packet zur Post bringen",
        dueDate: "2024-06-30",
        done: "2024-06-19",
    }
];
//Mit Chatgpt formatiert.
/**
 * @openapi
 * /tasks:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Returns a list of all tasks.
 *     description: Endpoint retrieves all tasks that are currently saved.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The task ID.
 *         title:
 *           type: string
 *           description: The title of the task.
 *         description:
 *           type: string
 *           description: A description of the task.
 *         dueDate:
 *           type: string
 *           format: date
 *           description: The due date of the task.
 *         done:
 *           type: string
 *           format: date
 *           description: The date the task was completed.
 */

app.get("/tasks", Authenticated,(request, response) => {
    response.json(tasks);
  });

//Mit Chatgpt Formatiert
/**
* @openapi
* /tasks:
 *   post:
 *     tags:
 *       - Tasks
 *     summary: Creates a new task.
 *     description: Endpoint creates a new task.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 * components:
 *  schemas:
 *     Task:
 * 
 * 
*/
app.post("/tasks", Authenticated, (request, response) => {
    const { title, description, dueDate, done } = request.body;
    if (!title || !description || !dueDate || done === undefined)
      return response.status(422).json({ error: "Unprocessable" });
    const id = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
    const newTask = { id, title, description, dueDate, done };
    tasks.push(newTask);
    response.status(201).json(newTask);
  });

app.get("/tasks/:id", Authenticated, (request, response) => {
    const task = tasks.find((task) => task.id ===Number(request.params.id));
    if (!task) return response.status(404).send("Task not found");
    response.status(200).json(task);
});

app.put("/tasks/:id", Authenticated,(request, response) => {
    const { title, description, dueDate, done } = request.body;
    const id = Number(request.params.id)
    if (!id || !title || !description || !dueDate || done === undefined)
        return response.status(422).json({ error: "Unprocessable" });
    const task = tasks.find((task) => task.id === request.params.id);
    if (!task) return response.status(404).send("Task Not Found");
    task = { id, title, description, dueDate, done };
    response.status(200).json(task);
});

app.delete("/tasks/:id", Authenticated,(request, response) => {
    const taskId = tasks.findIndex(
      (task) => task.id === Number(request.params.id)
    );
    if (taskId === -1)
      return response.status(404).json({ error: "Not found" });
    const deletedTask = tasks.splice(taskId, 1);
    response.status(200).json(deletedTask);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });




