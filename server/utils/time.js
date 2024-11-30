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

module.exports = {
    getCurrentFormattedDate
};
