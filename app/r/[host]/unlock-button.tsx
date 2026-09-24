"use client";
import { useFormStatus } from "react-dom";
import { Icon } from "@/app/components/site-chrome";
export function UnlockButton() {
  const { pending } = useFormStatus();
  return (
    <button className="button button-coral" type="submit" disabled={pending}>
      {pending ? "Opening…" : "Open report"}
      <Icon name="arrow" />
    </button>
  );
}
