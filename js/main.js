// Get random Pokemon when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Get random Pokemon ID (1-898)
    const randomId = Math.floor(Math.random() * 898) + 1;
    getRandomPokemon(randomId);
});

// Fetch random Pokemon data
async function getRandomPokemon(id) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!response.ok) throw new Error('Failed to fetch Pokemon');
        
        const pokemon = await response.json();
        displayRandomPokemon(pokemon);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('random-pokemon').innerHTML = 'Failed to load Pokemon. Please try again later.';
    }
}

// Display random Pokemon
function displayRandomPokemon(pokemon) {
    const types = pokemon.types.map(type => 
        `<span class="type-badge type-${type.type.name}">${type.type.name}</span>`
    ).join(' ');

    document.getElementById('random-pokemon').innerHTML = `
        <img src="${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}" 
             alt="${pokemon.name}" 
             class="img-fluid" 
             style="max-width: 200px;">
        <h3 class="mt-3 text-capitalize">${pokemon.name}</h3>
        <div class="mt-2">
            ${types}
        </div>
        <div class="mt-3">
            <a href="search.html?name=${pokemon.name}" class="btn btn-primary">View Details</a>
        </div>
    `;
}
