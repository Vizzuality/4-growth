import { withAuth } from "next-auth/middleware";

export const config = { matcher: ["/profile"] };

export default withAuth({
  pages: {
    signIn: "/auth/signin",
  },
});
