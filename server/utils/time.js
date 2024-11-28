function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

function getCurrentFormattedDate(now) {
    let date = new Date(now);
    if(!now){
        date = new Date();
    }
    const day = String(date.getDate()).padStart(2, '0');
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    
    return {
        formatDate: `${day} ${month} ${year}`, // Format: 02 Februari 2024
        formatDate2: `${year}-${String(date.getMonth() + 1).padStart(2, '0')}-${day}`, // Format: 2024-02-02
        formatDate3: `${day} ${month} ${year}` // Format: 02 Februari 2024 (alternatif)
    };
}


function getLastSunday() {
    const today = new Date();
    const todayDayOfWeek = today.getDay();
    const lastSunday = new Date(today);
    lastSunday.setDate(today.getDate() - todayDayOfWeek);
    
    return lastSunday;
}

function formatDateToYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const lastSunday = getLastSunday();
const formattedDate = formatDateToYYYYMMDD(lastSunday);
console.log(`Tanggal hari Minggu kemarin: ${formattedDate}`);

module.exports = {
    getCurrentTime,
    getCurrentFormattedDate,
    formattedDate
};
