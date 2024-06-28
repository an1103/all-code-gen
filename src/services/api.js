const API_BASE_URL = 'https://www.learnerai-dev.theall.ai/all-orchestration-services/api';
const LAIS_BASE_URL = 'https://www.learnerai-dev.theall.ai/lais/scores';

const api = {
    login: async (username, password) => {
        // Simulating an API call for login
        return new Promise((resolve) => {
            setTimeout(() => {
                if (username === 'ans1' && password === '123') {
                    resolve({ success: true });
                } else {
                    resolve({ success: false });
                }
            }, 1000);
        });
    },

    trackSession: () => {
        // Simulating tracking session
        console.log('Session tracking started');
    },

    generateVirtualID: async (username) => {
        try {
            const response = await fetch('https://www.learnerai-dev.theall.ai/all-orchestration-services/api/virtualId/generateVirtualID?username=ans1');
            // const response = await fetch(`${API_BASE_URL}/virtualId/generateVirtualID?username=${username}`);
            const data = await response.json();
            return data.result.virtualID;
        } catch (error) {
            throw new Error('Failed to generate virtual ID');
        }
    },

    getMilestone: async (virtualId, language) => {
        try {
            const response = await fetch(`${LAIS_BASE_URL}/getMilestone/user/${virtualId}?language=${language}`);
            const data = await response.json();
            return data.data.milestone_level;
        } catch (error) {
            throw new Error('Failed to get user milestone');
        }
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

    fetchLearnerContent: async (userId, language) => {
        try {
            const response = await fetch(`https://www.learnerai-dev.theall.ai/lais/scores/GetContent/char/${userId}?language=${language}`, {
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
            const response = await fetch('https://www.learnerai-dev.theall.ai/lais/scores/updateLearnerProfile/en', {
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
};

export default api;

