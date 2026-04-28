import { redirect } from "next/navigation";

export default function MediumFlowRedirectPage() {
  redirect("/internal/flows/medium/available");
}
