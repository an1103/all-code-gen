// Discovery.js

import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Navbar from '../Navbar/Navbar'; // Import the Navbar component
import './Discovery.css';

const Discovery = () => {
  const [storyDetails, setStoryDetails] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [sessionResult, setSessionResult] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [audioRecorder, setAudioRecorder] = useState(null);
  const [apiResponse, setApiResponse] = useState('');

  // Assume the username is retrieved from localStorage
  const username = localStorage.getItem('username');
  const userId = '2020076506'; // replace with actual user ID
  const language = 'en'; // replace with actual language

  useEffect(() => {
    const fetchStoryDetails = async () => {
      const data = await api.fetchLearnerContent(userId, language);
      setStoryDetails(data);
    };

    fetchStoryDetails();
  }, []);

  const handleNextLine = () => {
    if (currentLineIndex < storyDetails.length - 1) {
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
        handleNextLine(); // Move to the next line after successful submission
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

  if (!storyDetails.length) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar username={username} /> {/* Display Navbar with username */}
      <div className="discovery-container">
        <div className="story-content">
          <p>{storyDetails[currentLineIndex].contentSourceData[0].text}</p>
        </div>
        <div className="controls">
          {isRecording ? (
            <button onClick={handleStopRecording}>Stop Recording</button>
          ) : (
            <button onClick={handleStartRecording}>Start Recording</button>
          )}
          <button onClick={handleSubmitRecording} disabled={!recordedAudio || isRecording}>Submit Recording</button>
        </div>
        {feedback && <div className="feedback">{feedback}</div>}
        {sessionResult && <div className={`result ${sessionResult}`}>{sessionResult === 'pass' ? 'Pass' : 'Fail'}</div>}
        {apiResponse && <div className="api-response">{apiResponse}</div>}
      </div>
    </div>
  );
};

export default Discovery;
