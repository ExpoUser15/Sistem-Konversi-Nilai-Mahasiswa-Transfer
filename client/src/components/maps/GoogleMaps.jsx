import React, { useEffect, useState } from 'react';

const GoogleMaps = () => {
    const [map, setMap] = useState(null);

    useEffect(() => {
        const mapElement = document.getElementById('gmaps');
        const mapOptions = {
            center: { lat: -0.8973851312156773, lng: 131.31882432995823 },
            zoom: 12,
        };
        const mapInstance = new google.maps.Map(mapElement, mapOptions);
        setMap(mapInstance);
    }, []);

    return (
        <div>
            {/* Elemen untuk menampilkan peta */}
            <div id="gmaps" style={{ width: '100%', height: '400px' }}></div>
        </div>
    );
};

export default GoogleMaps;
