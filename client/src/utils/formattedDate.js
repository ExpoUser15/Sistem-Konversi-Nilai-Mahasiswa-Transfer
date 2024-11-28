import moment from 'moment';
import 'moment/locale/id.js'; // Impor locale untuk bahasa Indonesia jika diperlukan

moment.updateLocale('id', {
    months: [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ]
});

export const formattedDate = (dateStr) => {
    const date = moment(dateStr).locale('id').format('DD MMMM YYYY');
    return date;
}