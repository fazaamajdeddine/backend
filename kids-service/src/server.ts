import { Server } from "http";
import app from "./app";
import { Kid, connectDB } from "./database";
import config from "./config/config";
import { rabbitMQService } from "./services/RabbitMQService";

let server: Server;
connectDB();

server = app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});

const initializeRabbitMQClient = async () => {
    try {
        await rabbitMQService.init();
        console.log("RabbitMQ client initialized and listening for messages.");
    } catch (err) {
        console.error("Failed to initialize RabbitMQ client:", err);
    }
};

initializeRabbitMQClient();


const exitHandler = () => {
    if (server) {
        server.close(() => {
            console.info("Server closed");
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error: unknown) => {
    console.error(error);
    exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);