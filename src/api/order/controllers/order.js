"use strict";

// @ts-ignore
const stripe = require("stripe")(
  "sk_test_51PIEmLIODRq79970BemRPxgmcBQaerZyKEdoWzZYAT0OxaY812kNdCSuubVExIx7oXe2RHOmmOg6rwpJ0dmqGcQD00cyRlBrCC",
);

function calcDiscountPrice(price, discount) {
  if (!discount) return price;

  const discountAmount = (price * discount) / 100;
  const result = price - discount;

  return result.toFixed(2);
}
/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async paymentOrder(ctx) {
    // @ts-ignore
    const { token, products, userId, addressShipping } = ctx.request.body;

    let totalPayment = 0;
    products.forEach((product) => {
      const priceTemp = calcDiscountPrice(product.price, product.discount);

      totalPayment += Number(priceTemp) * product.quantity;
    });

    const charge = await stripe.charges.create({
      amount: Math.round(totalPayment * 100),
      currency: "MXN",
      source: token,
      description: `User ID: ${userId}`,
    });

    const data = {
      products,
      user: userId,
      totalPayment,
      idPayment: charge.id,
      addressShipping,
    };

    const model = strapi.contentTypes["api::order.order"];
    const validData = await strapi.entityValidator.validateEntityCreation(
      model,
      // @ts-ignore
      data,
    );

    const entry = await strapi.db
      .query("api::order.order")
      // @ts-ignore
      .create({ data: validData });

    return entry;
  },
}));
