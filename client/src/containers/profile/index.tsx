import { auth } from "@/app/api/auth/[...nextauth]/config";

export default async function Profile() {
  const session = await auth();

  return (
    <ul>
      <li>{session?.user?.email}</li>
      <li>{session?.user?.username}</li>
    </ul>
  );
}
