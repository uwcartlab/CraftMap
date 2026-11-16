(function () {
    let map;
    //create pmtiles protocol
    const protocol = new pmtiles.Protocol();
    //assign protocol to map
    maplibregl.addProtocol('pmtiles', protocol.tile);
    //get initial file URL
    const PMTILES_URL = 'data/planet_z9.pmtiles';
    const p = new pmtiles.PMTiles(PMTILES_URL);
    //create lat/lon bounds of map
    let llb = new maplibregl.LngLatBounds([-170.20, 10.48, -32.46, 60.56]);
    //assign specific file protocol to the map
    protocol.add(p);
    //load style
    fetch("data/edited_style.json")
        .then(data => data.json())
        .then(function (d) {
            //function to create map object
            p.getHeader().then(h => {
                map = new maplibregl.Map({
                    container: 'map',
                    zoom: 3,
                    maxZoom: 9,
                    minZoom: 3,
                    maxBounds: llb,
                    center: [-99.18, 38.14],
                    style: {
                        version: 8,
                        sources: {
                            'protomaps': {
                                type: 'vector',
                                url: `pmtiles://${PMTILES_URL}`,
                                attribution: '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
                            }
                        },
                        layers: d.layers
                    }
                });
                //when style is finished loading, upload JSON points  
                map.on('load', () => {
                    //upload JSON points
                    fetch("data/locations_wip.geojson")
                        .then(data => data.json())
                        .then(function (json) {
                            //add source from geojson file
                            map.addSource('locations', {
                                'type': 'geojson',
                                'data': json
                            });
                            //add individual layer
                            map.addLayer({
                                'id': 'locations_wip',
                                'type': 'circle',
                                'source': 'locations',
                                'paint': {
                                    'circle-color': '#888888',
                                    'circle-stroke-color': 'blue',
                                    'circle-stroke-width': 1,
                                    'circle-radius': 2
                                },
                            });
                    })
                })
            })
        })
})();