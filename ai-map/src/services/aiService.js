// AI Service for OpenAI integration
import axios from 'axios';

// Default API key - this should be replaced with user's key
let OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY || '';

// Function to set the API key
export const setApiKey = (key) => {
  OPENAI_API_KEY = key;
  localStorage.setItem('openai_api_key', key);
  return true;
};

// Function to get the API key
export const getApiKey = () => {
  if (!OPENAI_API_KEY) {
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey) {
      OPENAI_API_KEY = storedKey;
    }
  }
  return OPENAI_API_KEY;
};

// Function to check if API key is set
export const hasApiKey = () => {
  return !!getApiKey();
};

// Function to break down a complex task into subtasks
export const breakdownTask = async (taskDescription) => {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error('OpenAI API key is not set');
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that breaks down complex tasks into smaller, manageable subtasks. For tasks that involve travel or visiting locations, include location information.'
          },
          {
            role: 'user',
            content: `Break down this task into smaller subtasks: "${taskDescription}". Respond with a JSON array where each item has:
            - "text": subtask description
            - "duration": estimated minutes to complete
            - "location": location name if the task involves a specific place (null if not location-based)
            - "requires_travel": boolean indicating if this subtask requires travel

            For location-based tasks, be specific about the place (e.g., "Kaufland supermarket", "Central Library", "Main Train Station").`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    // Extract and parse the JSON from the response
    const content = response.data.choices[0].message.content.trim();
    const jsonMatch = content.match(/\[\s*\{.*\}\s*\]/s);

    if (jsonMatch) {
      try {
        const subtasks = JSON.parse(jsonMatch[0]);
        // Ensure all subtasks have the required fields
        return subtasks.map(subtask => ({
          ...subtask,
          location: subtask.location || null,
          requires_travel: subtask.requires_travel || false
        }));
      } catch (parseError) {
        console.error('Error parsing subtasks JSON:', parseError);
        return [];
      }
    } else {
      console.error('No valid JSON found in response');
      return [];
    }
  } catch (error) {
    console.error('Error breaking down task:', error);
    return [];
  }
};

// Function to estimate task duration using OpenAI
export const estimateTaskDuration = async (taskDescription) => {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error('OpenAI API key is not set');
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that estimates how long tasks take. Respond with only a number representing minutes.'
          },
          {
            role: 'user',
            content: `How many minutes would it take to complete this task: "${taskDescription}"? Respond with just a number.`
          }
        ],
        temperature: 0.7,
        max_tokens: 10
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    // Extract the number from the response
    const content = response.data.choices[0].message.content.trim();
    const duration = parseInt(content.match(/\d+/)[0]);

    return isNaN(duration) ? 30 : duration; // Default to 30 minutes if parsing fails
  } catch (error) {
    console.error('Error estimating task duration:', error);
    return 30; // Default duration if API call fails
  }
};

// Function to generate a schedule using OpenAI
export const generateSchedule = async (tasks, freeTimeActivities) => {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error('OpenAI API key is not set');
  }

  // Prepare task data for the prompt
  const taskData = tasks.map(task => {
    return `- ${task.text} (${task.duration || 'unknown'} minutes)`;
  }).join('\n');

  // Prepare free time activities data
  const freeTimeData = freeTimeActivities.map(activity => {
    return `- ${activity.text}`;
  }).join('\n');

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that creates optimal daily schedules. Format your response as a JSON array of schedule blocks.'
          },
          {
            role: 'user',
            content: `Create an optimal daily schedule for these tasks and free time activities.

            Tasks:
            ${taskData || 'No tasks provided'}

            Free Time Activities:
            ${freeTimeData || 'No free time activities provided'}

            Respond with a JSON array of schedule blocks. Each block should have a start_time (HH:MM format), end_time, activity, and type (task or free_time). Distribute the activities throughout the day from 8:00 to 22:00.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    // Extract and parse the JSON from the response
    const content = response.data.choices[0].message.content.trim();
    const jsonMatch = content.match(/\[\s*\{.*\}\s*\]/s);

    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error('Error parsing schedule JSON:', parseError);
        return [];
      }
    } else {
      console.error('No valid JSON found in response');
      return [];
    }
  } catch (error) {
    console.error('Error generating schedule:', error);
    return [];
  }
};
