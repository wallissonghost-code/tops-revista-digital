import { redirect } from "next/navigation";
import { requireChatGPTUser } from "../../chatgpt-auth";
import RequestsClient from "./RequestsClient";
import "../admin.css";
import "./requests.css";
export const dynamic="force-dynamic";
export default async function Requests(){const user=await requireChatGPTUser("/admin/solicitacoes");if(user.email.toLowerCase()!=="wallissonghost@gmail.com")redirect("/");return <RequestsClient/>}
