const express = require("express");
const dotenv = require("dotenv");
const identifyRoutes = require("./routes/identifyRoutes");

dotenv.config();
const app = express();
app.use(express.json());

app.use("/identify", identifyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
