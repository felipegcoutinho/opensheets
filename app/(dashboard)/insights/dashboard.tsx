"use client";

import { Input } from "@/components/ui/input";
import { useChat } from "@ai-sdk/react";

function Home({ lancamentos, analysis }) {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <>
      <div>
        <h3>Análise Financeira:</h3>
        <div>{analysis}</div> {/* Exibe a análise retornada pela IA */}
      </div>

      {messages.map((message) => (
        <div key={message.id}>
          {message.role === "user" ? "User: " : "AI: "}
          {message.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <Input name="prompt" value={input} onChange={handleInputChange} />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default Home;
