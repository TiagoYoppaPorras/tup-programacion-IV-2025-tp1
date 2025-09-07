import express from "express";
const app = express();
const port = 3001;
app.use(express.json());

let alumnos = [];

function calcularPromedio(notas) {
  return notas.reduce((acc, n) => acc + n, 0) / notas.length;
}

function estadoAlumno(promedio) {
  if (promedio < 6) return "reprobado";
  if (promedio < 8) return "aprobado";
  return "promocionado";
}

app.post("/alumnos", (req, res) => {
  const { nombre, notas } = req.body;

  if (!nombre || !Array.isArray(notas) || notas.length !== 3) {
    return res.status(400).json({ error: "Debe enviar nombre y tres notas." });
  }

  if (alumnos.find(a => a.nombre === nombre)) {
    return res.status(400).json({ error: "El alumno ya existe." });
  }

  if (notas.some(n => isNaN(n) || n < 0 || n > 10)) {
    return res.status(400).json({ error: "Las notas deben ser números entre 0 y 10." });
  }

  const nuevoAlumno = { nombre, notas };
  alumnos.push(nuevoAlumno);
  res.status(201).json(nuevoAlumno);
});

app.get("/alumnos", (req, res) => {
  const resultado = alumnos.map(a => {
    const promedio = calcularPromedio(a.notas);
    return { ...a, promedio, estado: estadoAlumno(promedio) };
  });
  res.json(resultado);
});

app.get("/alumnos/:nombre", (req, res) => {
  const { nombre } = req.params;
  const alumno = alumnos.find(a => a.nombre === nombre);

  if (!alumno) {
    return res.status(404).json({ error: "Alumno no encontrado." });
  }

  const promedio = calcularPromedio(alumno.notas);
  res.json({ ...alumno, promedio, estado: estadoAlumno(promedio) });
});

app.put("/alumnos/:nombre", (req, res) => {
  const { nombre } = req.params;
  const { notas } = req.body;

  const alumno = alumnos.find(a => a.nombre === nombre);
  if (!alumno) {
    return res.status(404).json({ error: "Alumno no encontrado." });
  }

  if (!Array.isArray(notas) || notas.length !== 3) {
    return res.status(400).json({ error: "Debe enviar tres notas." });
  }

  if (notas.some(n => isNaN(n) || n < 0 || n > 10)) {
    return res.status(400).json({ error: "Las notas deben ser números entre 0 y 10." });
  }

  alumno.notas = notas;
  res.json(alumno);
});

app.listen(port, () => {
  console.log(`Ejercicio 2 en puerto ${port}`);
});

