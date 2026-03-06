/* Project: Bihar Bhoomi Digital 
   Developer: Pawan Bhai
   Features: 
   - Google Sheets Sync (History)
   - Smart AI Voice Assistant (Speech-to-Text)
   - AI Voice Response (Text-to-Speech)
   - Auto Link Opener
   - Excel Export
*/

// 1. अपनी Google Apps Script का URL यहाँ डालें (अगर है तो)
const scriptURL = 'YOUR_GOOGLE_SCRIPT_URL_HERE'; 

let searchHistory = JSON.parse(localStorage.getItem('plotHistory')) || [];

// पेज लोड होते ही हिस्ट्री अपडेट करें
document.addEventListener('DOMContentLoaded', () => {
    updateTable();
});

// --- मुख्य सर्च फंक्शन (बटन क्लिक करने पर) ---
function searchData() {
    const plotInput = document.getElementById("plotInput");
    const plot = plotInput.value.trim();

    if (!plot) {
        aiSpeak("कृपया प्लॉट संख्या डालिये");
        alert("कृपया प्लॉट संख्या (खेसरा) डालें!");
        return;
    }

    saveToHistory(plot, "सफल");

    // Google Sheets में डेटा भेजना
    if(scriptURL !== 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
        fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plot: plot, time: new Date().toLocaleString() })
        }).catch(err => console.log("Sheet Error: ", err));
    }

    aiSpeak("ठीक है, मैं आपके लिए जानकारी खोज रही हूँ");
    window.open("https://biharbhumi.bihar.gov.in/Biharbhumi/ViewJamabandi", '_blank');
}

// --- AI को बोलने की शक्ति देना (Text to Speech) ---
function aiSpeak(text) {
    if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance();
        speech.text = text;
        speech.lang = 'hi-IN'; // शुद्ध हिंदी आवाज़
        speech.rate = 1; 
        speech.pitch = 1;
        window.speechSynthesis.speak(speech);
    }
}

// --- SMART AI वॉइस सहायक (सुनना और काम करना) ---
function openAI() {
    const modal = document.getElementById("aiModal");
    const status = document.getElementById("statusText");
    const resultArea = document.getElementById("aiResultArea");

    modal.style.display = "block";
    resultArea.innerText = "";
    
    // AI सबसे पहले स्वागत करेगा
    aiSpeak("नमस्ते! मैं आपकी क्या मदद कर सकती हूँ? आप रसीद, नक्शा या जमाबंदी के बारे में पूछ सकते हैं।");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        status.innerText = "आपका ब्राउज़र वॉइस सपोर्ट नहीं करता।";
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';

    recognition.onstart = () => {
        status.innerText = "सुन रहा हूँ... बोलिये";
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        resultArea.innerText = "आपने कहा: " + transcript;

        // --- AI LOGIC: बोलने पर काम करना ---
        setTimeout(() => {
            if (transcript.includes("रसीद") || transcript.includes("लगान") || transcript.includes("पैसा")) {
                aiSpeak("ठीक है, मैं आपके लिए भू लगान पोर्टल खोल रही हूँ।");
                window.open("https://www.bhulagan.bihar.gov.in/", "_blank");
            } 
            else if (transcript.includes("नक्शा") || transcript.includes("मैप")) {
                aiSpeak("ज़रूर, बिहार भू नक्शा पोर्टल अब खुल रहा है।");
                window.open("https://bhunaksha.bihar.gov.in/", "_blank");
            } 
            else if (transcript.includes("खाता") || transcript.includes("जमाबंदी") || transcript.includes("रिकॉर्ड")) {
                aiSpeak("जी, मैं आपके लिए अपना खाता पोर्टल खोल रही हूँ।");
                window.open("https://biharbhumi.bihar.gov.in/", "_blank");
            } 
            else if (transcript.includes("नमस्ते") || transcript.includes("हेलो")) {
                aiSpeak("नमस्ते पवन भाई! आपकी वेबसाइट बहुत शानदार काम कर रही है।");
            }
            else {
                // अगर नंबर बोला तो उसे सर्च बॉक्स में डाल दें
                const onlyNums = transcript.replace(/\D/g, "");
                if (onlyNums) {
                    document.getElementById("plotInput").value = onlyNums;
                    aiSpeak("मैंने प्लॉट संख्या डाल दी है, अब खोजें बटन पर क्लिक करें।");
                } else {
                    aiSpeak("क्षमा करें, मुझे समझ नहीं आया। क्या आप फिर से बोल सकते हैं?");
                }
            }
            // 3 सेकंड बाद AI बॉक्स बंद करें
            setTimeout(closeAI, 2000);
        }, 1000);
    };

    recognition.onerror = () => {
        status.innerText = "आवाज़ नहीं आई, फिर से कोशिश करें।";
    };

    recognition.start();
}

function closeAI() {
    document.getElementById("aiModal").style.display = "none";
}

// --- हिस्ट्री मैनेजमेंट ---
function saveToHistory(plot, status) {
    const entry = {
        plot: plot,
        time: new Date().toLocaleTimeString(),
        status: status
    };
    searchHistory.unshift(entry);
    if (searchHistory.length > 10) searchHistory.pop();
    localStorage.setItem('plotHistory', JSON.stringify(searchHistory));
    updateTable();
}

function updateTable() {
    const tableBody = document.getElementById("logTableBody");
    if (!tableBody) return;
    
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
        aiSpeak("इतिहास मिटा दिया गया है");
    }
}

// --- एक्सेल रिपोर्ट डाउनलोड ---
function exportToExcel() {
    if (searchHistory.length === 0) return alert("डेटा नहीं है!");
    
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

// फ्रॉड स्टेटस चेक
function checkFraudStatus() {
    aiSpeak("सावधान! ज़मीन के कागज़ात हमेशा अंचल कार्यालय से ही सत्यापित करवाएं।");
    alert("🛡️ सुरक्षा टिप: अगर प्लॉट का म्यूटेशन पुराना है, तो रजिस्टर-2 की जांच ज़रूर करें।");
}
