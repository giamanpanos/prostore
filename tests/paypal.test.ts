import { generateAccessToken, paypal } from "../lib/paypal";

// Test to generate access token from paypal
test("generates token from paypal", async () => {
  const tokenResponse = await generateAccessToken();
  console.log(tokenResponse);
  expect(typeof tokenResponse).toBe("string");
  expect(tokenResponse.length).toBeGreaterThan(0);
});

// With the test function we tested that the access token was created and it is a string and greater than 0. The 1st argument is the description of the test and the 2nd one what to check.

// Test to create a paypal order
test("creates a paypal order", async () => {
  const token = await generateAccessToken();
  const price = 10.0;

  const orderResponse = await paypal.createOrder(price);
  console.log(orderResponse);

  expect(orderResponse).toHaveProperty("id");
  expect(orderResponse).toHaveProperty("status");
  expect(orderResponse.status).toBe("CREATED");
});
// In the above test we run the function from paypal and passed a price to it to test it. Then we want to test that the result will have the properties id and status and that status will have the value "CREATED".

// Test to capture payment with mock order
test("simulate capturing a payment from an order", async () => {
  const orderId = "100";

  const mockCapturePayment = jest
    .spyOn(paypal, "capturePayment")
    .mockResolvedValue({
      status: "COMPLETED",
    });

  const captureResponse = await paypal.capturePayment(orderId);
  expect(captureResponse).toHaveProperty("status", "COMPLETED");

  mockCapturePayment.mockRestore();
});
// In the above function we created a random id and used the spyOn method of jest as we can not do an actual payment but we want to simulate it for the capturePayment function of paypal object through passing as resolve value the status "COMPLETED". Then we called the function and passed the id to it and we expect it to have a status property with the COMPLETED value and finally we call the spy function with the mockRestore method to test it.
