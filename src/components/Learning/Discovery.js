import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './Discovery.css';
import { FaMicrophone, FaPlay, FaQuestion, FaStop, FaArrowLeft } from 'react-icons/fa';

const Discovery = () => {
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

  useEffect(() => {
    if (timer === 0) {
      handleNextLine();
    }
  }, [timer]);

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

  const handleNextLine = () => {
    if (currentLineIndex < storyDetails.length - 1) {
      setCurrentLineIndex(currentLineIndex + 1);
      setTimer(30);
    }
  };

  const handleRetryLine = () => {
    setTimer(30);
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

  const handleHelpClick = () => {
    alert('Instructions: Please read the sentence aloud and record your voice. Click "Next" to proceed.');
  };

  const handlePlayRecording = () => {
    if (recordedAudio) {
      const audioURL = URL.createObjectURL(recordedAudio);
      const audio = new Audio(audioURL);
      audio.play();
    }
  };

  const handleBackClick = () => {
    // Logic to go back to the login page
    window.location.href = '/';
  };

  if (!storyDetails.length) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="back-button" onClick={handleBackClick}>
        <FaArrowLeft />
      </div>
      <div className="discovery-container">
        <div className="timer">{timer}</div>
        <div className="help-button" onClick={handleHelpClick}>
          <FaQuestion />
        </div>
        <div className="story-content">
          <p>{storyDetails[currentLineIndex].contentSourceData[0].text}</p>
        </div>
        <div className="controls">
          {recordedAudio && !isRecording && (
            <button className="play-button" onClick={handlePlayRecording}>
              <FaPlay />
            </button>
          )}
          {isRecording ? (
            <button className="record-button" onClick={handleStopRecording}>
              <FaStop />
            </button>
          ) : (
            <button className="record-button" onClick={handleStartRecording}>
              <FaMicrophone />
            </button>
          )}
        </div>
        <button className="next-button" onClick={handleSubmitRecording} disabled={!recordedAudio || isRecording}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Discovery;
