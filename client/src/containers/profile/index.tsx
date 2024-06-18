import { auth } from "@/app/auth/api/[...nextauth]/config";

export default async function Profile() {
  const session = await auth();

  return (
    <ul>
      <li>{session?.user?.email}</li>
    </ul>
  );
}
