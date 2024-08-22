import '@/styles/globals.css';

export const metadata = {
  title: '2024 라이징꿈엽서',
  description: '',
};
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  minimunScale: 0,
  maximumScale: 1,
  viewportFit: 'cover',
};
export default function RootLayout ({ children }) {
  return (
    <html lang='ko'>
      <head>
        <meta charSet='UTF-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge, chrome=1' />
        <meta name='viewport' content='width=device-width, initial-scale=1, minimum-scale=0, maximum-scale=1' />
        <meta name='robots' content='index,follow' />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"></link>
        <title>kDev First Project</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
