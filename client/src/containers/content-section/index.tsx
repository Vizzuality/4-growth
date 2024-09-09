import { FC, PropsWithChildren } from "react"

type ContentSectionProps  = {
  title: string
  description: string
  headerImg?: string
}

const ContentSection: FC<PropsWithChildren<ContentSectionProps>> = ({title, description, headerImg, children}) => {
  return <div><h2>{title}</h2><div>{description}</div></div>
}

export default ContentSection