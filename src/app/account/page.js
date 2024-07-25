import { auth } from "../_lib/auth";

export default async function Page(props) {
  
  const session = await auth();


  
  return <h1 className="font-semibold text-2xl text-accent-400 mb-7">Welcome {session?.user?.name}</h1>;
}
export const metadata = {
  title: "Account",
};
