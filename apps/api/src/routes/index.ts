import { Router } from "express";
import { contentRouter } from "./public/content.route.js";
import { servicesRouter } from "./public/services.route.js";
import { projectsRouter } from "./public/projects.route.js";
import { contactRouter } from "./public/contact.route.js";
import { leadsRouter } from "./public/leads.route.js";
import { mediaRouter } from "./public/media.route.js";

export const apiV1Router = Router();

apiV1Router.use(contentRouter);
apiV1Router.use(servicesRouter);
apiV1Router.use(projectsRouter);
apiV1Router.use(contactRouter);
apiV1Router.use(leadsRouter);
apiV1Router.use(mediaRouter);
