/* Project: Bihar Bhoomi Digital 
   Developer: Pawan Bhai
   Final Update: Added Bhunaksha, Mutation & AI Voice Responses
*/

// 1. अपनी Google Apps Script का URL यहाँ डालें
const scriptURL = 'YOUR_GOOGLE_SCRIPT_URL_HERE'; 

let searchHistory = JSON.parse(localStorage.getItem('plotHistory')) || [];

document.addEventListener('DOMContentLoaded', () => {
    updateTable();
});

// --- मुख्य सर्च फंक्शन ---
function searchData() {
    const plotInput = document.getElementById("plotInput");
    const plot = plotInput.value.trim();

    if (!plot) {
        aiSpeak("कृपया प्लॉट संख्या डालिये");
        alert("कृपया प्लॉट संख्या (खेसरा) डालें!");
        return;
    }

    saveToHistory(plot, "सफल");

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

// --- AI आवाज़ (Text to Speech) ---
function aiSpeak(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // पुरानी आवाज़ रोकें
        const speech = new SpeechSynthesisUtterance();
        speech.text = text;
        speech.lang = 'hi-IN';
        speech.rate = 1; 
        window.speechSynthesis.speak(speech);
    }
}

// --- SMART AI सहायक (सुनना और काम करना) ---
function openAI() {
    const modal = document.getElementById("aiModal");
    const status = document.getElementById("statusText");
    const resultArea = document.getElementById("aiResultArea");

    modal.style.display = "block";
    resultArea.innerText = "";
    
    aiSpeak("नमस्ते! मैं आपकी क्या मदद कर सकती हूँ? आप रसीद, नक्शा, जमाबंदी या दाखिल खारिज के बारे में पूछ सकते हैं।");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        status.innerText = "आपका ब्राउज़र सपोर्ट नहीं करता।";
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';

    recognition.onstart = () => { status.innerText = "सुन रहा हूँ... बोलिये"; };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        resultArea.innerText = "आपने कहा: " + transcript;

        setTimeout(() => {
            // 1. रसीद / लगान
            if (transcript.includes("रसीद") || transcript.includes("लगान")) {
                aiSpeak("ठीक है, मैं आपके लिए भू लगान पोर्टल खोल रही हूँ।");
                window.open("https://www.bhulagan.bihar.gov.in/", "_blank");
            } 
            // 2. नक्शा (वापस जोड़ा गया)
            else if (transcript.includes("नक्शा") || transcript.includes("मैप")) {
                aiSpeak("ज़रूर, बिहार भू नक्शा पोर्टल अब खुल रहा है।");
                window.open("https://bhunaksha.bihar.gov.in/", "_blank");
            } 
            // 3. अपना खाता / जमाबंदी
            else if (transcript.includes("खाता") || transcript.includes("जमाबंदी")) {
                aiSpeak("जी, मैं आपके लिए अपना खाता पोर्टल खोल रही हूँ।");
                window.open("https://biharbhumi.bihar.gov.in/", "_blank");
            } 
            // 4. दाखिल खारिज (वापस जोड़ा गया)
            else if (transcript.includes("दाखिल") || transcript.includes("खारिज") || transcript.includes("म्यूटेशन")) {
                aiSpeak("जी, मैं आपके लिए दाखिल खारिज की स्थिति चेक करने वाला पेज खोल रही हूँ।");
                window.open("https://biharbhumi.bihar.gov.in/Biharbhumi/MutationStatusNew", "_blank");
            }
            // 5. नमस्ते / हेलो
            else if (transcript.includes("नमस्ते") || transcript.includes("हेलो")) {
                aiSpeak("नमस्ते पवन भाई! आपकी वेबसाइट बहुत अच्छी तरह काम कर रही है।");
            }
            // 6. नंबर पहचानना
            else {
                const onlyNums = transcript.replace(/\D/g, "");
                if (onlyNums) {
                    document.getElementById("plotInput").value = onlyNums;
                    aiSpeak("मैंने प्लॉट संख्या " + onlyNums + " डाल दी है। अब खोजें बटन दबाएं।");
                } else {
                    aiSpeak("क्षमा करें, मुझे समझ नहीं आया। क्या आप फिर से बोल सकते हैं?");
                }
            }
            setTimeout(closeAI, 2500);
        }, 1000);
    };

    recognition.onerror = () => { status.innerText = "आवाज़ नहीं आई..."; };
    recognition.start();
}

function closeAI() {
    document.getElementById("aiModal").style.display = "none";
}

// --- हिस्ट्री मैनेजमेंट ---
function saveToHistory(plot, status) {
    const entry = { plot: plot, time: new Date().toLocaleTimeString(), status: status };
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
    if(confirm("इतिहास मिटाएं?")) {
        searchHistory = [];
        localStorage.removeItem('plotHistory');
        updateTable();
        aiSpeak("इतिहास मिटा दिया गया है");
    }
}

function exportToExcel() {
    if (searchHistory.length === 0) return alert("डेटा नहीं है!");
    let csv = "No.,Plot Number,Time,Status\n" + searchHistory.map((r,i) => `${i+1},${r.plot},${r.time},${r.status}`).join("\n");
    const link = document.createElement("a");
    link.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    link.download = "Bihar_Bhoomi_Report.csv";
    link.click();
}

function checkFraudStatus() {
    aiSpeak("सावधान! ज़मीन के कागज़ात हमेशा अंचल कार्यालय से ही चेक करवाएं।");
    alert("🛡️ सुरक्षा टिप: म्यूटेशन पुराना है तो रजिस्टर-2 ज़रूर देखें।");
}
