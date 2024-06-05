import { auth } from "@/auth";

export default async function Profile() {
  const session = await auth();

  return (
    <ul>
      <li>{session?.user?.email}</li>
      <li>{session?.user?.username}</li>
    </ul>
  );
}
