import { z } from "zod";
import {createTRPCRouter, protectedProcedure} from "../trpc";
import { pollCommits } from "@/lib/github";
import { checkCredits, indexGithubRepo } from "@/lib/github-loader";

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure.input(
    z.object({
        name: z.string(),
        githubUrl:z.string(),
        githubToken: z.string().optional(),
        // Add any other fields you need for the project
        
    })
  ).mutation(async ({ ctx, input }) => {

    const user=await ctx.db.user.findUnique({
      where:{
        id:ctx.user.userId!
      },
      select:{
        credits:true
      }
    })


    if(!user){
      throw new Error('User not Found')

    }

    const currentCredits=user.credits||0
    const fileCount=await checkCredits(input.githubUrl,input.githubToken)

    if(currentCredits<fileCount){
      throw new Error('Insufficent Credits')
    }


   const project =await ctx.db.project.create({

    data:{
        githubUrl: input.githubUrl,
        name: input.name,
        userToProjects:{
            create :{
                userId : ctx.user.userId!,
            }
        }
    }
   })
    await indexGithubRepo(project.id, input.githubUrl, input.githubToken);
    
    // Start polling commits for the new project
     await pollCommits(project.id)

     await ctx.db.user.update({
      where:{
        id:ctx.user.userId!
      },
      data:{
        credits:{
          decrement:fileCount
        }
      }
     })

    return project;
  }),

  getProjects: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.project.findMany({
      where: {
        userToProjects: {
          some: {
            userId: ctx.user.userId!,
          },
        },
        deletedAt: null, // Ensure we only get non-deleted projects
      },
      
    });

    
  }),

  getCommits: protectedProcedure.input(z.object({
    projectId: z.string()
  })).query( async ({ctx, input})=>{
    pollCommits(input.projectId).then().catch((error) => {
      console.log(error)
    })
    return await ctx.db.commit.findMany({
      where:{
        projectId:input.projectId
      }
    })
  }),

  saveAnswer:protectedProcedure.input(z.object({
    projectId:z.string(),
    question: z.string(),
    answer:z.string(),
    filesReferences:z.any()
  })).mutation(async ({ctx,input})=>{
    return await ctx.db.question.create({
      data:{
        answer:input.answer,
        question:input.question,
        projectId:input.projectId,
        filesReferences:input.filesReferences,
        userId:ctx.user.userId!
      }
    })
  }),
  getQuestions:protectedProcedure.input(z.object({
    projectId:z.string()
  })).query(async ({ctx,input})=>{
    return await ctx.db.question.findMany({
      where:{
        projectId:input.projectId
      },
      include:{
        user:true
      },
      orderBy:{
        createdAt:'desc'
      }
    })
  }),
  uploadMeeting:protectedProcedure.input(z.object({
    projectId:z.string(),
    meetingUrl:z.string(),
    name:z.string(),

  })).mutation(async ({ctx,input})=>{
    const meeting =await ctx.db.meeting.create({
      data:{
        projectId:input.projectId,
        name:input.name,
        meetingUrl:input.meetingUrl,
        status:"PROCESSING"
      }
    })

    return meeting
  }),

  getMeetings:protectedProcedure.input(z.object({
    projectId:z.string()
  })).query(async ({ctx,input})=>{
    return await ctx.db.meeting.findMany({
      where:{
        projectId:input.projectId,  
      },
      include:{
        issues:true
      }
    })
  }),
  deleteMeeting: protectedProcedure
  .input(z.object({ meetingId: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Step 1: Delete related issues
    await ctx.db.issue.deleteMany({
      where: { meetingId: input.meetingId },
    });

    // Step 2: Delete the meeting
    return await ctx.db.meeting.delete({
      where: { id: input.meetingId },
    });
  }),

  getMeetingById:protectedProcedure.input(z.object({
    meetingId:z.string()
  })).query(async({ctx,input})=>{
    return await ctx.db.meeting.findUnique({
      where:{
        id:input.meetingId
      },
      include:{
        issues:true
      }
    })
  } ),
  archiveProject:protectedProcedure.input(z.object({
    projectId:z.string()
  })).mutation(async ({ctx,input})=>{
    return await ctx.db.project.update({
      where:{
        id:input.projectId
      },
      data:{
        deletedAt:new Date()
      }
    })
  }),
  getTeamMembers:protectedProcedure.input(z.object({
    projectId:z.string()
  })).query(async ({ctx,input})=>{
    return await ctx.db.userToProject.findMany({
      where:{
        projectId:input.projectId
      },
      include:{
        user:true
      }
    })
  }),
  getMyCredits:protectedProcedure.query(async ({ctx})=>{
    return await ctx.db.user.findUnique({
      where:{
        id:ctx.user.userId!
      },
      select:{
        credits:true
      }
    })
  }),
  checkCredits:protectedProcedure.input(z.object({
    githubUrl:z.string(),
    githubToken:z.string().optional()
  })).mutation(async ({ctx,input})=>{
    const fileCount=await checkCredits(input.githubUrl,input.githubToken)
    const userCredits=await ctx.db.user.findUnique({
      where:{
        id:ctx.user.userId!
      },
      select:{
        credits:true
      }
    })

    return {fileCount ,userCredits:userCredits?.credits || 0}
  })
});