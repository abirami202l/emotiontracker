import { useEffect, useState } from "react";
import * as faceapi from "face-api.js";

export function useFaceEmotion(video) {
  const [emotion, setEmotion] = useState(null);

  // Load models once
  useEffect(() => {
    async function loadModels() {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");
    }

    loadModels();
  }, []);

  // Run detection whenever video is available
  useEffect(() => {
    if (!video) return;

    const detect = async () => {
      // Ensure models are loaded
      if (
        !faceapi.nets.tinyFaceDetector.params ||
        !faceapi.nets.faceExpressionNet.params
      ) {
        return;
      }

      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (!detections.length) {
        setEmotion(null);
        return;
      }

      const expressions = detections[0].expressions;
      const best = Object.keys(expressions).reduce((a, b) =>
        expressions[a] > expressions[b] ? a : b
      );

      setEmotion(best);
    };

    const interval = setInterval(detect, 250);
    return () => clearInterval(interval);
  }, [video]);

  return emotion;
}
