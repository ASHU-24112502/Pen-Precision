import { Inngest } from "inngest";
import connectDB from "./db";
import User from "./models/User"; // ✅ make sure this path is correct

// Create Inngest client
export const inngest = new Inngest({
  id: "pen-precision-next",
});

// ✅ CREATE USER
export const syncUserCreation = inngest.createFunction(
  { id: "pen-precision-sync-user-create" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const {
      id,
      first_name,
      last_name,
      email_addresses,
      image_url,
    } = event.data;

    await connectDB();

    await User.create({
      _id: id,
      name: `${first_name ?? ""} ${last_name ?? ""}`,
      email: email_addresses?.[0]?.email_address,
      imageUrl: image_url,
    });
  }
);

// ✅ UPDATE USER
export const syncUserUpdation = inngest.createFunction(
  { id: "pen-precision-sync-user-update" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const {
      id,
      first_name,
      last_name,
      email_addresses,
      image_url,
    } = event.data;

    await connectDB();

    await User.findByIdAndUpdate(id, {
      name: `${first_name ?? ""} ${last_name ?? ""}`,
      email: email_addresses?.[0]?.email_address,
      imageUrl: image_url,
    });
  }
);

// ✅ DELETE USER
export const syncUserDeletion = inngest.createFunction(
  { id: "pen-precision-sync-user-delete" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;

    await connectDB();
    await User.findByIdAndDelete(id);
  }
);
