import { redirect } from "next/navigation";
import { requireChatGPTUser } from "../../chatgpt-auth";
import CategoryEditor from "./CategoryEditor";
import "./categories.css";
export const dynamic="force-dynamic";
export default async function Categories(){const user=await requireChatGPTUser("/admin/categorias");if(user.email.toLowerCase()!=="wallissonghost@gmail.com")redirect("/");return <CategoryEditor/>;}
