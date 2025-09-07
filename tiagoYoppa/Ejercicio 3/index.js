import express from "express";
const app = express();
const port = 3002;
app.use(express.json());

let tareas = [];

app.post("/tareas", (req, res) => {
  const { nombre, completada } = req.body;

  if (!nombre || typeof completada !== "boolean") {
    return res.status(400).json({ error: "Debe enviar nombre y estado (true/false)." });
  }

  if (tareas.find(t => t.nombre === nombre)) {
    return res.status(400).json({ error: "La tarea ya existe." });
  }

  const nuevaTarea = { nombre, completada };
  tareas.push(nuevaTarea);
  res.status(201).json(nuevaTarea);
  console.log(tareas)
});

app.get("/tareas", (req, res) => {
  const { estado } = req.query;

  if (estado === "completadas") {
    return res.json(tareas.filter(t => t.completada));
  }

  if (estado === "pendientes") {
    return res.json(tareas.filter(t => !t.completada));
  }

  res.json(tareas);
});

app.put("/tareas/:nombre", (req, res) => {
  const { nombre } = req.params;
  const { completada } = req.body;

  const tarea = tareas.find(t => t.nombre === nombre);
  if (!tarea) {
    return res.status(404).json({ error: "Tarea no encontrada." });
  }

  if (typeof completada !== "boolean") {
    return res.status(400).json({ error: "Debe enviar el estado (true/false)." });
  }

  tarea.completada = completada;
  res.json(tarea);
});


app.listen(port, () => {
  console.log(`Ejercicio 3 en puerto ${port}`);
});

