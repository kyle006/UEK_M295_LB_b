// Author: Kyle Jeremy Meier
// Created: 19.06.2024
const express = require("express");
const session = require("express-session");
const port = 3000;
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const app = express();

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Tasks API",
            version: "1.0",
            description: "Eine API um aufgaben/tasks zu verwalten",
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
//Formatierung mit Chatgpt
/**
 * @openapi
 * /login:
 *  post:
 *     tags:
 *      - Authentication
 *     summary: login for users
 *     description: user login with an explicit password
 *     requestBody:
 *       description: login data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *       403:
 *         description: wrong password no access
 */
app.post("/login", (request, response) => {
    try{ console.log("received POST request for /login");
    const loginData = request.body;
    if (password === loginData.password) {
        request.session.email = loginData.email;
        response.cookie("user", loginData.email, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true});
        return response.status(200).json({ email: request.session.email});
    }
    return response.status(403).json({ error: "Forbidden"});
}   catch (error){
    console.error(`Error Processing POST request for /login: ${error.message}`);
    response.status(500).send("server error");}
});

// Richtige Formatierung durch AI
/**
 * @openapi
 * /verify:
 *  get:
 *    tags:
 *      - Authentication
 *    summary: Checks if User is logged in
 *    description: Verifies if the users session is still active
 *    responses:
 *      200:
 *        description: session is verified
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *      401:
 *        description: Session Expired
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 */
app.get("/verify", Authenticated,(request, response) => {
    try{ console.log("received GET request /verify");
if (request.session.email) {
        return response.status(200).json({ message: "session is verified" });
    }
    return response.status(401).json({ error: "session expired" });
    } catch (error) {
        console.error(`error processing GET /verify: ${error.message}`);
        response.status(500).send("server error")
    }
} );
//chatgpt formatiert
/**
 * @openapi
 * /logout:
 *   delete:
 *     tags:
 *       - Authentication
 *     summary: User logout
 *     description: logout to stop the session
 *     responses:
 *       204:
 *         description: Session stopped
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Not logged in
 */
app.delete("/logout", Authenticated, (request, response) => {
    try { console.log("received DELETE request /logout")
        if (request.session.email) {
        request.session.destroy();
        return response.status(204).json({ message: "session stopped"})
    }
    return response.status(401).json({ error: "not logged in"})
    }catch (error) {
        console.error(`error proccessing DELETE /logout: ${error.message}`);
        response.status(500).send("Server error")
    }
})


function Authenticated(request, response, next) {
    if (request.session.email) {
      next();
    } else {
      response.status(401).json({ error: 'not logged in'});
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
 *     summary: Returns a list of all tasks
 *     description: Endpoint retrieves all tasks that are currently saved
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
    try {console.log("recieved GET request for /tasks");
         response.json(tasks);
    }catch (error) {
        console.error(`Error processing GET request /tasks ${error.message}`);
        response.status(500).send("Server error");
    }
   
  });

//Mit Chatgpt Formatiert
/**
 * @openapi
 * /tasks:
 *   post:
 *     tags:
 *       - Tasks
 *     summary: Creates a new task.
 *     description: Endpoint to create a new task.
 *     requestBody:
 *       description: Task data that needs to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       422:
 *         description: Unprocessable entity
 * components:
 *  schemas:
 *     Task:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *        title:
 *          type: string
 *        description:
 *          type: string
 *        dueDate:
 *          type: string
 *          format: date
 *        done:
 *          type: string
 *          format: date
 */
app.post("/tasks", Authenticated, (request, response) => {
    try { console.log("Received POST request /tasks");
        const { title, description, dueDate, done } = request.body;
    if (!title || !description || !dueDate || done === undefined)
      return response.status(422).json({ error: "Unprocessable" });
    const id = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
    const newTask = { id, title, description, dueDate, done };
    tasks.push(newTask);
    response.status(201).json(newTask);
}catch (error) {
    console.error(`erro processing POST request /tasks: ${error.message}`);
    response.status(500).send("Server error");
}
     });
//Chatgpt verwendet
/**
 * @openapi
 * /tasks/{id}:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Retrieves a task by its ID.
 *     description: Endpoint to get a specific task by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         dueDate:
 *           type: string
 *           format: date
 *         done:
 *           type: boolean
 */
app.get("/tasks/:id", Authenticated, (request, response) => {
    try{ console.log(`received GET request for /tasks/${request.params.id}`); 
        const task = tasks.find((task) => task.id ===Number(request.params.id));
    if (!task) return response.status(404).send("Task not found");
response.status(200).json(task);
} catch (error) {
    console.log(`error with processing GET request /tasks/${request.params.id}: ${error.message}`);
    response.status(500).send(" server Eror");
}});

//Chatgpt verwendet
/**
 * @openapi
 * /tasks/{id}:
 *   put:
 *     tags:
 *       - Tasks
 *     summary: Updates a task by its ID.
 *     description: Endpoint to update a specific task by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Task data that needs to be updated
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         dueDate:
 *           type: string
 *           format: date
 *         done:
 *           type: boolean
 */
app.put("/tasks/:id", Authenticated, (request, response) => {
    try {console.log(`received PUT request for /tasks/${request.params.id}`);
        const id = Number(request.params.id);
        const taskId = tasks.findIndex(task => task.id === id);
        if (taskId === -1) {
            response.status(404).json({ message: 'Task not found' });
        } else {
            tasks[taskId].title = request.body.title || tasks[taskIndex].title;
            tasks[taskId].description = request.body.description || tasks[taskIndex].description;
            tasks[taskId].done = request.body.done !== undefined ? request.body.done : tasks[taskIndex].done;
            tasks[taskId].dueDate = request.body.dueDate || tasks[taskIndex].dueDate;

            response.json(tasks[taskId]);
        }
} catch (error) {
        console.error(`error with updating the /tasks/${request.params.id}: ${error.message}`);
        response.status(500).json({ message: 'Internal server error' });
    }
});
//Chatgpt verwendet
/**
 * @openapi
 * /tasks/{id}:
 *   delete:
 *     tags:
 *       - Tasks
 *     summary: Deletes a task by its ID.
 *     description: Endpoint to delete a specific task by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         dueDate:
 *           type: string
 *           format: date
 *         done:
 *           type: boolean
 */
app.delete("/tasks/:id", Authenticated,(request, response) => {
    try{console.log(`received DELETE request /tasks/${request.params.id}`);
        const taskId = tasks.findIndex(
      (task) => task.id === Number(request.params.id)
    );
    if (taskId === -1)
      return response.status(404).json({ error: "Not found" });
    const deletedTask = tasks.splice(taskId, 1);
    response.status(200).json(deletedTask); }
    catch (error) {
        console.error(`Error processing DELETE request /tasks/${request.params.id}: ${error.message}`);
        response.status(500).send("Server error");
    }
});

//Endpoint not found
app.use((request, response,) => {
    console.error("404 endpoint not found");
    response.status(404).json({ message: 'Endpoint not found' });
  });

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });




