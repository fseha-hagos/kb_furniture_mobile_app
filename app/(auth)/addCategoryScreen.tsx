import { RequireAdmin } from '../components/RequireAdmin';

function AddCategoryContent() {
  // ...existing add category UI...
  return <>{/* Add Category UI here */}</>;
}

export default function AddCategoryScreen() {
  return (
    <RequireAdmin>
      <AddCategoryContent />
    </RequireAdmin>
  );
} 