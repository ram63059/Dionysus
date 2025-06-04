import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server"; // or your own auth lib

export default async function Home() {
  const { userId } =  await auth(); // fetch the user session

  // Redirect to /dashboard if user is logged in
  if (userId) {
    redirect("/dashboard");
  }

  // Else show the public landing page
  return (
    <main className="flex items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Welcome to Dionysus</h1>
    </main>
  );
}