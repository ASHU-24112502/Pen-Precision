import { Inngest } from "inngest";
import connectDB from "./db";
import User from "./models/User";

export const inngest = new Inngest({
  id: "pen-precision-next",
});

// CREATE
export const syncUserCreation = inngest.createFunction(
  { id: "pen-precision/Sync-User-from-Clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    await connectDB();

    await User.create({
      _id: id,
      name: `${first_name ?? ""} ${last_name ?? ""}`,
      email: email_addresses?.[0]?.email_address,
      imageUrl: image_url,
    });
  }
);

// UPDATE
export const syncUserUpdation = inngest.createFunction(
  { id: "pen-precision/Update-User-from-Clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    await connectDB();

    await User.findByIdAndUpdate(id, {
      name: `${first_name ?? ""} ${last_name ?? ""}`,
      email: email_addresses?.[0]?.email_address,
      imageUrl: image_url,
    });
  }
);

// DELETE
export const syncUserDeletion = inngest.createFunction(
  { id: "pen-precision/Delete-User-from-Clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();
    await User.findByIdAndDelete(event.data.id);
  }
);
