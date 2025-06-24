// This file is needed to update the isPaid and paidAt columns of our order table when a stripe payment is done successfully
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { updateOrderToPaid } from "@/lib/actions/order.actions";

// We have added a webhook to stripe dashboard for the charge.succeeded event and we STRIPE_WEBHOOK_SECRET straight to the vercel env

export async function POST(req: NextRequest) {
  // Build the webhook event
  const event = await Stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get("stripe-signature") as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );

  // Check for successful payment
  if (event.type === "charge.succeeded") {
    const { object } = event.data;

    // Update order status
    await updateOrderToPaid({
      orderId: object.metadata.orderId,
      paymentResult: {
        id: object.id,
        status: "COMPLETED",
        email_address: object.billing_details.email!,
        pricePaid: (object.amount / 100).toFixed(),
      },
    });

    return NextResponse.json({
      message: "updateOrderToPaid was successfull",
    });
  }

  return NextResponse.json({
    message: "event is not charge.succeeded",
  });
}
