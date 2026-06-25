import Footer from "../../components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5]">
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
