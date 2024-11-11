import { FC } from "react";

import Image from "next/image";

import { ExternalLinkIcon } from "lucide-react";

import Header from "@/containers/header";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Title from "@/components/ui/title";

const About: FC = () => {
  return (
    <div className="container relative flex max-w-[940px] flex-col gap-0.5 py-8">
      <Header />
      <div className="grid gap-0.5 md:grid-cols-2">
        <Card className="order-1 space-y-4">
          <Title as="h2" size="xl">
            About the platform
          </Title>
          <p className="leading-6 text-slate-300">
            Lorem ipsum dolor sit amet consectetur. Molestie at leo quam sit.
            Magna at dui quis sapien volutpat sapien risus dolor. Luctus proin
            sit vitae lorem nascetur leo. Vitae etiam bibendum at enim nam. Est
            in sed volutpat diam purus sagittis. Amet nunc dui duis faucibus
            elit. Dictum aliquam amet sit dictum et dui gravida. Senectus diam
            ipsum vel placerat est elementum nullam.
          </p>
          <p className="leading-6 text-slate-300">
            Enim aliquet blandit scelerisque bibendum sit habitant sagittis sem
            iaculis. Enim at vitae porttitor orci amet in gravida vulputate
            tempus. Felis et consectetur ut mollis sit vestibulum fames donec.
            Ut ullamcorper nunc amet tortor. Tortor purus auctor sit tristique.
          </p>
          <p className="leading-6 text-slate-300">
            Neque morbi cras ac accumsan vel tellus justo. In euismod ultrices
            scelerisque sed. Sed fames elementum nam mauris a. Quis tempus
            tristique vitae ullamcorper accumsan. Mattis eget fermentum nisl
            adipiscing venenatis tempus. Neque varius morbi pellentesque amet
            sagittis. In mi ornare at vitae cras lobortis. Ante magnis nibh leo
            est volutpat. Elit odio sit euismod risus euismod.
          </p>
        </Card>
        <Card className="relative order-2 min-h-[275px] bg-[url('/images/fields.avif')] bg-cover bg-center bg-no-repeat p-0 md:min-h-fit" />
        <Card className="min-h-[275px relative order-2 bg-[url('/images/about/tractor-fields.avif')] bg-cover bg-center bg-no-repeat p-0 md:min-h-fit" />
        <Card className="order-3 space-y-4 md:order-4">
          <Title as="h2" size="xl">
            4Growth project
          </Title>
          <p className="leading-6 text-slate-300">
            The objective of 4Growth is to understand where, how and to what
            extent digital and data technologies in agriculture and forestry are
            being adopted. It will do so by collecting a wide range of ground
            truth data via distributed observatories across Europe and
            identifying key factors or constraints for uptake. 4Growth will
            showcase the uptake through the &apos;4Growth Visualisation
            Platform&apos; that will combine powerful storytelling with advanced
            visualisation of market data. This will contribute to a deeper
            knowledge of what influences market adoption, which in turn will
            allow 4Growth to develop robust forecasts to guide policymaking and
            increase further uptake.
          </p>
          <Button asChild variant="outline">
            <a
              href="https://4growth-project.eu/"
              className="space-x-2"
              title="4Growth site"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Learn more</span>
              <ExternalLinkIcon className="h-5 w-5" />
            </a>
          </Button>
        </Card>
        <Card className="order-6 space-y-4 bg-white md:order-5">
          <Title as="h2" size="xl" className="text-navy-950">
            Consortium
          </Title>
          <p className="text-slate-500">
            The 4Growth consortium consists of a team committed to understand
            and contribute to the uptake of digital agriculture and forestry
            through a multi-actor approach. Wageningen University & Research are
            the coordinators of 4Growth, with Evenflow acting as Technical
            Managers of the project.
          </p>
          <div className="grid grid-cols-2 gap-5 self-center md:gap-x-10">
            <Image
              src="/images/about/logos/agricultural-university-athens.avif"
              alt="Agricultural Univerity of Athens"
              width={212}
              height={80}
            />
            <Image
              src="/images/about/logos/evenflow.avif"
              alt="Evenflow"
              width={212}
              height={80}
            />
            <Image
              src="/images/about/logos/agrifood-lithuania.avif"
              alt="Agrifood Lithuania"
              width={212}
              height={80}
            />
            <Image
              src="/images/about/logos/foodscale-hub.avif"
              alt="FoodScale Hub"
              width={212}
              height={80}
            />
            <Image
              src="/images/about/logos/aristotle-university-thessaloniki.avif"
              alt="Aristotle University of Thessaloniki"
              width={212}
              height={80}
            />
            <Image
              src="/images/about/logos/future-impacts.avif"
              alt="Future Impacts"
              width={212}
              height={80}
            />
            <Image
              src="/images/about/logos/ctifl.avif"
              alt="CTIFL"
              width={212}
              height={80}
            />
            <Image
              src="/images/about/logos/ilvo.avif"
              alt="ILVO"
              width={212}
              height={80}
            />
            <Image
              src="/images/about/logos/intia.avif"
              alt="INTIA"
              width={212}
              height={80}
            />
            <Image
              src="/images/about/logos/le-europe.avif"
              alt="LE - Europe"
              width={212}
              height={80}
            />
            <Image
              src="/images/about/logos/vizzuality.avif"
              alt="Vizzuality"
              width={212}
              height={80}
            />
            <Image
              src="/images/about/logos/vtt.avif"
              alt="VTT"
              width={212}
              height={80}
            />
            <Image
              src="/images/about/logos/wageningen.avif"
              alt="Wageningen University & Research"
              width={212}
              height={80}
            />
          </div>
        </Card>
        <Card className="relative order-5 min-h-[275px] bg-[url('/images/about/hands.avif')] bg-cover bg-center bg-no-repeat p-0 md:order-6 md:min-h-fit" />
      </div>
    </div>
  );
};

export default About;
