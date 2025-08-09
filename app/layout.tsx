import "./globals.css";
export const metadata = {
  title: "BotScope — обзоры Telegram-ботов",
  description: "3D-страница с обзорами ботов"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
