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
    saveUninitialized: true,
    cookie: {},
}))

const password = "m295";

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

/**
 * @
 */
app.get("/tasks", (request, response) => {
    response.json(tasks);
  });

app.post("/tasks", (request, response) => {
    const { title, description, dueDate, done } = request.body;
    if (!title || !description || !dueDate || done === undefined)
      return response.status(422).json({ error: "Unprocessable" });
    const newTask = { id, title, description, dueDate, done };
    tasks.push(newTask);
    id++;
    response.status(201).json(newTask);
  });

app.get("/tasks/:id", (request, response) => {
    const task = tasks.find((task) => task.id === request.params.id);
    if (!task) return response.status(404).send("Task not found");
    response.json(task);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });




