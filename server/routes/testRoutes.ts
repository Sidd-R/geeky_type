import express from 'express'
export const testRoutes = express.Router();

import TestController from "../controllers/testController";

testRoutes.route("/").get(TestController.getAllTests);
testRoutes.route("/new").post(TestController.newTest);
testRoutes.route("/all").get(TestController.allTests);