import { app } from "./app";

const port = Number(process.env.PORT ?? 3000);
app.listen(port);
console.log(JSON.stringify({ level: "info", event: "api_started", port }));
