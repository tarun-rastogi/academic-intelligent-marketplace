import type { FastifyReply, FastifyRequest } from "fastify";
import { getUserFromSessionToken, sessionCookieName } from "./session.js";

export async function requireUser(request: FastifyRequest, reply: FastifyReply) {
  const token = request.cookies[sessionCookieName()];
  const user = await getUserFromSessionToken(token);
  if (!user) {
    return reply.status(401).send({ error: "Unauthorized" });
  }
  request.authUser = user;
}
