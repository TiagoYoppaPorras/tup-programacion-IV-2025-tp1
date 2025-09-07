import express from "express";
const app = express();
const port = 3000;
app.use(express.json());

let registros = [];

function determinarTipo(figuraBase, figuraAltura) {
  return figuraBase === figuraAltura ? "cuadrado" : "rectángulo";
}

app.post("/calculos", (req, res) => {
  const { base: ladoA, altura: ladoB } = req.body;
  
  if (!ladoA || !ladoB || ladoA <= 0 || ladoB <= 0) {
    return res.status(400).json({ error: "Los valores deben ser números positivos." });
  }
  
  if (isNaN(ladoA) || isNaN(ladoB)) {
    return res.status(404).json({ error: "Tiene que ser un numero" });
  }
    
  const contorno = 2 * (ladoA + ladoB);
  const area = ladoA * ladoB;
  
  const entrada = { base: ladoA, altura: ladoB, perimetro: contorno, superficie: area };
  registros.push(entrada);
  
  res.status(201).json(entrada);

  console.log(registros)
});

app.get("/calculos", (req, res) => {
  const resultado = registros.map(item => ({
    ...item,
    tipo: determinarTipo(item.base, item.altura),
  }));
  
  res.json(resultado);
});

app.get("/calculos/:indice", (req, res) => {
  const { indice } = req.params;
  const entrada = registros[indice];
  
  if (!entrada) {
    return res.status(404).json({ error: "Registro no encontrado." });
  }
  
  res.json({
    ...entrada,
    tipo: determinarTipo(entrada.base, entrada.altura),
  });
});

app.listen(port, () => {
  console.log(`La aplicacion esta funcionando ${port}`);
});
  