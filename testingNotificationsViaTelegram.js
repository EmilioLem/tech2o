const TelegramBot = require('node-telegram-bot-api');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const jsonfile = require('jsonfile');
const csv = require('csv-parser');
const path = require('path');
const fs = require('fs');

const tips = [
  "Toma un baño más corto y con agua fría.",
  "Arregla los grifos que gotean.",
  "Recoge el agua de la lluvia para regar las plantas.",
  "Usa un temporizador en la ducha.",
  "Cierra el grifo mientras te cepillas los dientes.",
  "Llena una jarra de agua para beber en lugar de usar el grifo.",
  "Lava los platos en un tazón lleno de agua jabonosa.",
  "Lava la ropa solo cuando sea necesario.",
  "Usa una lavadora de alta eficiencia energética.",
  "Instala un cabezal de ducha de bajo flujo.",
  "Reemplaza el césped por plantas que requieran menos agua.",
  "Riega el jardín por la mañana temprano o por la noche para evitar la evaporación.",
  "Usa un sistema de riego eficiente.",
  "Comprueba las fugas de agua en el inodoro.",
  "Lava los coches con una manguera con una boquilla de pulverización.",
  "Enseña a tus hijos a ahorrar agua.",
  "Haz un seguimiento de tu consumo de agua y establece metas de ahorro.",
  "Participa en programas de conservación de agua de tu comunidad.",
  "Comparte tus consejos de ahorro de agua con tus amigos y familiares."
];

const publicHoses = [
  {
    hose_id: 1,
    diameter: 2.5,
    installationDate: '2023-01-10',
    waterFlowData: [
      { date: '2024-08-20', flow: 150 },
      { date: '2024-08-21', flow: 145 },
      { date: '2024-08-22', flow: 158 },
      { date: '2024-08-23', flow: 152 },
      { date: '2024-08-24', flow: 148 },
      { date: '2024-08-25', flow: 155 },
      { date: '2024-08-26', flow: 160 },
    ],
  },
  {
    hose_id: 2,
    diameter: 3.0,
    installationDate: '2023-02-15',
    waterFlowData: [
      { date: '2024-08-20', flow: 210 },
      { date: '2024-08-21', flow: 215 },
      { date: '2024-08-22', flow: 220 },
      { date: '2024-08-23', flow: 205 },
      { date: '2024-08-24', flow: 198 },
      { date: '2024-08-25', flow: 200 },
      { date: '2024-08-26', flow: 210 },
    ],
  },
  {
    hose_id: 3,
    diameter: 2.8,
    installationDate: '2023-03-20',
    waterFlowData: [
      { date: '2024-08-20', flow: 130 },
      { date: '2024-08-21', flow: 125 },
      { date: '2024-08-22', flow: 132 },
      { date: '2024-08-23', flow: 128 },
      { date: '2024-08-24', flow: 135 },
      { date: '2024-08-25', flow: 140 },
      { date: '2024-08-26', flow: 138 },
    ],
  },
  {
    hose_id: 4,
    diameter: 3.5,
    installationDate: '2023-04-05',
    waterFlowData: [
      { date: '2024-08-20', flow: 250 },
      { date: '2024-08-21', flow: 260 },
      { date: '2024-08-22', flow: 255 },
      { date: '2024-08-23', flow: 248 },
      { date: '2024-08-24', flow: 242 },
      { date: '2024-08-25', flow: 265 },
      { date: '2024-08-26', flow: 270 },
    ],
  },
  {
    hose_id: 5,
    diameter: 2.0,
    installationDate: '2023-05-01',
    waterFlowData: [
      { date: '2024-08-20', flow: 90 },
      { date: '2024-08-21', flow: 85 },
      { date: '2024-08-22', flow: 95 },
      { date: '2024-08-23', flow: 92 },
      { date: '2024-08-24', flow: 88 },
      { date: '2024-08-25', flow: 93 },
      { date: '2024-08-26', flow: 97 },
    ],
  },
  {
    hose_id: 6,
    diameter: 3.2,
    installationDate: '2023-06-12',
    waterFlowData: [
      { date: '2024-08-20', flow: 180 },
      { date: '2024-08-21', flow: 175 },
      { date: '2024-08-22', flow: 185 },
      { date: '2024-08-23', flow: 182 },
      { date: '2024-08-24', flow: 178 },
      { date: '2024-08-25', flow: 190 },
      { date: '2024-08-26', flow: 195 },
    ],
  },
  {
    hose_id: 7,
    diameter: 2.7,
    installationDate: '2023-07-20',
    waterFlowData: [
      { date: '2024-08-20', flow: 120 },
      { date: '2024-08-21', flow: 125 },
      { date: '2024-08-22', flow: 118 },
      { date: '2024-08-23', flow: 122 },
      { date: '2024-08-24', flow: 128 },
      { date: '2024-08-25', flow: 130 },
      { date: '2024-08-26', flow: 127 },
    ],
  },
  {
    hose_id: 8,
    diameter: 3.1,
    installationDate: '2023-08-05',
    waterFlowData: [
      { date: '2024-08-20', flow: 170 },
      { date: '2024-08-21', flow: 165 },
      { date: '2024-08-22', flow: 172 },
      { date: '2024-08-23', flow: 168 },
      { date: '2024-08-24', flow: 175 },
      { date: '2024-08-25', flow: 178 },
      { date: '2024-08-26', flow: 180 },
    ],
  },
  {
    hose_id: 9,
    diameter: 3.4,
    installationDate: '2023-09-10',
    waterFlowData: [
      { date: '2024-08-20', flow: 220 },
      { date: '2024-08-21', flow: 225 },
      { date: '2024-08-22', flow: 230 },
      { date: '2024-08-23', flow: 222 },
      { date: '2024-08-24', flow: 218 },
      { date: '2024-08-25', flow: 235 },
      { date: '2024-08-26', flow: 240 },
    ],
  },
  {
    hose_id: 10,
    diameter: 2.9,
    installationDate: '2023-10-01',
    waterFlowData: [
      { date: '2024-08-20', flow: 140 },
      { date: '2024-08-21', flow: 135 },
      { date: '2024-08-22', flow: 142 },
      { date: '2024-08-23', flow: 138 },
      { date: '2024-08-24', flow: 145 },
      { date: '2024-08-25', flow: 150 },
      { date: '2024-08-26', flow: 147 },
    ],
  },
];


// Administrator data
let admin = { chatId: null, name: null };

const token = process.env.TELEGRAM_BOT_TOKEN;//'YOUR_TELEGRAM_BOT_TOKEN';
if (!token) {
  console.error('Error: TELEGRAM_BOT_TOKEN is not set.');
  process.exit(1);
}
const bot = new TelegramBot(token, { polling: true });

const dataFilePath = path.join(__dirname, 'bot_data.json');
let botData = { userStates: [], subscribedUsers: [] };

const loadData = () => {
  try {
    botData = jsonfile.readFileSync(dataFilePath);
  } catch (error) {
    console.log('No existing data found. Starting fresh.');
  }
};

const saveData = () => {
  jsonfile.writeFileSync(dataFilePath, botData, { spaces: 2 });
};

loadData();
const getUserState = (chatId) => botData.userStates.find((user) => user.chatId === chatId);

const updateUserState = (chatId, action) => {
  let user = getUserState(chatId);
  if (user) {
    user.action = action;
  } else {
    botData.userStates.push({ chatId, action });
  }
  saveData();
};

const clearUserState = (chatId) => {
  botData.userStates = botData.userStates.filter((user) => user.chatId !== chatId);
  saveData();
};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    'Bienvenido! Por favor ingresa tu nombre y número de contrado de la CEA.\nEjemplo: Tony Stark, 1234567'
  );
  updateUserState(chatId, 'awaiting_name_and_contract');
});


bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text.startsWith('/')) return;

  const userState = getUserState(chatId);
  console.log(chatId);
  

  if (userState) {

    switch(userState.action){
      case 'awaiting_name_and_contract':

        
        const parts = text.split(',').map(part => part.trim());
        
        if (parts.length === 2) {
          const name = parts[0];
          const contractNumber = Number(parts[1]); 
          
          if (!isNaN(contractNumber) && parts[1].length >= 3) {
            // Check if the user already exists
            const existingUserIndex = botData.subscribedUsers.findIndex(
              (user) => user.chatId === chatId
            );
      
            if (existingUserIndex !== -1) {
              // If user exists, update their information and remove the old entry
              botData.subscribedUsers.splice(existingUserIndex, 1);
              console.log(`Updated existing user: ${chatId}`);
            }
      
            // Add the new or updated user information
            botData.subscribedUsers.push({ chatId, name, contractNumber });
            saveData();
      
            clearUserState(chatId);
      
            bot.sendMessage(
              chatId,
              `Gracias, ${name}. Su número de contrato ${contractNumber} se ha guardado satisfactoriamente.`
            );
      
            fetchAndStoreUserData(chatId, contractNumber);
          } else {
            bot.sendMessage(
              chatId,
              'El número de contrato no es correcto, debe tener al menos 3 dígitos.'
            );
          }
          /*if (!isNaN(contractNumber) && parts[1].length >= 3) {
            
            botData.subscribedUsers.push({ chatId, name, contractNumber });
            saveData();
            
            clearUserState(chatId);
            
            bot.sendMessage(
              chatId,
               `Gracias, ${name}. Su número de contrato ${contractNumber} se ha guardado satisfactoriamente.`
            );

            fetchAndStoreUserData(chatId, contractNumber);
            
            //if(contractNumber)
          } else {
            bot.sendMessage(
              chatId,
              'El número de contrato no es correcto, debe tener al menos 3 dígitos. '
            );
          }*/
        } else {
          bot.sendMessage(
            chatId,
            'El registro debe tener este formato: \n Tony Stark, 1234567'
          );
        }
        break;

        case 'awaiting_admin_credentials': 
          const parts2 = text.split(',').map(part => part.trim());
          if (parts2.length === 2) {
            const name = parts2[0];
            const password = parts2[1];
  
            // Check if the password is correct
            if (password === '1234') {
              admin = { chatId, name };
              bot.sendMessage(chatId, `Administrador establecido exitosamente: ${name}`);
              clearUserState(chatId);
            } else {
              bot.sendMessage(chatId, 'Contraseña incorrecta. Inténtelo de nuevo.');
            }
          } else {
            bot.sendMessage(chatId, 'Ingrese el nombre y la contraseña separados por una coma.');
          }
          break;
      }
  }
});

console.log('Bot is running...');




/*
  What should I read later...
- clearUserState



Forgot to check!!! and migth break...
- We're storing botData.subscribedUsers.push twice... maybe

*/



const width = 800; // Width of the chart image 
const height = 400; // Height of the chart image 
const chartCallback = (ChartJS) => { // Can be used to register plugins or update Chart.js 
  };

const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });

const sampleData = { labels: ['January', 'February', 'March', 'April', 'May', 'June'], datasets: [ { label: 'Water Usage (liters)', data: [150, 200, 180, 220, 170, 250], borderColor: 'rgba(75, 192, 192, 1)', backgroundColor: 'rgba(75, 192, 192, 0.2)', borderWidth: 1, }, ], };

async function generateChartImage(data) { const configuration = { type: 'line', data: data, options: { scales: { y: { beginAtZero: true, }, }, }, }; return await chartJSNodeCanvas.renderToBuffer(configuration); }

bot.onText(/\/grafica/, async (msg) => {
  const chatId = msg.chat.id;
  const user = botData.subscribedUsers.find((user) => user.chatId === chatId);

  if (!user || !user.chartData) {
    bot.sendMessage(chatId, 'No encontramos datos en su contrato. Por favor regístrese con un número de contrato válido.');
    return;
  }
  try {
    const imageBuffer = await generateChartImage(user.chartData);

    const imagePath = './chart.png';
    fs.writeFileSync(imagePath, imageBuffer);

    await bot.sendPhoto(chatId, imageBuffer, {
      caption: 'Esta es tu gráfica de consumo de agua!',
    });

    fs.unlinkSync(imagePath);
  } catch (error) {
    console.error('Error generating or sending chart:', error);
    bot.sendMessage(chatId, 'Perdón, ocurrió un error al generar la gráfica.');
  }
});





// Path to your CSV file 
const csvFilePath = './consumo_pasado_interfa.csv';

// Function to get data for a given id_contrato 
function getDataByIdContrato(id_contrato) { 
  return new Promise((resolve, reject) => {
     const results = [];

    // Read the CSV file and parse the data
    fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      // Check if the current row matches the given `id_contrato`
      if (parseInt(row.id_contrato) === id_contrato) {
        results.push({
          date: new Date(row.fecha_lectura),
          consumption: parseInt(row.consumo_leido),
        });
      }
    })
    .on('end', () => {
      // Sort results by date to ensure chronological order
      results.sort((a, b) => a.date - b.date);
    
      // Prepare data for charting
      const sampleData = {
        labels: results.map((item) => item.date.toISOString().split('T')[0]), // Format dates as YYYY-MM-DD
        datasets: [
          {
            label: '(consumo_leido)',
            data: results.map((item) => item.consumption),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 1,
          },
        ],
      };
    
      // Resolve the promise with formatted data
      resolve(sampleData);
    })
    .on('error', (error) => {
      reject(error);
    });

  }); 
}

/*async function fetchAndStoreUserData(chatId, id_contrato) {
   try {
     const chartData = await getDataByIdContrato(id_contrato);


    // Simulate saving to the bot's user data (you'll replace this with your actual data saving logic)
    botData.subscribedUsers.push({ chatId, id_contrato, chartData });
    saveData();

    console.log('User data saved:', { chatId, chartData });
  } catch (error) { console.error('Error fetching data:', error); 

  } 
}*/
async function fetchAndStoreUserData(chatId, contractNumber) {
  try {
    // Fetch data from CSV using the provided contractNumber
    const chartData = await getDataByIdContrato(contractNumber);

    // Find the user in the subscribedUsers array
    const userIndex = botData.subscribedUsers.findIndex(
      (user) => user.chatId === chatId
    );

    if (userIndex !== -1) {
      // Update existing user with chartData
      botData.subscribedUsers[userIndex].chartData = chartData;
    } else {
      // Add new user entry if not already in the subscribedUsers array
      botData.subscribedUsers.push({ chatId, contractNumber, chartData });
    }
    
    // Save updated data
    saveData();
    
    console.log('User data saved:', { chatId, chartData });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

bot.onText(/\/sim_red_cea/, async (msg) => {
  publicHoses.forEach((hose) => {
    simulateHoseFlow(hose);
    checkForAnomalies(hose);
  });

  bot.sendMessage(msg.chat.id, 'Simulación de la red CEA completada. Revisando anomalías...');
});

bot.onText(/\/simular/, async (msg) => {
  botData.subscribedUsers.forEach((user) => {
    simulateDataPoint(user);
    lookForAnomalies(user);
  });

  //bot.sendMessage(msg.chat.id, 'Simulación completada. Revisando anomalías...');
});

function simulateDataPoint(user) {
  // If user has no chartData or insufficient data, skip simulation
  if (!user.chartData || user.chartData.datasets[0].data.length === 0) {
    console.log(`No data available for user with chatId: ${user.chatId}`);
    return;
  }

  const lastConsumption = user.chartData.datasets[0].data.slice(-1)[0];

  // Generate a random change between -20% and +20%
  const randomChange = lastConsumption * (Math.random() * 0.8 - 0.2);

  // New consumption value based on the last one
  const newConsumption = Math.round(lastConsumption + randomChange);

  // Add today's date and the new consumption value
  const today = new Date().toISOString().split('T')[0];
  user.chartData.labels.push(today);
  user.chartData.datasets[0].data.push(newConsumption);

  saveData();

  console.log(`Simulated new data for ${user.chatId}: ${newConsumption}`);
}

// Function to check for anomalies based on the last 5 data points
function lookForAnomalies(user) {
  const data = user.chartData.datasets[0].data;

  if (data.length < 6) {
    console.log(`Insufficient data points to check for anomalies for user ${user.chatId}`);
    return;
  }

  const latestDataPoint = data[data.length - 1];

  const recentData = data.slice(-6, -1); // Last 5 before the latest
  const average = recentData.reduce((sum, value) => sum + value, 0) / recentData.length;

  // Check if the latest data point deviates by more than 30% from the average
  const isAnomaly = latestDataPoint > average * 1.3 || latestDataPoint < average * 0.7;

  if (isAnomaly) {
    bot.sendMessage(
      user.chatId,
      `Atención: Se ha detectado un consumo anómalo en su última lectura. 
      Su consumo actual es ${latestDataPoint} litros, lo cual es un ${Math.round(
        ((latestDataPoint - average) / average) * 100
      )}% ${latestDataPoint > average ? 'mayor' : 'menor'} que el promedio reciente.`
    );
    console.log(`Anomaly detected for user ${user.chatId}: ${latestDataPoint}`);
  }
}

bot.onText(/\/alerta_corte/, (msg) => {
  
  const alertMessage = `⚠️ Aviso importante: Se ha programado un corte de agua en su área próximamente. \n
  Por favor, tome las precauciones necesarias para minimizar el impacto de este corte.`;

  botData.subscribedUsers.forEach((user) => {
    bot.sendMessage(user.chatId, alertMessage).catch((error) => {
      console.error(`Error sending alert to user ${user.chatId}:`, error);
    });
  });

  console.log('Alert sent to all registered users.');

  bot.sendMessage(msg.chat.id, 'Se ha enviado una alerta a todos los usuarios registrados.');
});

const getRandomTip = () => {
  const randomIndex = Math.floor(Math.random() * tips.length);
  return tips[randomIndex];
};

bot.onText(/\/tips/, (msg) => {
  const chatId = msg.chat.id;
  const randomTip = getRandomTip();
  bot.sendMessage(chatId, `Consejo para ahorrar agua: ${randomTip}`);
});

bot.onText(/\/set_admin/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Por favor ingrese su nombre y la contraseña\nEjemplo: Admin, 1234');
  updateUserState(chatId, 'awaiting_admin_credentials');
});


function simulateHoseFlow(hose) {
  
  const lastFlow = hose.waterFlowData.slice(-1)[0].flow;

  // Generate a random flow change between -20% and +20%
  const randomChange = lastFlow * (Math.random() * 0.6 - 0.2);
  const newFlow = Math.round(lastFlow + randomChange);

  hose.waterFlowData.push({ date: new Date().toISOString().split('T')[0], flow: newFlow });
  console.log(`Simulated new flow for hose ${hose.hose_id}: ${newFlow} L/s`);
}

function checkForAnomalies(hose) {
  const data = hose.waterFlowData;

  if (data.length < 6) {
    console.log(`Insufficient data points to check for anomalies for hose ${hose.hose_id}`);
    return;
  }

  const latestFlow = data[data.length - 1].flow;

  const recentFlows = data.slice(-6, -1); // Last 5 before the latest
  const averageFlow = recentFlows.reduce((sum, item) => sum + item.flow, 0) / recentFlows.length;

  const isAnomaly = latestFlow > averageFlow * 1.3 || latestFlow < averageFlow * 0.7;
  //console.log(isAnomaly);
  

  if (isAnomaly && admin.chatId) {
    bot.sendMessage(
      admin.chatId,
      `⚠️ Anomalía detectada en la manguera ${hose.hose_id}: 
      El flujo actual es ${latestFlow} L/s, lo cual es un ${Math.round(
        ((latestFlow - averageFlow) / averageFlow) * 100
      )}% ${latestFlow > averageFlow ? 'mayor' : 'menor'} que el promedio reciente.`
    );
    console.log(`Anomaly detected for hose ${hose.hose_id}: ${latestFlow} L/s`);
  }
}

// Handle admin credentials input
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Skip if the message is a command
  if (text.startsWith('/')) return;

  const userState = getUserState(chatId);

  if (userState) {
    switch (userState.action) {
      case 'awaiting_admin_credentials': {
        const parts = text.split(',').map(part => part.trim());
        if (parts.length === 2) {
          const name = parts[0];
          const password = parts[1];

          // Check if the password is correct
          if (password === '1234') {
            admin = { chatId, name };
            bot.sendMessage(chatId, `Administrador establecido exitosamente: ${name}`);
            clearUserState(chatId);
          } else {
            bot.sendMessage(chatId, 'Contraseña incorrecta. Inténtelo de nuevo.');
          }
        } else {
          bot.sendMessage(chatId, 'Ingrese el nombre y la contraseña separados por una coma.');
        }
        break;
      }

      // Handle other states here...
    }
  }
});