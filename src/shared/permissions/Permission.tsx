import { useAuth } from "@/providers/AuthProvider";

interface Props {
  allowed: PermissionName;
  children: React.ReactNode;
}

export default function Permission({ allowed, children }: Props) {
  const { user } = useAuth();

  if (!user) return null;

  if (!allowed.includes(user.role.name)) {
    return null;
  }

  return <>{children}</>;
}