import React, { useRef, useEffect, useState } from 'react';
import Chart from 'react-google-charts';
declare global {
    interface Window {
        google: {
            maps: {
                Map: typeof google.maps.Map;
            };
            initMap?: () => void; // Make initMap optional
        };
    }
}
function MapComponent() {
    const [chartData, setChartData] = useState<string[][]>([]);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Load Google Maps JavaScript API script dynamically
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAvDclNGqLLeEbV-nhGr_ix6LoKQExIYck&callback=initMap`;
        script.async = true;
        document.body.appendChild(script);

        // Initialize the map once the script is loaded
        (window as any).initMap = () => {
            if (!mapContainerRef.current) return;

            const map = new window.google.maps.Map(mapContainerRef.current, {
                zoom: 5,
                center: { lat: 20.5937, lng: 78.9629 }, // Center map at India's coordinates
            });

            // Define capital city coordinates and icon URLs
            const capitals = [
                { name: 'Delhi', lat: 28.6139, lng: 77.209 },
                // Add more capital cities as needed
            ];

            // Add markers for each capital city
            capitals.forEach(capital => {
                new window.google.maps.Marker({
                    position: { lat: capital.lat, lng: capital.lng },
                    map,
                    title: capital.name,
                    icon: {
                        url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png', // Icon URL
                        scaledSize: new window.google.maps.Size(48, 48), // Size of the icon
                    },
                });
            });
        };

        // Clean up function to remove the script when component unmounts
        return () => {
            document.body.removeChild(script);
        };
    }, []);

  return (
    <div id="map_div" style={{ height: '500px', width: '900px' }}>
      <Chart
        chartType="GeoChart"
        width="100%"
        height="100%"
        data={chartData}
        options={{
          region: 'DE',
          displayMode: 'regions',
          resolution: 'provinces',
          colorAxis: { colors: ['#e0e0e0', '#267114'] },
          backgroundColor: '#ffffff',
          datalessRegionColor: '#f5f5f5',
          defaultColor: '#267114',
          tooltip: { trigger: 'hover' },
          icons: {
            default: {
              normal: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
              selected: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            },
            Capital: {
              normal: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              selected: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            },
          },
        }}
      />
    </div>
  );
}

export default MapComponent;
