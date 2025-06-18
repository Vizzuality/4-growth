import DiamondLine from "@/components/icons/diamond-line";
import Rocket from "@/components/icons/rocket";
import Rows2 from "@/components/icons/rows-2";
import Sun from "@/components/icons/sun";
import { List } from "@/components/ui/list";

export const SCENARIOS = [
  {
    label: "Baseline",
    value: "baseline",
    icon: <Rows2 className="fill-current" />,
    shortDescription: (
      <p>
        By 2040, the European agriculture and forestry are under pressure to
        increase productivity; digital solutions are a key lever to achieve
        this. The baseline assumes the continuation of current trends with
        moderate technological advancements, regulatory developments, and
        evolving market dynamics.
      </p>
    ),
    longDescription: (
      <List>
        <li>
          The global economy follows a moderate growth trajectory, with Europe
          experiencing a steady but uneven economic development. International
          trade is key, and global supply chains are highly interconnected.
        </li>
        <li>
          Europe’s agriculture and forestry sectors remain interconnected with
          international markets, relying on essential inputs while exporting
          high-value agricultural and wood-based products.
        </li>
        <li>
          Agriculture and forestry face growing pressure to increase
          productivity with limited land resources to serve the demand from a
          growing global population. The rise of wood-based construction methods
          drives the demand for forest resources. At the same time, biodiversity
          initiatives require more forest areas to be set aside for
          conservation.
        </li>
        <li>
          Shifting consumer preferences for sustainably sourced products drive
          further investment in green and digital innovations.
        </li>
        <li>
          Climate change impacts worsen. Governments and industries increase
          their commitments to climate targets, pushing for sustainable and
          digitalised farming and forestry practices.
        </li>
        <li>
          Digitalisation in agriculture and forestry continues to accelerate,
          with precision farming technologies, AI-driven analytics, remote
          sensing and satellite navigation systems allowing farmers and
          foresters to maximise yields while adapting to economic pressures.
        </li>
      </List>
    ),
  },
  {
    label: "Reimagining Progress",
    value: "reimagining-progress",
    icon: <Sun className="fill-current" />,
    shortDescription: (
      <p>
        By 2040, Europe leads in sustainability, overcoming challenges through
        technology, cooperation, and transformed consumption. The EU drives
        sustainable agri-food, forestry, biodiversity, and plant-based diets
        with digital innovation, mission-driven science, and open knowledge
        sharing.
      </p>
    ),
    longDescription: (
      <List>
        <li>
          Policymakers, industries, and society unite to prioritise
          sustainability in response to environmental crises. Stricter policies
          drive Europe toward net-zero carbon, biodiversity restoration, and
          reduced degradation.
        </li>
        <li>
          Europe, followed by other regions, adopts a sustainable economy
          focused on resource efficiency, circular models, and conscious
          consumption, like low-meat diets, balancing local production with
          global trade.
        </li>
        <li>
          A stronger multilateral framework emerges, led by the EU in diplomacy,
          green tech, and sustainable value chains. The world commits to a
          Global Green Deal with adaptable goals.
        </li>
        <li>
          Rising resource scarcity drives higher prices and sustainable
          extraction, while energy transitions and carbon sinks become key.
          Upskilling supports workers in shrinking sectors.
        </li>
        <li>
          Despite past emissions, mitigation keeps warming near 2°C, setting a
          sustainable global course.
        </li>
        <li>
          The EU is world-leading in sustainable agriculture and forestry,
          enabled by digital innovation, open knowledge sharing and equitable
          access to high-tech solutions.
        </li>
      </List>
    ),
  },
  {
    label: "The Fractured Continent",
    value: "fractured-continent",
    icon: <DiamondLine className="fill-current" />,
    shortDescription: (
      <p>
        By 2040, innovation continues to advance, but undercurrents of
        fragmentation and socio- political polarisation limit its reach and
        resilience. Agri-forestry favours short-term gains over sustainability,
        while disjointed digital policies deepen inequalities.
      </p>
    ),
    longDescription: (
      <List>
        <li>
          Nationalist policies and global competition for critical resources
          have weakened multilateral cooperation, leading to trade tensions and
          reduced data and resource flows.
        </li>
        <li>
          Within Europe, diverging national agendas have stalled progress on
          climate action, economic inclusion, and digital governance.
        </li>
        <li>
          Some regions successfully transition towards a circular economy and
          adopt precision technologies. In contrast, others fall behind due to
          limited access to funding, infrastructure, and education.
        </li>
        <li>
          Inequality increases sharply between and within countries, resulting
          in uneven technological uptake and restricted access to digital
          agriculture and forestry tools.
        </li>
        <li>
          Global warming has surpassed the +2°C emission pathway, and
          intensifying environmental stress exacerbates vulnerabilities across
          the food and forestry systems.
        </li>
        <li>
          Fragmentation of digital policies and infrastructures creates
          interoperability challenges and hinders the broad rollout of digital
          solutions for agriculture and forestry.
        </li>
      </List>
    ),
  },
  {
    label: "The Corporate Epoch",
    value: "corporate-epoch",
    icon: <Rocket className="fill-current" />,
    shortDescription: (
      <p>
        By 2040, multinational corporations dominate Europe’s governance,
        economy, and society. Economic growth and innovation thrive, but rising
        inequalities and environmental degradation persist. A few agribusinesses
        control agriculture and forestry, while monopolised technology deepens
        digital divides and limits access.
      </p>
    ),
    longDescription: (
      <List>
        <li>
          Monoculture and climate impacts worsen resource scarcities, raising
          prices and volatility, while gatekeeping by resource-rich entities
          deepens inequalities.
        </li>
        <li>
          Major multinational technologies and commodity corporations shape
          political agendas, drive innovation, and control value chains,
          sidelining smaller actors.
        </li>
        <li>
          Europe’s economy thrives on competition, driven by
          fossil-fuel-intensive multinational corporations.
        </li>
        <li>
          Rising inequalities and a shrinking middle class fuel societal
          divides, limiting high-tech access to elites and leaving many in
          precarious jobs.
        </li>
        <li>
          Global warming exceeds +3°C by 2100, triggering tipping points that
          devastate coastal and inland areas, causing severe resource and
          climate challenges.
        </li>
        <li>
          Heavily industrialised agriculture and forestry are in the hands of
          some corporate giants, using monopolised digital technologies.
        </li>
      </List>
    ),
  },
];
