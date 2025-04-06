// app/layout.js
export const metadata = {
    title: "Tennis App",
    description: "Your awesome tennis app",
  };
  
  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }
  