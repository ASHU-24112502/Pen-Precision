import { Inngest } from "inngest";
import connectDB from "./db";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "pen-precision-next" });

//Inngest Fun to save user data

export const syncUserCreation = inngest.createFunction(
  {
    id: "pen-precision/Sync-User-from-Clerk",
  },
  { event: "clerk/user.created" },
    async ({ event }) => {

        const {id,first_name, last_name, email_address, image_url} = event.data;

        const userData = {
            _id : id,
            name : first_name + " " + last_name,
            email : email_address[0].email_address,
            imageUrl : image_url
        }

        await connectDB();
        await user.create(userData);

    });

    //Inngest Fun to update user data 

    export const syncUserUpdation = inngest.createFunction()(
    {
        id: "Update-User-from-Clerk",
    },
    { event: "clerk/user.updated" },
    async ({ event }) => {

        const {id,first_name, last_name, email_address, image_url} = event.data;

        const userData = {
            _id : id,
            name : first_name + " " + last_name,
            email : email_address[0].email_address,
            imageUrl : image_url
        }
        await connectDB();
        await user.findByIdAndUpdate(id, userData);
    }
)

//Inngest Fun to delete user data

export const syncUserDeletion = inngest.createFunction(
    {
        id: "delete-User-from-Clerk",
    },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        const {id} = event.data;

        await connectDB();
        await user.findByIdAndDelete(id);
    }
);