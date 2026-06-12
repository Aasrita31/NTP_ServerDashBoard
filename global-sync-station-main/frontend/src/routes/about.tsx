import { createFileRoute } from "@tanstack/react-router";
import Layout from "@/components/Layout";
import { AboutPageContent } from "@/components/about/AboutPage";

function AboutPage() {
  return (
    <Layout>
      <AboutPageContent />
    </Layout>
  );
}

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About IITTNiF & NTP Infrastructure • NTP Precision Monitoring" },
      {
        name: "description",
        content:
          "Learn about IIT Tirupati Navavishkar I-Hub Foundation, PNT Laboratory research, and GPS-disciplined Stratum-1 NTP infrastructure.",
      },
    ],
  }),
});
