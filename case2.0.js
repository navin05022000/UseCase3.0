// const axios = require('axios');
// const fs = require("fs");
// const apiEndpoint = 'https://api.openai.com/v1/chat/completions';
// const apiKey = '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';

// const prompts = [
//     {
//       prompt: 'Generate the csv file for 3  employees for june month (30 days) and Marked the Weekend (Saturday and Sunday as 0) having Employee ID as (EMP001,...),Date (DD-MM-YYYY),Day,Time-in (8AM - 10AM),Time-out (5PM-8PM),Total Hours Worked(Hrs)',
//       filename:'emp_att_june.csv'
//     },
//     {
//       prompt: 'Generate the csv for employee leave having Employee ID as (EMP001,...),Employee Name,Leave Type(half day,full day),Start Date,End Date,Leave Duration,Leave Status (Approval Status like Approved or Rejected) for June month',
//       filename:'emp_leave.csv',
//     },
//     {
//       prompt: 'Generate the csv file for National holidays(as per India calendar)having Date as (DD-MM-YYYY),Day,Holiday Name,Type(Public)',
//       filename:'emp_holiday.csv',
//     },
//     {
//       prompt: "Generate the Attendance sheet for 3 employees for june month  in to csv format which contain  headers, Employee Name,Employee Id(EMP...),Total Working Day(Calculated),Total Working Hours(Calculated).excluding weekends, holidays, leaves and based on number of working days, each day 8 hours being working hours.",
//       filename:"emp_result_june.csv"
//     },
//   ];
  

// async function generateChatGPTResponses(prompts) {
//   try {
//     const headers = {
//         Authorization: `Bearer ${apiKey}`,
//       'Content-Type': 'application/json',
      
//     };

//     let cumulativeResponses = '';

//     for (const prompt of prompts) {
//         console.log(prompt);
//       const body = {
//         model: "gpt-3.5-turbo",
//         messages: [
//             {
//               role: "user",
//               content: prompt.prompt,
//             },
//           ],
//         max_tokens: 3000,
//         temperature: 0.2
//       };

//       const response = await axios.post(apiEndpoint, body, { headers });
//       const generatedText = response.data.choices[0].message.content;

//       fs.writeFileSync(prompt.filename, generatedText, 'utf8');

//         console.log(`CSV file "${prompt.filename}" generated successfully.`);
//     }

//     return cumulativeResponses;
//   } catch (error) {
//     console.error('Error generating ChatGPT responses:', error.message);
//     throw error;
//   }
// }


// generateChatGPTResponses(prompts);

const axios = require('axios');
const fs = require("fs");
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const apiEndpoint = 'https://api.openai.com/v1/chat/completions';
const apiKey = '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';

const prompts = [
  {
    prompt: '',
    filename: 'emp_att_june.csv'
  },
  {
    prompt: '',
    filename: 'emp_leave.csv',
  },
  {
    prompt: '',
    filename: 'emp_holiday.csv',
  },
  {
    prompt: "",
    filename: "emp_result_june.csv"
  },
];

async function generateChatGPTResponses(prompts) {
  try {
    const headers = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };

    let cumulativeResponses = '';

    for (let i = 0; i < prompts.length; i++) {
      const prompt = prompts[i];
      const userResponse = await getUserInput(`Enter the prompt for ${prompt.filename}: `);
      prompts[i].prompt = userResponse;
      const body = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: userResponse,
          },
        ],
        max_tokens: 3000,
        temperature: 0.2
      };

      const response = await axios.post(apiEndpoint, body, { headers });
      const generatedText = response.data.choices[0].message.content;

      fs.writeFileSync(prompt.filename, generatedText, 'utf8');
      console.log(`CSV file "${prompt.filename}" generated successfully.`);
    }

    return cumulativeResponses;
  } catch (error) {
    console.error('Error generating ChatGPT responses:', error.message);
    throw error;
  }
}

function getUserInput(prompt) {
  return new Promise((resolve) => {
    readline.question(prompt, (input) => {
      resolve(input);
    });
  });
}

async function run() {
  await generateChatGPTResponses(prompts);
  readline.close();
}

run();
