import amqp, { Channel, Connection } from "amqplib";
import config from "../config/config";
import { Kid } from "../database";
import { ApiError } from "../utils";

class RabbitMQService {
    private requestQueue = "KID_DETAILS_REQUEST";
    private responseQueue = "KID_DETAILS_RESPONSE";
    private connection!: Connection;
    private channel!: Channel;

    constructor() {
        this.init();
    }

    async init() {
        // Establish connection to RabbitMQ server
        this.connection = await amqp.connect(config.msgBrokerURL!);
        this.channel = await this.connection.createChannel();

        // Asserting queues ensures they exist
        await this.channel.assertQueue(this.requestQueue);
        await this.channel.assertQueue(this.responseQueue);

        // Start listening for messages on the request queue
        this.listenForRequests();
    }

    private async listenForRequests() {
        this.channel.consume(this.requestQueue, async (msg) => {
            if (msg && msg.content) {
                const { kidId } = JSON.parse(msg.content.toString());
                const kidDetails = await getKidDetails(kidId);

                // Send the kid details response
                this.channel.sendToQueue(
                    this.responseQueue,
                    Buffer.from(JSON.stringify(kidDetails)),
                    { correlationId: msg.properties.correlationId }
                );

                // Acknowledge the processed message
                this.channel.ack(msg);
            }
        });
    }
}

const getKidDetails = async (kidId: string) => {
    const kidDetails = await Kid.findById(kidId);
    if (!kidDetails) {
        throw new ApiError(404, "Kid not found");
    }

    return kidDetails;
};
export const rabbitMQService = new RabbitMQService();
