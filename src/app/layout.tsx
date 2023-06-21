import Navbar from "@/components/Navbar/Navbar";
import Providers from "@/utils/Providers";

export const metadata = {
  title: "Reddit",
  description: "Reddit clone built with nextjs",
  icons:{
    icon:'/images/redditFace.svg'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
