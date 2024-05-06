import Image from "next/image";

import { BarChartHorizontal, Filter } from "lucide-react";

import Wrapper from "@/containers/wrapper";

export default function ComingSoon() {
  return (
    <Wrapper className="lg:px-24 pt-0.5 lg:pt-20">
      <section className="animate-hero bg-cover bg-center mb-0.5 flex flex-col items-center lg:col-span-4 rounded-2xl lg:px-44 py-20 space-y-4">
        <Image
          src={"/images/4Growth_logo.png"}
          alt="4Growth"
          width={300}
          height={300}
          className="h-12 lg:h-14 w-auto"
        />
        <h1 className="text-white text-3xl lg:text-6xl font-bold whitespace-nowrap">
          Visualisation Platform
        </h1>
      </section>

      <section className="grid lg:grid-cols-4 gap-0.5 mb-0.5">
        <div className="col-span-2 rounded-2xl">
          <Image
            src={"/images/coming-soon/dron.jpg"}
            alt="Drone"
            width={200}
            height={200}
            className="rounded-2xl w-full h-full object-cover"
          />
        </div>
        <div className="col-span-2 bg-blue-800 rounded-2xl py-16 px-8 space-y-4">
          <h3 className="text-white leading-9 text-2xl lg:text-[32px] font-bold">
            Analyse, understand <br /> and visualise
          </h3>
          <p className="text-foreground text-base">
            Dig into a visual and interactive data service to explore where and
            how digital agriculture and forestry technologies are being adopted
            and the impact of their use. Make any answer serve as a filter for
            the others and break down the data by the criteria of your choice.
          </p>
        </div>

        <div className="col-span-2 gap-0.5 space-y-0.5">
          <div className="w-full bg-blue-800 rounded-2xl py-16 px-8 bg-[url('/images/coming-soon/rect-bg.png')] bg-cover bg-center bg-no-repeat">
            <h3 className="leading-9 text-white text-2xl lg:text-[32px] font-bold">
              Explore the data <br />
              from different angles
            </h3>
          </div>
          <div className="flex space-x-0.5">
            <div className="bg-blue-800 rounded-2xl px-8 py-8 xl:py-14 space-y-4 w-1/2">
              <Filter size={24} stroke="white" className="stroke-green-600" />
              <h4 className="text-white font-bold text-base">
                Data Filtering and Segmentation
              </h4>
              <p className="text-foreground text-xs">
                Filter data based on different criteria, such as geographic
                location, age, sector, organisation, etc.
              </p>
            </div>
            <div className="w-1/2 bg-blue-800 rounded-2xl px-8 py-8 xl:py-14 space-y-4">
              <BarChartHorizontal size={24} className="stroke-green-600" />
              <h4 className="text-white font-bold text-base">
                Comparative Data Analysis
              </h4>
              <p className="text-foreground text-xs">
                Integrated features to perform descriptive and comparative
                analysis of demographic data.
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-2 rounded-2xl">
          <Image
            src={"/images/coming-soon/work.jpg"}
            alt="Work"
            width={200}
            height={200}
            className="rounded-2xl w-full h-full object-cover"
          />
        </div>
      </section>

      <section className="bg-[url('/images/coming-soon/gradient.jpg')] bg-cover bg-no-repeat rounded-2xl flex flex-col space-y-8 items-center py-16">
        <div className="text-center">
          <h2 className="font-bold uppercase text-xl">Coming soon</h2>
          <h3 className="font-bold text-4xl lg:text-[56px]">Stay tunned!</h3>
        </div>
        <Image
          src={"/images/coming-soon/mockup.png"}
          alt="4Growth"
          width={200}
          height={200}
          className="h-64 lg:h-72 w-auto rounded-3xl px-2 lg:px-0"
        />
      </section>

      <section className="col-span-4 flex flex-col items-center w-full py-20 space-y-4">
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
        <p className="text-foreground text-xs max-w-sm text-center lg:text-left lg:max-w-md">
          This project has received funding from the European Union&apos;s
          Horizon Europe research and innovation programme under grant agreement
          No. 101134855.
        </p>
      </section>
    </Wrapper>
  );
}
