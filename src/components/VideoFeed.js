// VideoFeed.js
import React, { useRef, useEffect, useState } from 'react';
import MoodChart from './MoodChart';

export default function VideoFeed({ onFrame, emotion }) {
  const videoRef = useRef(null);
  const [moodLevel, setMoodLevel] = useState(0);

  useEffect(() => {
    let intervalId;
    async function startVideo() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (!videoRef.current) return;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        // Send video element up every 200ms
        intervalId = setInterval(() => {
          if (videoRef.current) {
            onFrame(videoRef.current);
          }
        }, 200);
      } catch (err) {
        console.error('Camera error', err);
      }
    }
    startVideo();
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [onFrame]);

  useEffect(() => {
    if (!emotion) return;
    const moodScoreMap = {
      happy: 1,
      neutral: 0,
      sad: -1,
      angry: -2,
      surprised: 0.5,
      fearful: -0.5,
      disgusted: -1,
    };
    setMoodLevel(moodScoreMap[emotion] ?? 0);
  }, [emotion]);

  return (
    <div>
      <video
        ref={videoRef}
        width={640}
        height={480}
        autoPlay
        muted
        style={{ borderRadius: '8px' }}
      />
      <MoodChart moodStream={moodLevel} />
    </div>
  );
}
