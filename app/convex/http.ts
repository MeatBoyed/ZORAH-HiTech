import { httpRouter } from "convex/server";
import { postReport, uploadReportPDF } from "./reportsHttpAction";

const http = httpRouter();

http.route({
    path: "/api/reports",
    method: "POST",
    handler: postReport,
});

http.route({
    path: "/api/reports/pdf",
    method: "POST",
    handler: uploadReportPDF,
});

// Convex expects the router to be the default export of `convex/http.js`.
export default http;