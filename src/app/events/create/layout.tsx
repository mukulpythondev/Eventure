
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        
          <div className="min-h-screen w-screen flex bg-slate-950 relative flex-col">
            <Header />
            <main className="flex-grow overflow-auto pt-10">{children}</main>
            <Footer />
          </div>
      </body>
    </html>
  );
}