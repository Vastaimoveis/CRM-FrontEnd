import { useAuth } from "@/providers/AuthProvider";
import type { UserRoles } from "@/types/UserTypes";

interface Props {
  allowed: UserRoles[];
  children: React.ReactNode;
}

export default function Permission({ allowed, children }: Props) {
  const { user } = useAuth();

  if (!user) return null;

  if (!allowed.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}