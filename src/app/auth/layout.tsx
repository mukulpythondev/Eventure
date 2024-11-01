// app/layout.tsx
// import "@/styles/globals.css";
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
        
          <div className="h-screen w-screen flex bg-slate-950 relative flex-col">
            <Header />
            <main className="flex-grow overflow-auto">{children}</main>
            <Footer />
          </div>
      </body>
    </html>
  );
}
