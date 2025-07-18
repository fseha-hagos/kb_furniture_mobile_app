import { RequireAdmin } from '../components/RequireAdmin';

function AddPostContent() {
  // ...existing add post UI...
  return <>{/* Add Post UI here */}</>;
}

export default function AddPostScreen() {
  return (
    <RequireAdmin>
      <AddPostContent />
    </RequireAdmin>
  );
} 