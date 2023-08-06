// const axios = require('axios');
// const fs = require("fs");
// const apiEndpoint = 'https://api.openai.com/v1/chat/completions';
// const apiKey = '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';
// let text = "";
//   readInputFile('employee_attendance.csv').then(res => {
//     text = res;
//   });

// const prompts = [
//     {
//       prompt: 'generate an array of users with fake data in json format, consisting Employee ID, Employee Name, Date, Time In, Time Out, Hours Worked, and Designation, Billable / Non-Billable. Just give me the data in csv format',
//       filename:'employee_attendance.csv'
//     },
//     {
//       prompt: "Using the csv content I am giving you and on the base of the data, calculate the payroll for the following employees. Salary of the employees as following. Manager Salary: 1,00,000, Employee: 50,000, Supervisor: 25,000. Give 10% bonus to the top 2 employees. Calculate the payroll for the employees with csv file containing Employee ID,Employee Name,Total Hours Worked,Gross Pay,Tax,Net Pay with tax calculations in india. Here's the csv content: ```" + text + "```. Only give the csv content, not anything else.",
//       filename:'employee_payroll.csv',
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

const fs = require("fs");
const { Configuration, OpenAIApi } = require("openai");
const puppeteer = require('puppeteer');

/**
 * Configuration of OpenAI
 */
const configuration = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

/**
 * Function to call API
 */
const generateAttendance = async () => {
  const chatCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "generate an array of users with fake data in json format, consisting Employee ID, Employee Name, Date, Time In, Time Out, Hours Worked, and Designation, Billable / Non-Billable. Just give me the data in csv format",
      },
      {
        role: "assistant",
        content:
        "Sure! I'll generate the csv content for you. Only CSV file content nothing else.",
      },
    ],
  });
  const data = (chatCompletion.data.choices[0].message.content);
  console.log(data);
  writeFile('employee_attendance.csv', data);
};

const generatePayroll = async () => {
  let text = "";
  readInputFile('employee_attendance.csv').then(res => {
    text = res;
  });
  const chatCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "Using the csv content I am giving you and on the base of the data, calculate the payroll for the following employees. Salary of the employees as following. Manager Salary: 1,00,000, Employee: 50,000, Supervisor: 25,000. Give 10% bonus to the top 2 employees. Calculate the payroll for the employees with csv file containing Employee ID,Employee Name,Total Hours Worked,Gross Pay,Tax,Net Pay with tax calculations in india. Here's the csv content: ```" + text + "```. Only give the csv content, not anything else.",
      },
      {
        role: "assistant",
        content:
          "Sure, by reading this csv. I will give you the payroll csv file content.",
      },
    ],
  });
  const data = (chatCompletion.data.choices[0].message.content);
  console.log(data);
  writeFile('employee_payroll.csv', data);
  createPdfFromText(data, 'output.pdf');
};

/**
 * Calling the API
 */

async function main() {
  await generateAttendance();
  await generatePayroll();
}

function readInputFile(fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function writeFile(fileName, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, data, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

main();


async function createPdfFromText(text, pdfFilePath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const htmlContent = `<html><body><p>${text}</p></body></html>`;

  await page.setContent(htmlContent);
  await page.pdf({ path: pdfFilePath, format: 'A4' });

  await browser.close();
  console.log('PDF created successfully!');
}