import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const DemoPayload = z.object({
  token: z.string().trim().min(3).max(40).regex(/^tok[_-]?teste[_-]?\d{1,4}$/i, "Use um token fictício, ex.: tok-teste-01"),
  amount: z.number().min(0).max(100000),
  note: z.string().trim().max(120).optional(),
});

export const Route = createFileRoute("/api/demo-token")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ ok: false, error: "JSON inválido" }, { status: 400 });
        }

        const parsed = DemoPayload.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
            { status: 400 },
          );
        }

        const received = {
          ...parsed.data,
          receivedAt: new Date().toISOString(),
          mode: "demo" as const,
        };

        console.log("[demo-token] payload recebido:", JSON.stringify(received));

        return Response.json({ ok: true, received });
      },
    },
  },
});
