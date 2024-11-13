import { redirect } from "next/navigation";

export default function Home() {
  // Temporary redirect to explore page
  redirect("/explore");
  // return (
  //   <main className="min-h-screen bg-blue-900">
  //     <ComingSoon />
  //   </main>
  // );
}
