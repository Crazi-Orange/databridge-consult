import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';

export const metadata = {
  title: "DataBridge Consult",
  description: "Platform for Data Analysis and IT Consulting Services",
 };

export default function RootLayout({ children }:
  Readonly<{ children: React.ReactNode }>)
{
  return (
    <html lang="en">
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
      </body>
    </html>
  );
}
