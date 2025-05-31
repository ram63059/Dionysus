    import {GithubRepoLoader} from "@langchain/community/document_loaders/web/github";

export const LoadGithubRepo = async (githubUrl: string ,githubToken?:string) => {
    const loader = new GithubRepoLoader( githubUrl,
        {
            accessToken: githubToken || '',
            branch: "main",
            recursive: true,
            ignoreFiles:['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', ],
            unknown: 'warn',
            maxConcurrency:5,

        }
    );
    const docs = await loader.load();
    return docs;
}