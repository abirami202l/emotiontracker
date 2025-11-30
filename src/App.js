import React, { useState, useCallback } from "react";
import VideoFeed from "./components/VideoFeed";
import EmotionOverlay from "./components/EmotionOverlay";
import { useFaceEmotion } from "./useFaceEmotion";

export default function App() {
  const [videoEl, setVideoEl] = useState(null);

  const handleFrame = useCallback((video) => {
    setVideoEl(video);
  }, []);

  const emotion = useFaceEmotion(videoEl);

  return (
    <div style={{ position: "relative", width: 640, height: 480 }}>
      <VideoFeed onFrame={handleFrame} emotion={emotion} />
      <EmotionOverlay video={videoEl} />
      <p>Current emotion: {emotion || "Detecting..."}</p>
    </div>
  );
}

