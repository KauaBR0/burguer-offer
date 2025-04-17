// Countdown Timer Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Set initial time (11 minutes and 59 seconds)
    let totalSeconds = 11 * 60 + 59;

    // Update both timers
    function updateTimers() {
        if (totalSeconds <= 0) {
            // Reset to 11:59 when it reaches zero
            totalSeconds = 11 * 60 + 59;
        }

        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        // Format the time
        const minutesTens = Math.floor(minutes / 10);
        const minutesOnes = minutes % 10;
        const secondsTens = Math.floor(seconds / 10);
        const secondsOnes = seconds % 10;

        // Update first timer
        document.getElementById('minutes-tens').textContent = minutesTens;
        document.getElementById('minutes-ones').textContent = minutesOnes;
        document.getElementById('seconds-tens').textContent = secondsTens;
        document.getElementById('seconds-ones').textContent = secondsOnes;

        // Update second timer if it exists
        if (document.getElementById('minutes-tens-2')) {
            document.getElementById('minutes-tens-2').textContent = minutesTens;
            document.getElementById('minutes-ones-2').textContent = minutesOnes;
            document.getElementById('seconds-tens-2').textContent = secondsTens;
            document.getElementById('seconds-ones-2').textContent = secondsOnes;
        }

        // Decrement the timer
        totalSeconds--;
    }

    // Initial update
    updateTimers();

    // Update every second
    setInterval(updateTimers, 1000);

    // Location Functionality
    const modal = document.getElementById('locationModal');
    const saveLocationBtn = document.getElementById('saveLocation');
    const estadoSelect = document.getElementById('estado');
    const cidadeInput = document.getElementById('cidade');

    // Check if location is already saved in localStorage
    const savedState = localStorage.getItem('userState');
    const savedCity = localStorage.getItem('userCity');

    if (savedState && savedCity) {
        // If location is already saved, hide modal and display the saved location
        modal.style.display = 'none';
        displayUserLocation(savedState, savedCity);
    } else {
        // Try to get location automatically first
        tryGetAutomaticLocation();
    }

    // Function to try to get location automatically
    function tryGetAutomaticLocation() {
        // Hide modal while we try to get location
        modal.style.display = 'none';

        // Show loading message
        const loadingMessage = document.createElement('div');
        loadingMessage.id = 'locationLoading';
        loadingMessage.innerHTML = '<div class="loading-container"><div class="loading-spinner"></div><p>Obtendo sua localização...</p></div>';
        document.body.appendChild(loadingMessage);

        // Check if geolocation is available
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                // Success callback
                function(position) {
                    // Got coordinates, now get city and state using reverse geocoding
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    // Use OpenStreetMap's Nominatim API for reverse geocoding
                    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;

                    fetch(nominatimUrl, {
                        headers: {
                            'User-Agent': 'HamburguerNacional/1.0' // Identificação da aplicação (obrigatório para Nominatim)
                        }
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Falha na resposta da API de geocodificação');
                            }
                            return response.json();
                        })
                        .then(data => {
                            // Remove loading message
                            document.body.removeChild(loadingMessage);

                            // Extract state and city from the response
                            let state = '';
                            let city = '';

                            // Try to get state and city from address components
                            if (data.address) {
                                // For Brazil, state is usually in 'state' field
                                if (data.address.state) {
                                    // Convert full state name to abbreviation for Brazil
                                    state = getStateAbbreviation(data.address.state);
                                }

                                // City could be in city, town, village, etc.
                                city = data.address.city || data.address.town ||
                                       data.address.village || data.address.hamlet ||
                                       data.address.municipality || '';
                            }

                            // If we couldn't get both state and city, show the modal
                            if (!state || !city) {
                                console.log('Não foi possível determinar a localização completa');
                                modal.style.display = 'block';
                                return;
                            }

                            // Save to localStorage
                            localStorage.setItem('userState', state);
                            localStorage.setItem('userCity', city);

                            // Display the location
                            displayUserLocation(state, city);
                        })
                        .catch(error => {
                            console.error('Erro na geocodificação:', error);
                            document.body.removeChild(loadingMessage);
                            modal.style.display = 'block';
                        });
                },
                // Error callback
                function(error) {
                    // Remove loading message
                    document.body.removeChild(loadingMessage);

                    // Show manual input modal if user denied permission or any other error
                    modal.style.display = 'block';
                    console.log('Erro ao obter localização:', error.message);
                },
                // Options
                {
                    timeout: 10000,  // 10 seconds timeout
                    maximumAge: 60000 // Accept cached position up to 1 minute old
                }
            );
        } else {
            // Geolocation not supported by this browser
            document.body.removeChild(loadingMessage);
            modal.style.display = 'block';
            console.log('Geolocalização não é suportada por este navegador');
        }
    }

    // Save location when button is clicked (manual input)
    saveLocationBtn.addEventListener('click', function() {
        const estado = estadoSelect.value;
        const cidade = cidadeInput.value;

        if (estado && cidade) {
            // Save to localStorage
            localStorage.setItem('userState', estado);
            localStorage.setItem('userCity', cidade);

            // Hide modal
            modal.style.display = 'none';

            // Display the location
            displayUserLocation(estado, cidade);
        } else {
            alert('Por favor, selecione um estado e digite sua cidade.');
        }
    });

    // Function to display user location in the UI
    function displayUserLocation(estado, cidade) {
        // Display in the restaurant card
        document.getElementById('userState').textContent = estado;
        document.getElementById('userCity').textContent = cidade;

        // Display in the free delivery banner
        document.getElementById('deliveryCity').textContent = cidade;
    }

    // Function to convert full state name to abbreviation (for Brazil)
    function getStateAbbreviation(stateName) {
        const stateMap = {
            'Acre': 'AC',
            'Alagoas': 'AL',
            'Amapá': 'AP',
            'Amazonas': 'AM',
            'Bahia': 'BA',
            'Ceará': 'CE',
            'Distrito Federal': 'DF',
            'Espírito Santo': 'ES',
            'Goiás': 'GO',
            'Maranhão': 'MA',
            'Mato Grosso': 'MT',
            'Mato Grosso do Sul': 'MS',
            'Minas Gerais': 'MG',
            'Pará': 'PA',
            'Paraíba': 'PB',
            'Paraná': 'PR',
            'Pernambuco': 'PE',
            'Piauí': 'PI',
            'Rio de Janeiro': 'RJ',
            'Rio Grande do Norte': 'RN',
            'Rio Grande do Sul': 'RS',
            'Rondônia': 'RO',
            'Roraima': 'RR',
            'Santa Catarina': 'SC',
            'São Paulo': 'SP',
            'Sergipe': 'SE',
            'Tocantins': 'TO'
        };

        // Normalize the state name (remove accents, convert to lowercase)
        const normalizedName = stateName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

        // Try to find a match in our map
        for (const [key, value] of Object.entries(stateMap)) {
            const normalizedKey = key.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            if (normalizedName.includes(normalizedKey) || normalizedKey.includes(normalizedName)) {
                return value;
            }
        }

        // If no match found, return the first two characters of the state name
        return stateName.substring(0, 2).toUpperCase();
    }
});
