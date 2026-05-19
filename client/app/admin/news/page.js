import AdminClient from "@/components/admin/AdminClient";

export const metadata = {
  title: "All News"
};

export default function AdminNewsPage() {
  return <AdminClient view="news" />;
}
