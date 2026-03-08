/* Project: Bihar Bhoomi Digital - Pawan Kushwaha */

const locationData = {
    "Araria": ["Araria", "Forbesganj", "Jokihat"],
    "Arwal": ["Arwal", "Kaler", "Karpi"],
    "Aurangabad": ["Aurangabad", "Barun", "Daudnagar"],
    "Patna": ["Patna Sadar", "Bihta", "Danapur", "Phulwari Sharif"],
    "Muzaffarpur": ["Mushahari", "Kanti", "Motipur"],
    "Gaya": ["Gaya Town", "Bodh Gaya", "Sherghati"]
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

function aiSpeak(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = 'hi-IN';
        window.speechSynthesis.speak(speech);
    }
}

function openAI() {
    const modal = document.getElementById("aiModal");
    const resultArea = document.getElementById("aiResultArea");
    const status = document.getElementById("statusText");

    modal.style.display = "block";
    resultArea.innerText = "तैयार हो रहा हूँ...";
    aiSpeak("नमस्ते पवन भाई! मैं आपकी क्या मदद कर सकती हूँ?");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.onstart = () => { status.innerText = "मैं सुन रही हूँ... बोलिये"; };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        resultArea.innerHTML = "आपने कहा: " + transcript;

        setTimeout(() => {
            if (transcript.includes("रसीद") || transcript.includes("लगान")) {
                aiSpeak("ठीक है, भू-लगान पोर्टल खोल रही हूँ।");
                window.open("https://www.bhulagan.bihar.gov.in/", "_blank");
            } 
            else if (transcript.includes("नक्शा") || transcript.includes("मैप")) {
                aiSpeak("जी, बिहार भू-नक्शा पोर्टल खुल रहा है।");
                window.open("https://bhunaksha.bihar.gov.in/", "_blank");
            } 
            else if (transcript.includes("दाखिल") || transcript.includes("खारिज")) {
                aiSpeak("दाखिल खारिज की स्थिति चेक करने वाला पेज खोल रही हूँ।");
                window.open("https://biharbhumi.bihar.gov.in/Biharbhumi/MutationStatusNew", "_blank");
            }
            else if (transcript.includes("खाता") || transcript.includes("जमाबंदी")) {
                aiSpeak("मैं आपके लिए अपना खाता पोर्टल खोल रही हूँ।");
                window.open("https://biharbhumi.bihar.gov.in/", "_blank");
            }
            else {
                aiSpeak("क्षमा करें, मुझे समझ नहीं आया।");
            }
            setTimeout(closeAI, 2500);
        }, 1000);
    };
    recognition.start();
}

function closeAI() { document.getElementById("aiModal").style.display = "none"; }

function searchData() {
    const dist = document.getElementById("districtSelect").value;
    const block = document.getElementById("blockSelect").value;
    const plot = document.getElementById("plotInput").value.trim();

    if (!dist || !block) return alert("कृपया जिला और ब्लॉक चुनें!");

    const info = `${dist}, ${block} ${plot ? '(प्लॉट:'+plot+')' : ''}`;
    saveToHistory(info, "सफल");
    window.open("https://biharbhumi.bihar.gov.in/Biharbhumi/ViewJamabandi", '_blank');
}

function saveToHistory(loc, status) {
    searchHistory.unshift({ plot: loc, time: new Date().toLocaleTimeString(), status: status });
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
function checkFraudStatus() { alert("सावधान! हमेशा सरकारी रिकॉर्ड ही चेक करें।"); }/* Project: Bihar Bhoomi Digital - Pawan Kushwaha */

const locationData = {
    "Araria": ["Araria", "Forbesganj", "Jokihat"],
    "Arwal": ["Arwal", "Kaler", "Karpi"],
    "Aurangabad": ["Aurangabad", "Barun", "Daudnagar"],
    "Patna": ["Patna Sadar", "Bihta", "Danapur", "Phulwari Sharif"],
    "Muzaffarpur": ["Mushahari", "Kanti", "Motipur"],
    "Gaya": ["Gaya Town", "Bodh Gaya", "Sherghati"]
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

function aiSpeak(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = 'hi-IN';
        window.speechSynthesis.speak(speech);
    }
}

function openAI() {
    const modal = document.getElementById("aiModal");
    const resultArea = document.getElementById("aiResultArea");
    const status = document.getElementById("statusText");

    modal.style.display = "block";
    resultArea.innerText = "तैयार हो रहा हूँ...";
    aiSpeak("नमस्ते पवन भाई! मैं आपकी क्या मदद कर सकती हूँ?");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.onstart = () => { status.innerText = "मैं सुन रही हूँ... बोलिये"; };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        resultArea.innerHTML = "आपने कहा: " + transcript;

        setTimeout(() => {
            if (transcript.includes("रसीद") || transcript.includes("लगान")) {
                aiSpeak("ठीक है, भू-लगान पोर्टल खोल रही हूँ।");
                window.open("https://www.bhulagan.bihar.gov.in/", "_blank");
            } 
            else if (transcript.includes("नक्शा") || transcript.includes("मैप")) {
                aiSpeak("जी, बिहार भू-नक्शा पोर्टल खुल रहा है।");
                window.open("https://bhunaksha.bihar.gov.in/", "_blank");
            } 
            else if (transcript.includes("दाखिल") || transcript.includes("खारिज")) {
                aiSpeak("दाखिल खारिज की स्थिति चेक करने वाला पेज खोल रही हूँ।");
                window.open("https://biharbhumi.bihar.gov.in/Biharbhumi/MutationStatusNew", "_blank");
            }
            else if (transcript.includes("खाता") || transcript.includes("जमाबंदी")) {
                aiSpeak("मैं आपके लिए अपना खाता पोर्टल खोल रही हूँ।");
                window.open("https://biharbhumi.bihar.gov.in/", "_blank");
            }
            else {
                aiSpeak("क्षमा करें, मुझे समझ नहीं आया।");
            }
            setTimeout(closeAI, 2500);
        }, 1000);
    };
    recognition.start();
}

function closeAI() { document.getElementById("aiModal").style.display = "none"; }

function searchData() {
    const dist = document.getElementById("districtSelect").value;
    const block = document.getElementById("blockSelect").value;
    const plot = document.getElementById("plotInput").value.trim();

    if (!dist || !block) return alert("कृपया जिला और ब्लॉक चुनें!");

    const info = `${dist}, ${block} ${plot ? '(प्लॉट:'+plot+')' : ''}`;
    saveToHistory(info, "सफल");
    window.open("https://biharbhumi.bihar.gov.in/Biharbhumi/ViewJamabandi", '_blank');
}

function saveToHistory(loc, status) {
    searchHistory.unshift({ plot: loc, time: new Date().toLocaleTimeString(), status: status });
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
function checkFraudStatus() { alert("सावधान! हमेशा सरकारी रिकॉर्ड ही चेक करें।"); }/* Project: Bihar Bhoomi Digital - Pawan Kushwaha */

const locationData = {
    "Araria": ["Araria", "Forbesganj", "Jokihat"],
    "Arwal": ["Arwal", "Kaler", "Karpi"],
    "Aurangabad": ["Aurangabad", "Barun", "Daudnagar"],
    "Patna": ["Patna Sadar", "Bihta", "Danapur", "Phulwari Sharif"],
    "Muzaffarpur": ["Mushahari", "Kanti", "Motipur"],
    "Gaya": ["Gaya Town", "Bodh Gaya", "Sherghati"]
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

function aiSpeak(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = 'hi-IN';
        window.speechSynthesis.speak(speech);
    }
}

function openAI() {
    const modal = document.getElementById("aiModal");
    const resultArea = document.getElementById("aiResultArea");
    const status = document.getElementById("statusText");

    modal.style.display = "block";
    resultArea.innerText = "तैयार हो रहा हूँ...";
    aiSpeak("नमस्ते पवन भाई! मैं आपकी क्या मदद कर सकती हूँ?");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.onstart = () => { status.innerText = "मैं सुन रही हूँ... बोलिये"; };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        resultArea.innerHTML = "आपने कहा: " + transcript;

        setTimeout(() => {
            if (transcript.includes("रसीद") || transcript.includes("लगान")) {
                aiSpeak("ठीक है, भू-लगान पोर्टल खोल रही हूँ।");
                window.open("https://www.bhulagan.bihar.gov.in/", "_blank");
            } 
            else if (transcript.includes("नक्शा") || transcript.includes("मैप")) {
                aiSpeak("जी, बिहार भू-नक्शा पोर्टल खुल रहा है।");
                window.open("https://bhunaksha.bihar.gov.in/", "_blank");
            } 
            else if (transcript.includes("दाखिल") || transcript.includes("खारिज")) {
                aiSpeak("दाखिल खारिज की स्थिति चेक करने वाला पेज खोल रही हूँ।");
                window.open("https://biharbhumi.bihar.gov.in/Biharbhumi/MutationStatusNew", "_blank");
            }
            else if (transcript.includes("खाता") || transcript.includes("जमाबंदी")) {
                aiSpeak("मैं आपके लिए अपना खाता पोर्टल खोल रही हूँ।");
                window.open("https://biharbhumi.bihar.gov.in/", "_blank");
            }
            else {
                aiSpeak("क्षमा करें, मुझे समझ नहीं आया।");
            }
            setTimeout(closeAI, 2500);
        }, 1000);
    };
    recognition.start();
}

function closeAI() { document.getElementById("aiModal").style.display = "none"; }

function searchData() {
    const dist = document.getElementById("districtSelect").value;
    const block = document.getElementById("blockSelect").value;
    const plot = document.getElementById("plotInput").value.trim();

    if (!dist || !block) return alert("कृपया जिला और ब्लॉक चुनें!");

    const info = `${dist}, ${block} ${plot ? '(प्लॉट:'+plot+')' : ''}`;
    saveToHistory(info, "सफल");
    window.open("https://biharbhumi.bihar.gov.in/Biharbhumi/ViewJamabandi", '_blank');
}

function saveToHistory(loc, status) {
    searchHistory.unshift({ plot: loc, time: new Date().toLocaleTimeString(), status: status });
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
function checkFraudStatus() { alert("सावधान! हमेशा सरकारी रिकॉर्ड ही चेक करें।"); }/* Project: Bihar Bhoomi Digital - Pawan Kushwaha */

const locationData = {
    "Araria": ["Araria", "Forbesganj", "Jokihat"],
    "Arwal": ["Arwal", "Kaler", "Karpi"],
    "Aurangabad": ["Aurangabad", "Barun", "Daudnagar"],
    "Patna": ["Patna Sadar", "Bihta", "Danapur", "Phulwari Sharif"],
    "Muzaffarpur": ["Mushahari", "Kanti", "Motipur"],
    "Gaya": ["Gaya Town", "Bodh Gaya", "Sherghati"]
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

function aiSpeak(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = 'hi-IN';
        window.speechSynthesis.speak(speech);
    }
}

function openAI() {
    const modal = document.getElementById("aiModal");
    const resultArea = document.getElementById("aiResultArea");
    const status = document.getElementById("statusText");

    modal.style.display = "block";
    resultArea.innerText = "तैयार हो रहा हूँ...";
    aiSpeak("नमस्ते पवन भाई! मैं आपकी क्या मदद कर सकती हूँ?");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.onstart = () => { status.innerText = "मैं सुन रही हूँ... बोलिये"; };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        resultArea.innerHTML = "आपने कहा: " + transcript;

        setTimeout(() => {
            if (transcript.includes("रसीद") || transcript.includes("लगान")) {
                aiSpeak("ठीक है, भू-लगान पोर्टल खोल रही हूँ।");
                window.open("https://www.bhulagan.bihar.gov.in/", "_blank");
            } 
            else if (transcript.includes("नक्शा") || transcript.includes("मैप")) {
                aiSpeak("जी, बिहार भू-नक्शा पोर्टल खुल रहा है।");
                window.open("https://bhunaksha.bihar.gov.in/", "_blank");
            } 
            else if (transcript.includes("दाखिल") || transcript.includes("खारिज")) {
                aiSpeak("दाखिल खारिज की स्थिति चेक करने वाला पेज खोल रही हूँ।");
                window.open("https://biharbhumi.bihar.gov.in/Biharbhumi/MutationStatusNew", "_blank");
            }
            else if (transcript.includes("खाता") || transcript.includes("जमाबंदी")) {
                aiSpeak("मैं आपके लिए अपना खाता पोर्टल खोल रही हूँ।");
                window.open("https://biharbhumi.bihar.gov.in/", "_blank");
            }
            else {
                aiSpeak("क्षमा करें, मुझे समझ नहीं आया।");
            }
            setTimeout(closeAI, 2500);
        }, 1000);
    };
    recognition.start();
}

function closeAI() { document.getElementById("aiModal").style.display = "none"; }

function searchData() {
    const dist = document.getElementById("districtSelect").value;
    const block = document.getElementById("blockSelect").value;
    const plot = document.getElementById("plotInput").value.trim();

    if (!dist || !block) return alert("कृपया जिला और ब्लॉक चुनें!");

    const info = `${dist}, ${block} ${plot ? '(प्लॉट:'+plot+')' : ''}`;
    saveToHistory(info, "सफल");
    window.open("https://biharbhumi.bihar.gov.in/Biharbhumi/ViewJamabandi", '_blank');
}

function saveToHistory(loc, status) {
    searchHistory.unshift({ plot: loc, time: new Date().toLocaleTimeString(), status: status });
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
function checkFraudStatus() { alert("सावधान! हमेशा सरकारी रिकॉर्ड ही चेक करें।"); }/* Project: Bihar Bhoomi Digital - Pawan Kushwaha */

const locationData = {
    "Araria": ["Araria", "Forbesganj", "Jokihat"],
    "Arwal": ["Arwal", "Kaler", "Karpi"],
    "Aurangabad": ["Aurangabad", "Barun", "Daudnagar"],
    "Patna": ["Patna Sadar", "Bihta", "Danapur", "Phulwari Sharif"],
    "Muzaffarpur": ["Mushahari", "Kanti", "Motipur"],
    "Gaya": ["Gaya Town", "Bodh Gaya", "Sherghati"]
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

function aiSpeak(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = 'hi-IN';
        window.speechSynthesis.speak(speech);
    }
}

function openAI() {
    const modal = document.getElementById("aiModal");
    const resultArea = document.getElementById("aiResultArea");
    const status = document.getElementById("statusText");

    modal.style.display = "block";
    resultArea.innerText = "तैयार हो रहा हूँ...";
    aiSpeak("नमस्ते पवन भाई! मैं आपकी क्या मदद कर सकती हूँ?");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.onstart = () => { status.innerText = "मैं सुन रही हूँ... बोलिये"; };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        resultArea.innerHTML = "आपने कहा: " + transcript;

        setTimeout(() => {
            if (transcript.includes("रसीद") || transcript.includes("लगान")) {
                aiSpeak("ठीक है, भू-लगान पोर्टल खोल रही हूँ।");
                window.open("https://www.bhulagan.bihar.gov.in/", "_blank");
            } 
            else if (transcript.includes("नक्शा") || transcript.includes("मैप")) {
                aiSpeak("जी, बिहार भू-नक्शा पोर्टल खुल रहा है।");
                window.open("https://bhunaksha.bihar.gov.in/", "_blank");
            } 
            else if (transcript.includes("दाखिल") || transcript.includes("खारिज")) {
                aiSpeak("दाखिल खारिज की स्थिति चेक करने वाला पेज खोल रही हूँ।");
                window.open("https://biharbhumi.bihar.gov.in/Biharbhumi/MutationStatusNew", "_blank");
            }
            else if (transcript.includes("खाता") || transcript.includes("जमाबंदी")) {
                aiSpeak("मैं आपके लिए अपना खाता पोर्टल खोल रही हूँ।");
                window.open("https://biharbhumi.bihar.gov.in/", "_blank");
            }
            else {
                aiSpeak("क्षमा करें, मुझे समझ नहीं आया।");
            }
            setTimeout(closeAI, 2500);
        }, 1000);
    };
    recognition.start();
}

function closeAI() { document.getElementById("aiModal").style.display = "none"; }

function searchData() {
    const dist = document.getElementById("districtSelect").value;
    const block = document.getElementById("blockSelect").value;
    const plot = document.getElementById("plotInput").value.trim();

    if (!dist || !block) return alert("कृपया जिला और ब्लॉक चुनें!");

    const info = `${dist}, ${block} ${plot ? '(प्लॉट:'+plot+')' : ''}`;
    saveToHistory(info, "सफल");
    window.open("https://biharbhumi.bihar.gov.in/Biharbhumi/ViewJamabandi", '_blank');
}

function saveToHistory(loc, status) {
    searchHistory.unshift({ plot: loc, time: new Date().toLocaleTimeString(), status: status });
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
function checkFraudStatus() { alert("सावधान! हमेशा सरकारी रिकॉर्ड ही चेक करें।"); }
