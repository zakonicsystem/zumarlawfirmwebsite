import AdminClient from "@/components/admin/AdminClient";

export const metadata = {
  title: "All Blogs"
};

export default function AdminBlogsPage() {
  return <AdminClient view="blogs" />;
}
