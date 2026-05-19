import AdminClient from "@/components/admin/AdminClient";

export const metadata = {
  title: "Create Service"
};

export default async function AdminServiceFormPage({ searchParams }) {
  const params = await searchParams;
  return <AdminClient view="serviceForm" editId={params?.id || ""} />;
}
