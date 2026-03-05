/* Startup Name: Bihar Bhoomi Digital 
   Developer: Pawan Bhai
   Features: Google Sheets Sync, AI Voice Search, Excel Export
*/

// 1. अपनी Google Apps Script का URL यहाँ डालें
const scriptURL = 'YOUR_GOOGLE_SCRIPT_URL_HERE'; 

let recognition;
let searchHistory = JSON.parse(localStorage.getItem('plotHistory')) || [];

// पेज लोड होते ही पुरानी हिस्ट्री दिखाएं
document.addEventListener('DOMContentLoaded', () => {
    updateTable();
});

// --- मुख्य सर्च फंक्शन ---
function searchData() {
    const plotInput = document.getElementById("plotInput");
    const plot = plotInput.value.trim();

    if (!plot) {
        alert("कृपया प्लॉट संख्या (खेसरा) डालें!");
        return;
    }

    // 1. हिस्ट्री में सेव करें
    saveToHistory(plot, "सफल");

    // 2. Google Sheets में भेजें
    fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plot: plot, time: new Date().toLocaleString() })
    }).catch(err => console.log("Sheet Error: ", err));

    // 3. सरकारी पोर्टल खोलें
    window.open("https://biharbhumi.bihar.gov.in/Biharbhumi/ViewJamabandi", '_blank');
}

// --- हिस्ट्री मैनेजमेंट ---
function saveToHistory(plot, status) {
    const entry = {
        plot: plot,
        time: new Date().toLocaleTimeString(),
        status: status
    };
    searchHistory.unshift(entry); // नया सर्च सबसे ऊपर
    if (searchHistory.length > 10) searchHistory.pop(); // सिर्फ टॉप 10 रखें
    localStorage.setItem('plotHistory', JSON.stringify(searchHistory));
    updateTable();
}

function updateTable() {
    const tableBody = document.getElementById("logTableBody");
    if(!tableBody) return;
    
    tableBody.innerHTML = searchHistory.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><b>${item.plot}</b></td>
            <td>${item.time}</td>
            <td><span style="color: green;">✅ ${item.status}</span></td>
        </tr>
    `).join('');
}

function clearHistory() {
    if(confirm("क्या आप सारा इतिहास मिटाना चाहते हैं?")) {
        searchHistory = [];
        localStorage.removeItem('plotHistory');
        updateTable();
    }
}

// --- AI वॉइस सर्च फंक्शन (सुधारा हुआ) ---
function openAI() {
    document.getElementById("aiModal").style.display = "flex";
    document.getElementById("statusText").innerText = "सुन रहा हूँ... बोलिए";
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("आपका ब्राउज़र वॉइस सर्च सपोर्ट नहीं करता।");
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById("plotInput").value = transcript.replace(/\D/g, ""); // सिर्फ नंबर रखें
        document.getElementById("statusText").innerText = "पहचाना गया: " + transcript;
        setTimeout(closeAI, 1500);
    };

    recognition.onerror = () => {
        document.getElementById("statusText").innerText = "आवाज़ समझ नहीं आई, फिर से कोशिश करें।";
    };

    recognition.start();
}

function closeAI() {
    document.getElementById("aiModal").style.display = "none";
    if (recognition) {
        try {
            recognition.stop();
        } catch(e) {
            console.log("Recognition already stopped");
        }
    }
}

// --- एक्सेल रिपोर्ट डाउनलोड ---
function exportToExcel() {
    if (searchHistory.length === 0) return alert("निर्यात करने के लिए कोई डेटा नहीं है!");
    
    let csvContent = "data:text/csv;charset=utf-8,No.,Plot Number,Time,Status\n";
    searchHistory.forEach((row, index) => {
        csvContent += `${index + 1},${row.plot},${row.time},${row.status}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Bihar_Bhoomi_Report.csv");
    document.body.appendChild(link);
    link.click();
}

// फ्रॉड स्टेटस चेक (सिर्फ डेमो के लिए)
function checkFraudStatus() {
    alert("🛡️ सुरक्षा टिप: अगर प्लॉट का म्यूटेशन 1990 से पहले का है, तो रजिस्टर-2 की कॉपी अंचल कार्यालय से जरूर चेक कराएं।");
}