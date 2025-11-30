import React, { useRef, useEffect } from "react";
import * as faceapi from "face-api.js";

export default function EmotionOverlay({ video }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    async function loadModels() {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");
    }

    loadModels();
  }, []);

  useEffect(() => {
    if (!video) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    const detect = async () => {
      // Stop if models aren't loaded
      if (
        !faceapi.nets.tinyFaceDetector.params ||
        !faceapi.nets.faceExpressionNet.params
      ) {
        return;
      }

      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      const resized = faceapi.resizeResults(detections, displaySize);
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      resized.forEach((d) => {
        const mood = Object.keys(d.expressions).reduce((a, b) =>
          d.expressions[a] > d.expressions[b] ? a : b
        );

        new faceapi.draw.DrawTextField(
          [`Mood: ${mood}`],
          d.detection.box.bottomRight
        ).draw(canvas);
      });
    };

    const interval = setInterval(detect, 250);
    return () => clearInterval(interval);
  }, [video]);

  return (
    <canvas
      ref={canvasRef}
      width={640}
      height={480}
      style={{ position: "absolute", top: 0, left: 0 }}
    />
  );
}
