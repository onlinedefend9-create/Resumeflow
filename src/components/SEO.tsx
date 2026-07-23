import { Helmet, HelmetProvider } from 'react-helmet-async';

export const SEO = ({ title, description }: { title: string; description: string }) => (
  <Helmet>
    <title>{title} | ResumeFlow</title>
    <meta name="description" content={description} />
  </Helmet>
);
