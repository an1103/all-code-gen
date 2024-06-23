import React, { useState, useEffect } from 'react';
import api from '../../services/api'; // Importing API service
import Navbar from '../Navbar/Navbar.js'; // Importing Navbar component
import './Discovery.css'; // Importing styles

const Discovery = () => {
  // Defining state variables
  const [storyDetails, setStoryDetails] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [sessionResult, setSessionResult] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [audioRecorder, setAudioRecorder] = useState(null);
  const [apiResponse, setApiResponse] = useState('');
  const [timer, setTimer] = useState(30);
  const [timerId, setTimerId] = useState(null);

  // Hardcoded user information (should be replaced with actual values)
  const username = localStorage.getItem('username');
  const userId = '8635444062';
  const sessionId = '86354440621701972584385';
  const subSessionId = '86354440621701972584385';
  const language = 'en';

  // Fetch story details on component mount
  useEffect(() => {
    const fetchStoryDetails = async () => {
      const data = await api.fetchLearnerContent(userId, language);
      setStoryDetails(data);
    };

    fetchStoryDetails();
  }, []);

  // Handle timer reaching zero
  useEffect(() => {
    if (timer === 0) {
      handleNextLine();
    }
  }, [timer]);

  // Set up timer when current line changes
  useEffect(() => {
    if (timerId) {
      clearInterval(timerId);
    }
    const id = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);
    setTimerId(id);

    return () => clearInterval(id);
  }, [currentLineIndex]);

  // Go to the next line in the story
  const handleNextLine = () => {
    if (currentLineIndex < storyDetails.length - 1) {
      setCurrentLineIndex(currentLineIndex + 1);
      setTimer(30);
      resetRecordingState();
    }
  };

  // Retry the current line
  const handleRetryLine = () => {
    setTimer(30);
    resetRecordingState();
  };

  // Reset recording state variables
  const resetRecordingState = () => {
    setRecordedAudio(null);
    setIsRecording(false);
  };

  // Start audio recording
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

  // Stop audio recording
  const handleStopRecording = () => {
    if (audioRecorder) {
      audioRecorder.stop();
    }
  };

  // Submit recorded audio
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

  // Convert audio blob to base64 string
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

  // Display help instructions
  const handleHelpClick = () => {
    alert('Instructions: Please read the sentence aloud and record your voice. Click "Next" to proceed.');
  };

  // Play recorded audio
  const handlePlayRecording = () => {
    if (recordedAudio) {
      const audioURL = URL.createObjectURL(recordedAudio);
      const audio = new Audio(audioURL);
      audio.play();
    }
  };

  // Render component
  return (
    <div className="discovery-container">
      <Navbar username={username} />
      <div className="content-card-discovery">
        <div className="timer-container">
          <div className="timer">{timer}</div>
          <div className="timer-label">Timer</div>
        </div>
        <div className="help-container">
          <img src="/images/help-icon.png" className="help-button" onClick={handleHelpClick} alt="Help" />
          <div className="help-label">Help</div>
        </div>

        <div className="story-content">
          {storyDetails.length > 0 && storyDetails[currentLineIndex].contentSourceData[0].text}

          <div className="controls">
            {recordedAudio && !isRecording && (
              <img src="/images/play-icon.png" className="icon-button" onClick={handlePlayRecording} alt="Play" />
            )}
            {isRecording ? ( /* Manual Changes */
              <img src="/images/stop-icon.png" className="icon-button" onClick={handleStopRecording} alt="Stop" />
            ) : ( /* Manual Changes */
              <img src="/images/mic-icon.png" className="icon-button" onClick={handleStartRecording} alt="Record" />
            )}
          </div>
        </div>
        <img src="/images/next-icon.png" className="next-button" onClick={handleSubmitRecording} alt="Next" disabled={!recordedAudio || isRecording} />
      </div>
    </div>
  );
};

export default Discovery;
