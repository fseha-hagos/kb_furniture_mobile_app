import { RequireAuth } from '../components/RequireAuth';

function ProfileContent() {
  // ...existing profile UI...
  return <>{/* Profile UI here */}</>;
}

export default function ProfileScreen() {
  return (
    <RequireAuth>
      <ProfileContent />
    </RequireAuth>
  );
} 