import { defineMiddlewares, authenticate } from "@medusajs/framework/http";
import type { AuthenticatedMedusaRequest, MedusaRequest, MedusaResponse, MedusaNextFunction } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

async function requireOrderOwner(req: MedusaRequest, res: MedusaResponse, next: MedusaNextFunction) {
  const actor = (req as AuthenticatedMedusaRequest).auth_context?.actor_id;
  if (!actor) return res.status(401).json({ message: "Sign in to view your orders." });
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const { data } = await query.graph({ entity: "order", fields: ["id"], filters: { id: req.params.id, customer_id: actor } });
  if (!data.length) return res.status(404).json({ message: "Order not found." });
  return next();
}
export default defineMiddlewares({ routes: [
  { matcher: "/store/downloads*", middlewares: [authenticate("customer", ["session", "bearer"])] },
  { matcher: "/store/book-orders/*", middlewares: [authenticate("customer", ["session", "bearer"], { allowUnauthenticated: true })] },
  { matcher: "/store/orders/:id", method: "GET", middlewares: [authenticate("customer", ["session", "bearer"]), requireOrderOwner] },
] });
