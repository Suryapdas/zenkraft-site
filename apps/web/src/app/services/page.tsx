import type { Metadata } from "next";
import { api } from "@/lib/api-client";
import { ServiceCard } from "@/components/ServiceCard";

export const metadata: Metadata = {
  title: "Services",
  description: "Interior design, architecture, construction, turnkey execution and renovation services.",
};

export default async function ServicesPage() {
  const services = await api.listServices();
  const [featured, ...rest] = services;

  return (
    <div className="mx-auto max-w-container-max px-margin-mobile py-section-gap md:px-margin-desktop">
      <h1 className="max-w-4xl font-display text-display-lg-mobile text-primary md:text-display-lg">Our Services</h1>
      <p className="mt-6 max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
        Meticulous attention to detail across every phase of the architectural and interior design lifecycle. We
        deliver silent elegance through comprehensive, turnkey solutions.
      </p>

      {services.length > 0 ? (
        <div className="mt-16 grid grid-cols-1 gap-gutter md:grid-cols-12">
          {featured && (
            <div className="md:col-span-8">
              <ServiceCard service={featured} />
            </div>
          )}
          {rest.map((service) => (
            <div key={service.slug} className="md:col-span-4">
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-16 font-body-md text-body-md text-on-surface-variant">
          Services will appear here once published.
        </p>
      )}
    </div>
  );
}
