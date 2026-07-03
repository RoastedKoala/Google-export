require("dotenv").config();

const { createApp } = require("./server");

const app = createApp(fetch);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server běží na portu ${PORT}`);
});
