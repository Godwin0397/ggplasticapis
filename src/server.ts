import mongoose from 'mongoose';
import app from './app'
import config from './utlis/config'

import cluster from "cluster";
import os from "os";

// Force round-robin scheduling
cluster.schedulingPolicy = cluster.SCHED_RR;

const numCPUs = os.cpus().length;


if (cluster.isPrimary) {
    console.log("Master:", process.pid);
    console.log("CPUs:", numCPUs);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });

}
else {
    console.log(`Worker ${process.pid} started`);
    mongoose.connect(config.mongodb_url).then(() => {
        console.log("MongoDB Connected Successfully!!!")
        app.listen(config.port, '0.0.0.0', () => {
            console.log(`Server is running on port: ${config.port}`)
        })
    }).catch((err: any) => {
        console.log("MongoDB Connection Failed", err)
        process.exit(1);
    })
}