import { handlers } from "@/lib/auth";

// v5 からはhandlers.GET, handlers.POSTをエクスポートすればOK
export const { GET, POST } = handlers;
