import "./globals.css";
import { Inter } from "next/font/google";
import localFont from "next/font/local";

// fonts
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const handwrite = localFont({
  src: "../fonts/handwriting.woff2",
  display: "swap",
  variable: "--font-handwrite",
});

export const metadata = {
  title: "Didactify",
  description: "The platform that enhances your learning experience!",
};

// components
import Header from "@/components/Header";
import UserWidget from "@/components/client/UserWidget";
import LogInButton from "@/components/client/LogInButton";

import { Provider } from "@/components/client/Provider";

import { getAuthSession } from "@/lib/auth";

export default async function RootLayout({ children }) {
  const session = await getAuthSession();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${handwrite.variable}`}
    >
      <body className="dark px-4 font-inter sm:px-8">
        <Provider>
          <Header>
            {session ? <UserWidget session={session} /> : <LogInButton />}
          </Header>
          {children}
        </Provider>
      </body>
    </html>
  );
}
