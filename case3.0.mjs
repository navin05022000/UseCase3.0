import readline from 'readline';
import fetch from 'node-fetch';
import nodemailer from 'nodemailer';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const API_KEY = "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"; //OpenAI API key

// Email configuration 
const emailConfig = {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
    user: '', // Enter the email address 
    pass: '' // Enter the generated App Password
  }
};

const transporter = nodemailer.createTransport(emailConfig);

const displayMenu = () => {
  console.log("Menu Options:");
  console.log("1. Need answer");
  console.log("2. Need code");
  console.log("3. Need suggestion");
};

const askForPrompt = async (option) => {
  const prompt = await new Promise((resolve) => {
    rl.question(`Enter your prompt for option ${option}: `, (answer) => {
      resolve(answer);
    });
  });

   const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 3000,
      temperature: 0.2,
      model: "gpt-3.5-turbo"
    })
  });

  const data = await response.json();
  console.log('Data',data)

  if (data.choices && data.choices.length > 0) {
    const result = data.choices[0].message;
    console.log("Result:");
    console.log(result);

     rl.question("you want to send the result via email? (Y/N): ", (answer) => {
      if (answer.toLowerCase() === 'y') {
        rl.question("Enter your email address: ", (email) => {
          sendEmail(result, email);
          
        });
      } else {
        chatbot()
      }
    });
  } else {
    console.log("No response received from the chatbot. Please try again.");
    chatbot()
  }
};

const sendEmail = (result, email) => {
  const mailOptions = {
    from: emailConfig.auth.user,
    to: email,
    subject: 'Chatbot Result',
    text: result
  };

 transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }

    chatbot()
  });
};

const chatbot = () => {
  displayMenu();

  rl.question("Enter your choice: ", (choice) => {
    switch (choice) {
      case '1':
        askForPrompt("1 (Need answer)");
        break;
      case '2':
        askForPrompt("2 (Need code)");
        break;
      case '3':
        askForPrompt("3 (Need suggestion)");
        break;
      default:
        console.log("Invalid choice. Please try again.");
        chatbot();
        break;
    }
  });
};

chatbot();