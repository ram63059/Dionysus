import { processMeeting } from "@/lib/assembly";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";


const bodyParser=z.object({
    meetingUrl:z.string(),
    meetingId:z.string(),
    projectId:z.string()
})



export const maxDuration=300;

export async function POST(req :NextRequest){
    const {userId}= await auth()

    if(!userId) return NextResponse.json({error:'unauthorized'},{status:401})

            try {

                const body=await req.json()

                const { meetingUrl, meetingId,projectId}=bodyParser.parse(body)
                
                const {summaries}=await processMeeting(meetingUrl)

                await db.issue.createMany({
                    data:summaries.map( summary =>({
                        start:summary.start,
                        end:summary.end,
                        gist:summary.gist,
                        headline:summary.headline,
                        summary:summary.summary,
                        meetingId
                    }))
                })

                await db.meeting.update({
                    where:{
                        id:meetingId
                    },
                    data:{
                        status:'COMPLETED',
                        name:summaries[0]!.headline
                    }
                })
                return NextResponse.json({success:true},{status:200})
                
            } catch (error) {
                console.error(error)
                return NextResponse.json({error:"internal sever error"},{status:500})
            }
}