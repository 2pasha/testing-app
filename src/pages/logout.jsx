import { useRouter } from "next/router";

export default function Logout() {
  const router = useRouter();

  console.log(router);

  // router.push("/");

  return <p>Logging out...</p>;
}
