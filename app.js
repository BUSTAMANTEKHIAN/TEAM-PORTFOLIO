"use strict";

require("dotenv").config();
const app = require("./server");
const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`DEV_STUDIO running at http://localhost:${PORT}`);
  });
}

module.exports = app;
