import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Dr. K.C. Memorial Gupta Hospital | Gajraula, Uttar Pradesh",
    description: "Dr. K.C. Memorial Gupta Hospital in Gajraula, UP - 30 bed facility with state-of-the-art technology. Offering general medicine, pediatrics, emergency care, and more. Book your appointment today.",
    keywords: "Dr K.C. Memorial Gupta Hospital, Gajraula hospital, Uttar Pradesh healthcare, medical services, emergency care, pediatrics, general medicine, hospital beds",
    authors: [{ name: "Dr. K.C. Memorial Gupta Hospital" }],
    openGraph: {
        title: "Dr. K.C. Memorial Gupta Hospital | Gajraula, UP",
        description: "Your trusted healthcare partner in Gajraula. 30 bed facility with advanced technology for quality patient care.",
        type: "website",
        locale: "en_IN",
    },
    twitter: {
        card: "summary_large_image",
        title: "Dr. K.C. Memorial Gupta Hospital | Gajraula",
        description: "30 bed healthcare facility with state-of-the-art technology in Gajraula, Uttar Pradesh.",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" type="image/svg+xml" href="/images/logo-new.svg" />
                <link rel="apple-touch-icon" href="/images/logo-new.svg" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#0ea5e9" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Hospital",
                            "name": "Dr. K.C. Memorial Gupta Hospital",
                            "description": "30 bed healthcare facility with state-of-the-art technology in Gajraula, Uttar Pradesh",
                            "medicalSpecialty": ["GeneralPractice", "Pediatrics", "Emergency", "Surgery"],
                            "availableService": [
                                { "@type": "MedicalProcedure", "name": "General Medicine" },
                                { "@type": "MedicalProcedure", "name": "Pediatrics" },
                                { "@type": "MedicalProcedure", "name": "Emergency Care" },
                            ],
                            "numberOfBeds": 30,
                            "openingHours": "Mo-Su 00:00-24:00",
                            "address": {
                                "@type": "PostalAddress",
                                "addressLocality": "Gajraula",
                                "addressRegion": "Uttar Pradesh",
                                "addressCountry": "IN",
                            },
                        }),
                    }}
                />
            </head>
            <body>{children}</body>
        </html>
    );
}
