export const metadata = {
  title: "Next.js",
  description: "Generated by Scott Blodgett - 2",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <style>
          {`
            body {
              font-family: Arial, sans-serif;
            }
          `}
        </style>
      </head>
      <body>{children}</body>
    </html>
  );
}
