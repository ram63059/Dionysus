"use client";

import useProject from "@/hooks/use-project";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";

import React from "react";
import CommitLog from "./commit-Log";

const DashboardPage = () => {
  const { project } = useProject();

  return (
    <div>

      {project?.id}
      
      <div className="flex flex-wrap items-center  justify-between ">
        {/* github link */}
        <div className=" w-fit bg-primary mt-3 rounded-md px-4 py-3">
          <div className="flex items-center">
            <Github className="size-5 text-white" />
            <div className="ml-2">
              <p className="text-sm font-medium text-white">
                this project is linked to{" "}
                <Link
                  href={project?.githubUrl ?? " "}
                  className="inline-flex items-center text-white/80 hover:underline"
                >
                  {project?.githubUrl}
                  <ExternalLink className="ml-1 size-4 text-white/80" />
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="h-4"></div>

        <div className="flex items-center gap-4">
          team members
          invite button
          Archive button

        </div>

      </div>

       <div className="mt-4">
           <div className="grid grid-cols-1 gap-4  sm:grid-cols-2  ">
           AskQuestionCard
           meetingcard

            </div>
        </div>

        <div className="mt-8">
          <CommitLog/>
        </div>


    </div>
  );
};

export default DashboardPage;
