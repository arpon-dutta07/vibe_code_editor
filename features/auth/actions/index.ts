"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";


export const getUserById = async (id:string)=>{
    try {
        const user = await db.user.findUnique({
            where:{id},
            include:{accounts:true}
        })
        return user
    } catch (error) {
        console.log(error)
        return null
    }
}

export const getAccountByUserId = async (userId:string)=>{
    try {
        const account = await db.account.findFirst({
            where:{
                userId
            }
        })
        return account
    } catch (error) {
        console.log(error)
        return null
    }
}

export const currentUser = async()=>{
    const user = await auth()
    return user?.user;
}

export const updateUserProfile = async (name: string) => {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" }
        }

        const updatedUser = await db.user.update({
            where: { id: session.user.id },
            data: { name }
        })

        return { success: true, user: updatedUser }
    } catch (error) {
        console.error("Failed to update user profile:", error)
        return { success: false, error: "Failed to update profile" }
    }
}