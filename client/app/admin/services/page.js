import AdminClient from "@/components/admin/AdminClient";

export const metadata = {
  title: "All Services"
};

export default function AdminServicesPage() {
  return <AdminClient view="services" />;
}
