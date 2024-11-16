import { Helmet } from "react-helmet-async";

const SEOHelmet = ({ title, description, keywords, imageUrl, url }) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="robots" content="index, follow" />
            <meta name="keywords" content={keywords} />

            {/* Open Graph Tags */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={imageUrl} />
            <meta property="og:url" content={url} />
            <meta property="og:type" content="website" />

            {/* Twitter Tags */}
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={imageUrl} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@predika" />

            {/* Canonical URL */}
            <link rel="canonical" href={url} />
        </Helmet>
    );
};

export default SEOHelmet;
