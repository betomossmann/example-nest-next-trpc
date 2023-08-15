import Clientside from "./cliente-side";
import { trpc } from "./trpc";

export default async function Home() {
  const response = await trpc.hello.query({ name: "Beto" });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1>Server side - {response}</h1>
        <Clientside />
      </div>
    </main>
  );
}
