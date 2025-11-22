import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Login from "@/components/Login";
import Dashboard from "@/components/Dashboard";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <main className="main-container">
        <Login />
      </main>
    );
  }

  return <Dashboard />;
}
