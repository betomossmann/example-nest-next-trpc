// ! Example of a client side file

"use client";

import { useEffect, useState } from "react";
import { trpc } from "./trpc";

export default function Clientside() {
  const [greeting, setGreeting] = useState("");
  useEffect(() => {
    trpc.hello.query({ name: `Client side` }).then((response) => {
      setGreeting(response);
    });
  });

  return (
    <div>
      <h1>I am client side - {greeting}</h1>
    </div>
  );
}
