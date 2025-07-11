import { db } from '@/server/db';
import { auth, clerkClient } from '@clerk/nextjs/server'
import { notFound, redirect } from 'next/navigation';

const SyncUser = async () => {

const {userId} = await auth();

if(!userId){
    throw new Error("User not found");
}

const client=await clerkClient();

const user=await client.users.getUser(userId);

if(!user.emailAddresses[0]?.emailAddress){
    return notFound()
}


    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await db.user.upsert({
        where: {
            emailAddress: user.emailAddresses[0].emailAddress??"",
        },
        update: {
            imageUrl: user.imageUrl ,
            firstName: user.firstName ,
            lastName: user.lastName ,
        },
        create: {
            id: userId,
            imageUrl: user.imageUrl ,
            emailAddress: user.emailAddresses[0].emailAddress??"",
            firstName: user.firstName ,
            lastName: user.lastName,
        },
    });

    return redirect('/dashboard');
}

export default SyncUser