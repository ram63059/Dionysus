import { db } from "../server/db";
import {Octokit} from "octokit";

export const octokit =new Octokit({
  auth: process.env.GITHUB_TOKEN,   
});

// const githubUrl="https://github.com/docker/genai-stack";


type Response = {
    commitMessage: string;
    commitHash: string;
    commitAuthorName: string;
    commitAuthorAvatar: string;
    commitDate: string;
}

export const getCommitHashes=async (githubUrl: string): Promise<Response[]> => {

    const [owner ,repo]  = githubUrl.split('/').slice(-2)

    if(!owner || !repo) {
        throw new Error("Invalid github Url")
    }

    const {data} = await octokit.rest.repos.listCommits({
       owner,
       repo
       
    })


    const sortedCommits = data.sort((a :any, b : any) => new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()) as any[];

    return sortedCommits.slice(0,10).map((commit:any)=>({
        commitMessage: commit.commit.message?? "",
        commitHash: commit.sha as string,
        commitAuthorName: commit.commit?.author?.name ?? "",
        commitAuthorAvatar: commit?.author?.avatar_url ?? "" ,
        commitDate:commit.commit?.author?.date ?? ""
    }))
    

    
}

export const pollCommits= async (projectId:string)=>{
    const {project ,githubUrl}=await fetchProjectGithubUrl(projectId);
    const commitHashes= await getCommitHashes(githubUrl);

    const unprocessedCommits= await filterUnprocessedCommits(projectId, commitHashes);

    console.log("Unprocessed commits:", unprocessedCommits);

    return unprocessedCommits;



}

async function filterUnprocessedCommits(projectId:string, commitHashes:Response[]){

    const processedCommits = await db.commit.findMany({
        where:{
            projectId
        }
    })

    const unprocessedCommits= commitHashes.filter((commit)=>!processedCommits.some((processedCommits)=>processedCommits.commitHash===commit.commitHash))
    return unprocessedCommits;
}

async function fetchProjectGithubUrl(projectId: string) {

    const project=await db.project.findUnique({

        where:{id:projectId},
        select: {
            githubUrl: true,
        }
    })

    if(!project?.githubUrl){
        throw new Error("Project not found or does not have a GitHub URL");
    }

    return {project ,githubUrl: project.githubUrl};
}



await pollCommits("cmb7gputt0000v180vpmmtk5n").then(console.log)
