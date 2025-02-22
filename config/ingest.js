import {Inngest} from "inngest";
import connectDB from "./db";
import User from "@/models/user";

export const inngest = new Inngest({id: "quickcart-next"})

export const syncUserCreation = inngest.createFunction(
    {
        id: 'sync-user-from-clerk',   
    },
    {
        event: 'clerk/user.created'
    },
    async ({event}) => {
        const {id, first_name, last_name, email_addresses, image_url} = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: `${first_name} ${last_name}`,
            imageUrl: image_url
        }
        await connectDB()
        await User.create(userData)
    }
)

export const syncUserUpdate = inngest.createFunction(
    {
        id: 'sync-user-update-from-clerk',   
    },
    {
        event: 'clerk/user.updated'
    },
    async ({event}) => {
        const {id, first_name, last_name, email_addresses, image_url} = event.data
        const userData = {
            email: email_addresses[0].email_address,
            name: `${first_name} ${last_name}`,
            imageUrl: image_url
        }
        await connectDB()
        await User.findByIdAndUpdate(id, userData)
    }
)

export const syncUserDeletion = inngest.createFunction(
    {
        id: 'sync-user-deletion-from-clerk',   
    },
    {
        event: 'clerk/user.deleted'
    },
    async ({event}) => {
        const {id} = event.data
        await connectDB()
        await User.findByIdAndDelete(id)
    }
)