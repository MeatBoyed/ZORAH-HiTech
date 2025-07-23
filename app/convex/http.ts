import { httpRouter } from "convex/server";
import { postReport } from "./reportsHttpAction";

const http = httpRouter();

http.route({
    path: "/reports",
    method: "POST",
    handler: postReport,
});

// Convex expects the router to be the default export of `convex/http.js`.
export default http;