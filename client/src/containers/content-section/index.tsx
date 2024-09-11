import { FC, PropsWithChildren } from "react";

type ContentSectionProps = {
  title: string;
  description: string;
  headerImg?: string;
};

const ContentSection: FC<PropsWithChildren<ContentSectionProps>> = ({
  title,
  description,
  children,
}) => {
  return (
    <div>
      <div className="rounded-2xl bg-secondary p-6">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div>{description}</div>
      </div>
      {children}
    </div>
  );
};

export default ContentSection;
