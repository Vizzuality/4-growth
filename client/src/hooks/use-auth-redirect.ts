import { useRouter } from "next/navigation";

export function useAuthRedirect() {
  const router = useRouter();
  const callbackUrl = encodeURIComponent(
    `${window.location.pathname}${window.location.search}`,
  );
  const redirect = () => router.push(`/auth/signin?callbackUrl=${callbackUrl}`);

  return { redirect };
}
