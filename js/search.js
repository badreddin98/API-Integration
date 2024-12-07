// When page loads
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

    // Check if we have a Pokemon name in URL
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonName = urlParams.get('name');
    if (pokemonName) {
        searchInput.value = pokemonName;
        searchPokemon(pokemonName);
    }

    // Handle search form submit
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.toLowerCase().trim();
        searchPokemon(searchTerm);
    });
});

// Search for Pokemon
async function searchPokemon(searchTerm) {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error-message');
    const result = document.getElementById('pokemon-result');

    // Show loading spinner
    loading.classList.remove('d-none');
    error.classList.add('d-none');
    result.innerHTML = '';

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);
        if (!response.ok) throw new Error('Pokemon not found');

        const pokemon = await response.json();
        showPokemonDetails(pokemon);
    } catch (error) {
        document.getElementById('error-message').textContent = 'Pokemon not found. Please try another name or ID.';
        document.getElementById('error-message').classList.remove('d-none');
    } finally {
        loading.classList.add('d-none');
    }
}

// Display Pokemon details
function showPokemonDetails(pokemon) {
    // Create types HTML
    const types = pokemon.types
        .map(type => `<span class="type-badge type-${type.type.name}">${type.type.name}</span>`)
        .join('');

    // Create stats HTML
    const stats = pokemon.stats
        .map(stat => {
            const statName = stat.stat.name.replace('-', ' ');
            const value = stat.base_stat;
            const percentage = (value / 255) * 100;
            
            return `
                <div class="mb-2">
                    <div class="d-flex justify-content-between">
                        <span class="text-capitalize">${statName}</span>
                        <span>${value}</span>
                    </div>
                    <div class="stat-bar">
                        <div class="stat-fill" style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
        })
        .join('');

    // Create abilities HTML
    const abilities = pokemon.abilities
        .map(ability => `<span class="badge bg-secondary me-1">${ability.ability.name}</span>`)
        .join('');

    // Display Pokemon information
    document.getElementById('pokemon-result').innerHTML = `
        <div class="pokemon-card">
            <div class="row">
                <div class="col-md-6 text-center">
                    <img src="${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}" 
                         alt="${pokemon.name}"
                         class="img-fluid mb-3">
                    <h2 class="text-capitalize mb-3">${pokemon.name}</h2>
                    <div class="mb-3">${types}</div>
                    <div class="mb-3">
                        <h5>Abilities</h5>
                        ${abilities}
                    </div>
                    <div class="mb-3">
                        <p><strong>Height:</strong> ${pokemon.height / 10}m</p>
                        <p><strong>Weight:</strong> ${pokemon.weight / 10}kg</p>
                    </div>
                </div>
                <div class="col-md-6">
                    <h4 class="mb-3">Base Stats</h4>
                    <div class="pokemon-stats">
                        ${stats}
                    </div>
                </div>
            </div>
        </div>
    `;
}
