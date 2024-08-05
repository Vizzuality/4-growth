import { FC, VideoHTMLAttributes } from "react";

const Video: FC<VideoHTMLAttributes<HTMLVideoElement>> = (props) => {
  return <video {...props} />;
};

export default Video;
