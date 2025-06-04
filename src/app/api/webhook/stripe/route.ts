// /api/webhook/stripe

import { NextRequest,NextResponse } from "next/server";
import  {headers} from 'next/headers'
import Stripe from "stripe";
import { db } from "@/server/db";

const stripe=new Stripe(process.env.STRIPE_SECRET_KEY!,{
    apiVersion:'2025-05-28.basil'
})

export async  function  POST(request:Request){
    const body=await request.text();
    const signature =(await headers()).get('Stripe-Signature') as string

    let event : Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body,signature,process.env.STRIPE_WEBHOOK_SECRET!)
        console.log('ths is evetn',event)
    } catch (error) {
        return NextResponse.json({error:'invalid signature'},{status:400})
    }

    const session= event.data.object as Stripe.Checkout.Session

    console.log('this is session',session)

    console.log(event.type)

    if(event.type === 'checkout.session.completed'){
        const credits=Number(session.metadata?.['credits'])
        const userId=session.client_reference_id

        console.log("SESSION DEBUG:", {
        metadata: session.metadata,
        client_reference_id: session.client_reference_id
        });

        if(!userId || !credits){
            return NextResponse.json({error:'Missing userId or credits'},{status:400})
        }

        await db.stripeTransaction.create({
            data:{
                userId,
                credits
            }
        })

        await db.user.update({
            where:{
                id:userId
            },
            data:{
                credits:{
                    increment:credits
                }
            }
        })

        return NextResponse.json({message:"credits added successfully"},{status:200})
    }

    return NextResponse.json({message:'hello world'})
}