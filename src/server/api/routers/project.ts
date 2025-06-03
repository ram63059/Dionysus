import { z } from "zod";
import {createTRPCRouter, protectedProcedure} from "../trpc";
import { pollCommits } from "@/lib/github";
import { indexGithubRepo } from "@/lib/github-loader";

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure.input(
    z.object({
        name: z.string(),
        githubUrl:z.string(),
        githubToken: z.string().optional(),
        // Add any other fields you need for the project
        
    })
  ).mutation(async ({ ctx, input }) => {

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
  })
});