/* Project: Bihar Bhoomi Digital - Developer: Pawan Bhai */

const locationData = {
    "Araria": ["Araria", "Forbesganj", "Jokihat", "Raniganj"],
    "Arwal": ["Arwal", "Kaler", "Karpi", "Kurtha"],
    "Aurangabad": ["Aurangabad", "Barun", "Daudnagar", "Obra"],
    "Begusarai": ["Begusarai", "Barauni", "Bachhwara"],
    "Bhagalpur": ["Bhagalpur", "Colgong", "Nathnagar"],
    "Patna": ["Patna Sadar", "Bihta", "Danapur", "Phulwari Sharif"],
    "Muzaffarpur": ["Mushahari", "Kanti", "Motipur"],
    "Gaya": ["Gaya Town", "Bodh Gaya", "Sherghati"]
    // पवन भाई, यहाँ आप बाकी जिले भी इसी तरह जोड़ सकते हैं।
};

let searchHistory = JSON.parse(localStorage.getItem('plotHistory')) || [];

document.addEventListener('DOMContentLoaded', () => {
    const distSelect = document.getElementById("districtSelect");
    Object.keys(locationData).sort().forEach(dist => {
        let opt = document.createElement("option");
        opt.value = dist; opt.text = dist;
        distSelect.appendChild(opt);
    });
    updateTable();
});

function updateBlocks() {
    const dist = document.getElementById("districtSelect").value;
    const blockSelect = document.getElementById("blockSelect");
    blockSelect.innerHTML = '<option value="">-- ब्लॉक चुनें --</option>';
    if (dist && locationData[dist]) {
        locationData[dist].forEach(block => {
            let opt = document.createElement("option");
            opt.value = block; opt.text = block;
            blockSelect.appendChild(opt);
        });
    }
}

function searchData() {
    const dist = document.getElementById("districtSelect").value;
    const block = document.getElementById("blockSelect").value;
    const plot = document.getElementById("plotInput").value.trim();

    if (!dist || !block) {
        aiSpeak("कृपया जिला और ब्लॉक चुनें");
        alert("जिला और ब्लॉक चुनें!");
        return;
    }

    const info = `${dist}, ${block} ${plot ? '(प्लॉट: '+plot+')' : ''}`;
    saveToHistory(info, "सफल");
    aiSpeak(`${dist} के ${block} की जानकारी खोज रही हूँ`);
    window.open("https://biharbhumi.bihar.gov.in/Biharbhumi/ViewJamabandi", '_blank');
}

function aiSpeak(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = 'hi-IN';
        window.speechSynthesis.speak(speech);
    }
}

function openAI() {
    document.getElementById("aiModal").style.display = "block";
    aiSpeak("नमस्ते! मैं आपकी क्या मदद कर सकती हूँ?");
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'hi-IN';
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        document.getElementById("aiResultArea").innerText = "आपने कहा: " + transcript;
        if (transcript.includes("रसीद")) window.open("https://www.bhulagan.bihar.gov.in/", "_blank");
        else if (transcript.includes("नक्शा")) window.open("https://bhunaksha.bihar.gov.in/", "_blank");
        else if (transcript.includes("खाता")) window.open("https://biharbhumi.bihar.gov.in/", "_blank");
        setTimeout(closeAI, 2000);
    };
    recognition.start();
}

function closeAI() { document.getElementById("aiModal").style.display = "none"; }

function saveToHistory(plot, status) {
    searchHistory.unshift({ plot: plot, time: new Date().toLocaleTimeString(), status: status });
    localStorage.setItem('plotHistory', JSON.stringify(searchHistory));
    updateTable();
}

function updateTable() {
    const tb = document.getElementById("logTableBody");
    if (tb) tb.innerHTML = searchHistory.map((h, i) => `<tr><td>${i+1}</td><td><b>${h.plot}</b></td><td>${h.time}</td><td>✅</td></tr>`).join('');
}

function exportToExcel() {
    let csv = "No,Location,Time\n" + searchHistory.map((h,i)=>`${i+1},${h.plot},${h.time}`).join("\n");
    const link = document.createElement("a");
    link.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    link.download = "Bihar_Bhoomi_Report.csv";
    link.click();
}

function clearHistory() { searchHistory = []; localStorage.removeItem('plotHistory'); updateTable(); }

function checkFraudStatus() { aiSpeak("सावधान रहें।"); alert("टिप: रजिस्टर-2 देखें।"); }
