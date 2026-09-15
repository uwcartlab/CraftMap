(function(){
    //create pmtiles protocol
    const protocol = new pmtiles.Protocol();
    //assign protocol to map
    maplibregl.addProtocol('pmtiles', protocol.tile);
    //get initial file URL
    const PMTILES_URL = 'data/planet_z9.pmtiles';
    const p = new pmtiles.PMTiles(PMTILES_URL);

    let llb = new maplibregl.LngLatBounds([-170.20, 10.48, -32.46, 60.56]);

    //assign specific file protocol to the map
    protocol.add(p);
    //load style
    fetch("data/edited_style.json")
        .then(data => data.json())
        .then(function(d){
            //function to create map object
            p.getHeader().then(h => {
                let map = new maplibregl.Map({
                    container: 'map',
                    zoom: 3,
                    maxZoom:9,
                    minZoom:3,
                    maxBounds:llb,
                    center: [-99.18,38.14],
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
            });
        })
})();