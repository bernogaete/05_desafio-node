const express = require("express");
const { obtenerJoyas, generarHATEOAS, obtenerJoyasPorFiltros } = require("./consultas");

const app = express();
const port = 3000;

// Ruta para obtener todas las joyas con HATEOAS
app.get("/joyas", async (req, res) => {
  try {
    const { limits, order_by, page } = req.query; 
    const joyas = await obtenerJoyas({
      limits: Number(limits) || 10,
      order_by: order_by || "id_ASC",
      page: Number(page) || 1,
    });
    const hateoasResponse = generarHATEOAS(joyas); // Llamamos a la función "generar HATEOAS"
    res.json(hateoasResponse); // Se devuelve la respuesta en formato JSON
  } catch (error) {
    console.error("Error al obtener las joyas:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Activamos el servidor en el puerto 3000
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

app.get("/joyas/filtros", async (req, res) => {
  try {
      const queryStrings = req.query;
      const joyas = await obtenerJoyasPorFiltros(queryStrings);
      res.json(joyas);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

app.get("/joyas/:id", async (req, res) => {
  try {
      const { id } = req.params;
      const consulta = "SELECT * FROM inventario WHERE id = $1";
      const { rows: [joya] } = await pool.query(consulta, [id]);
      if (!joya) {
          return res.status(404).json({ error: "Joya no encontrada" });
      }
      res.json(joya);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send(`
    <h1>Desafio Node N°05<h1>
    <h2>API REST - Inventario de Joyas</h2>
    <h4>Alumno: Bernardo Gaete</h4>
   
  `);
});
