// Discovery.js

import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Navbar from '../Navbar/Navbar';
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

  const username = localStorage.getItem('username');
  const userId = '8635444062'; // replace with actual user ID
  const sessionId = '86354440621701972584385'; // replace with actual session ID
  const subSessionId = '86354440621701972584385'; // replace with actual sub-session ID
  const language = 'en';

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
      const originalText = storyDetails[currentLineIndex].contentSourceData[0].text;
      const contentId = storyDetails[currentLineIndex].contentId;

      const profileData = {
        original_text: originalText,
        audio: audioContent,
        user_id: userId,
        session_id: sessionId,
        sub_session_id: subSessionId,
        language: language,
        date: new Date().toISOString(),
        contentId: contentId,
        contentType: 'Char',
      };

      try {
        const response = await api.updateLearnerProfile(profileData);
        setApiResponse(response.msg);
        setFeedback('Profile updated successfully.');
        setSessionResult('pass');
        handleNextLine();
      } catch (error) {
        console.error('Error updating learner profile:', error);
        setFeedback('Error updating learner profile.');
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
      <Navbar username={username} />
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
