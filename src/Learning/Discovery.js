import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './Discovery.css';

const Discovery = () => {
  const [storyDetails, setStoryDetails] = useState(null);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [sessionResult, setSessionResult] = useState(null);
  const [contentType, setContentType] = useState('text');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [audioRecorder, setAudioRecorder] = useState(null);
  const [apiResponse, setApiResponse] = useState('');

  useEffect(() => {
    const fetchStoryDetails = async () => {
      const data = await api.fetchStoryDetails('story-collection-id');
      setStoryDetails(data);
    };

    fetchStoryDetails();
  }, []);

  const handleNextLine = () => {
    if (currentLineIndex < storyDetails.lines.length - 1) {
      setCurrentLineIndex(currentLineIndex + 1);
    }
  };

  const handleRetryLine = () => {
    // Reset the current line
    setCurrentLineIndex(currentLineIndex);
  };

  const handleStartRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        recorder.start();
        setAudioRecorder(recorder);
        setIsRecording(true);

        const chunks = [];
        recorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };

        recorder.onstop = () => {
          const recordedBlob = new Blob(chunks, { type: 'audio/wav' });
          setRecordedAudio(recordedBlob);
          setIsRecording(false);
        };
      })
      .catch((err) => {
        console.error('Error accessing microphone:', err);
      });
  };

  const handleStopRecording = () => {
    if (audioRecorder) {
      audioRecorder.stop();
    }
  };

  const handleSubmitRecording = async () => {
    if (recordedAudio) {
      const audioContent = await convertBlobToBase64(recordedAudio);
      const requestBody = {
        config: {
          language: {
            sourceLanguage: 'en-IN' // Adjust source language as needed
          },
          transcriptionFormat: {
            value: 'transcript'
          },
          audioFormat: 'wav',
          samplingRate: 16000 // Adjust sampling rate as needed
        },
        audio: [
          {
            audioContent: audioContent
          }
        ]
      };

      try {
        const response = await api.submitRecordedAudio(requestBody);
        setApiResponse(response.transcript);
        setFeedback('Transcription successful.');
        setSessionResult('pass');
      } catch (error) {
        console.error('Error submitting recorded audio:', error);
        setFeedback('Error submitting recorded audio.');
        setSessionResult('fail');
      }
    }
  };

  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data.split(',')[1]);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  if (!storyDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="discovery-container">
      <h2>Discovery</h2>
      <div className="story-content">
        {/* Render story content based on contentType */}
      </div>
      <div className="controls">
        <button onClick={handleNextLine} disabled={currentLineIndex >= storyDetails.lines.length - 1}>
          Next Line
        </button>
        <button onClick={handleRetryLine}>Retry</button>
        {isRecording ? (
          <button onClick={handleStopRecording}>Stop Recording</button>
        ) : (
          <button onClick={handleStartRecording}>Start Recording</button>
        )}
        <button onClick={handleSubmitRecording}>Submit Recording</button>
      </div>
      {feedback && <div className="feedback">{feedback}</div>}
      {sessionResult && <div className={`result ${sessionResult}`}>{sessionResult === 'pass' ? 'Pass' : 'Fail'}</div>}
      {apiResponse && <div className="api-response">{apiResponse}</div>}
    </div>
  );
};

export default Discovery;
