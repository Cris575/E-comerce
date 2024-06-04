"use strict";

// @ts-ignore
const stripe = require("stripe")(
  "sk_test_51PIEmLIODRq79970BemRPxgmcBQaerZyKEdoWzZYAT0OxaY812kNdCSuubVExIx7oXe2RHOmmOg6rwpJ0dmqGcQD00cyRlBrCC",
);

/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async paymentOrder(ctx) {
    console.log("OK");
  },
}));
