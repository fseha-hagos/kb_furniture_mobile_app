import { useUser } from '@clerk/clerk-expo';

export function useUserRole() {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) return { role: null, isLoaded: false };

  // Assuming role is stored in publicMetadata
  const role = user.publicMetadata?.role as string | undefined;

  return { role, isLoaded: true };
}

export default useUserRole; 