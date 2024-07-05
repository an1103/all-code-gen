// api.js
let selectedLanguage = 'en'; // default language

const api = {
    setLanguage: (language) => {
        selectedLanguage = language;
    },

    login: async (username, password) => {
        // Simulating an API call for login
        return new Promise((resolve) => {
            setTimeout(() => { 
                if (username === '' && password === '') {
                    resolve({ success: false });
                } else {
                    resolve({ success: true });
                }
            }, 1000);
        });
    },

    trackSession: () => {
        // Simulating tracking session
        console.log('Session tracking started');
    },

    getLessonProgress: async (username) => {
        // Simulating fetching lesson progress
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ username, progress: '75%' });
            }, 1000);
        });
    },

    fetchStoryDetails: async (storyCollectionId) => {
        // Simulating an API call to fetch story details
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    lines: [
                        { text: 'Once upon a time...', imageUrl: '', audioUrl: '' },
                        { text: 'There was a brave knight...', imageUrl: '', audioUrl: '' },
                        // Add more lines as needed
                    ],
                });
            }, 1000);
        });
    },

    getCoins: async (username) => {
        // Simulating an API call to get coins
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ coins: 24 }); // Manual Changes
          }, 1000);
        });
    },

    fetchLearnerContent: async (userId) => {
        try {
            const response = await fetch(`https://www.learnerai-dev.theall.ai/lais/scores/GetContent/sentence/${userId}?language=${selectedLanguage}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch content');
            }

            const data = await response.json();
            return data.content;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    updateLearnerProfile: async (profileData) => {
        try {
            const response = await fetch(`https://www.learnerai-dev.theall.ai/lais/scores/updateLearnerProfile/${selectedLanguage}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData),
            });

            if (!response.ok) {
                throw new Error('Failed to update learner profile');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    submitRecordedAudio: async (requestBody) => {
        try {
            const asrApiKey = process.env.ASR_API_KEY;
            const API_ENDPOINT = 'https://api.dhruva.ai4bharat.org/services/inference/asr?serviceId=ai4bharat/conformer-multilingual-dravidian-gpu--t4';
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': asrApiKey // Replace YOUR_API_KEY with your actual API key
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error('Failed to submit recorded audio');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    },
};

export default api;
