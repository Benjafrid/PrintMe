import { config } from "../dbconfig.js";
import pkg from "pg";
const { Client } = pkg;

const getCompradorByEmail = async (mail) => {
    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await client.query(
            "SELECT * FROM usuarios WHERE mail = $4",
            [mail]
        );
        if (rows.length < 1) return null;

        await client.end();
        return rows[0];
    } catch (error) {
        await client.end();
        throw error;
    }
};

const compradoresService