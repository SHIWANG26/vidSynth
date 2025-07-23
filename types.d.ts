import { Connection } from "mongoose";

declare global {
    var mongoose: {
        conn: Connection | null;
        Promise: Promise<Connection> | null;
    }
}

export {};