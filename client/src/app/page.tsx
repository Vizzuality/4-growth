import { User } from "@shared/dto/users/user.entity";

import ComingSoon from "@/containers/coming-soon";

const user = new User();
user.username = "Andres";

export default function Home() {
  return (
    <main className="bg-blue-900 min-h-screen">
      {user.username}
      <ComingSoon />
    </main>
  );
}
