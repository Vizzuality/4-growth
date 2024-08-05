import Image from "next/image";

import { BarChartHorizontal, Filter } from "lucide-react";

import Wrapper from "@/containers/wrapper";

export default function ComingSoon() {
  return (
    <Wrapper className="px-2 pt-0.5 md:pt-6 lg:px-24 lg:pt-20">
      <section className="flex animate-hero flex-col items-center space-y-4 rounded-2xl bg-blue-800 bg-cover bg-center pb-28 pt-[90px] md:col-span-4 md:mb-[2px] md:px-44">
        <Image
          src={"/images/4Growth_logo.png"}
          alt="4Growth"
          width={300}
          height={300}
          className="h-12 w-auto md:h-14"
        />
        <h1 className="whitespace-nowrap text-3xl font-bold text-white md:text-6xl">
          Visualisation Platform
        </h1>
        <a
          href="https://4growth-project.eu/"
          target="_blank"
          rel="noopener noreferrer"
          title="4Growth project site"
          className="rounded-2xl bg-white px-4 py-3 font-semibold text-blue-900 transition-colors hover:bg-white/80"
        >
          4Growth project site
        </a>
      </section>

      <section className="mb-0.5 grid gap-0.5 md:grid-cols-4">
        <div className="col-span-2 rounded-2xl bg-[url('/images/coming-soon/dron.jpg')] bg-cover bg-center" />

        <div className="col-span-2 space-y-4 rounded-2xl bg-blue-800 px-8 py-16">
          <h3 className="text-2xl font-bold leading-9 text-white md:text-[32px]">
            Analyse, understand <br /> and visualise
          </h3>
          <p className="text-base text-foreground">
            Dig into a visual and interactive data service to explore where and
            how digital agriculture and forestry technologies are being adopted
            and the impact of their use. Make any answer serve as a filter for
            the others and break down the data by the criteria of your choice.
          </p>
        </div>

        <div className="col-span-2 gap-0.5 space-y-0.5">
          <div className="w-full rounded-2xl bg-blue-800 bg-[url('/images/coming-soon/rect-bg.png')] bg-cover bg-center bg-no-repeat px-8 py-16">
            <h3 className="text-2xl font-bold leading-9 text-white md:text-[32px]">
              Explore the data <br />
              from different angles
            </h3>
          </div>
          <div className="flex space-x-0.5">
            <div className="w-1/2 space-y-4 rounded-2xl bg-blue-800 px-8 py-8 xl:py-14">
              <Filter size={24} stroke="white" className="stroke-green-600" />
              <h4 className="text-base font-bold text-white">
                Data Filtering and Segmentation
              </h4>
              <p className="text-xs text-foreground">
                Filter data based on different criteria, such as geographic
                location, age, sector, organisation, etc.
              </p>
            </div>
            <div className="w-1/2 space-y-4 rounded-2xl bg-blue-800 px-8 py-8 xl:py-14">
              <BarChartHorizontal size={24} className="stroke-green-600" />
              <h4 className="text-base font-bold text-white">
                Comparative Data Analysis
              </h4>
              <p className="text-xs text-foreground">
                Integrated features to perform descriptive and comparative
                analysis of demographic data.
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-2 rounded-2xl bg-[url('/images/coming-soon/work.jpg')] bg-cover bg-center" />
      </section>

      <section className="flex flex-col items-center space-y-8 rounded-2xl bg-[url('/images/coming-soon/gradient.jpg')] bg-cover bg-no-repeat py-16">
        <div className="text-center">
          <h2 className="text-xl font-bold uppercase">Coming soon</h2>
          <h3 className="text-4xl font-bold md:text-[56px]">Stay tunned!</h3>
        </div>
        <div className="h-44 w-80 rounded-3xl bg-[url('/images/coming-soon/mockup.png')] bg-cover bg-center px-2 md:h-[330px] md:w-[580px] md:px-0" />
      </section>

      <section className="col-span-4 flex w-full flex-col items-center space-y-4 py-20">
        <div className="flex items-center space-x-10">
          <Image
            src={"/images/4Growth_logo.png"}
            alt="4Growth"
            width={200}
            height={200}
            className="h-auto w-32"
          />
          <Image
            src={"/images/eu_logo.png"}
            alt="4Growth"
            width={200}
            height={200}
            className="h-auto w-52"
          />
        </div>
        <p className="max-w-sm text-center text-xs text-foreground md:max-w-md md:text-left">
          This project has received funding from the European Union&apos;s
          Horizon Europe research and innovation programme under grant agreement
          No. 101134855.
        </p>
      </section>
    </Wrapper>
  );
}
