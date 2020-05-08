var pokemonRepository = (function () {
    var pokemonList = [];
    var apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

    function add(pokemon) {
        if (
            typeof pokemon === "object" &&
            "name" in pokemon &&
            "detailsUrl" in pokemon
        ) {
            pokemonList.push(pokemon);
        }
    }

    function getAll() {
        return pokemonList;
    }

    function addListItem(pokemon) {
        var $pokedexList = $(".pokemon-list");
        var $listitem = $("<li>");
        var $button = $('<button class="pokemon-button">' + pokemon.name + '</button>');
        $listitem.append($button);
        $pokedexList.append($listitem);
        $button.on("click", function (event) {
            showDetails(pokemon);
        });
    }

    function showDetails(pokemon) {
        pokemonRepository.loadDetails(pokemon).then(function () {
            console.log(pokemon);
            showModal(pokemon);
        });
    }

    function loadList() {
        return $.ajax(apiUrl, {
                dataType: "json"
            })
            .then(function (item) {
                $.each(item.results, function (index, item) {
                    var pokemon = {
                        name: item.name,
                        detailsUrl: item.url
                    };
                    // Adds the retrieved data to the Repository
                    add(pokemon);
                });
            })
            .catch(function (e) {
                console.error(e);
            });
    }

    function loadDetails(item) {
        var url = item.detailsUrl;
        return $.ajax(url)
            .then(function (details) {
                item.imageUrl = details.sprites.front_default;
                item.height = details.height;
                item.types = details.types.map(function (pokemon) {
                    return pokemon.type.name;
                });
            })
            .catch(function (e) {
                console.error(e);
            });
    }

    function showModal(pokemon) {
        var $modalContainer = $("#modal-container");
        $modalContainer.empty();
        var $modal = $('<div class="modal"></div>')
        var $closeButtonElement = $('<button class="modal-close">Close</button>');
        $closeButtonElement.on('click', hideModal);
        var $titleElement = $('<h1>' + pokemon.name.toUpperCase() + '</h1>');
        var $imageElement = $('<img class="modal-img">');
        $imageElement.attr("src", pokemon.imageUrl);
        var $heightElement = $('<p>' + "Height: " + pokemon.height + '</p>');
        var $typesElement = $('<p>' + "Types: " + pokemon.types + '</p>');
        $modal.append($closeButtonElement);
        $modal.append($titleElement);
        $modal.append($imageElement);
        $modal.append($heightElement);
        $modal.append($typesElement);
        $modalContainer.append($modal);
        $modalContainer.addClass("is-visible");
    }

    function hideModal() {
        var $modalContainer = $("#modal-container");
        $modalContainer.removeClass("is-visible");
    }

    // Click ESC to hide Modal
    $(document).on('keydown', function (event) {
        var $modalContainer = $('#modal-container');
        if (event.key == "Escape" && $modalContainer.hasClass("is-visible")) {
            hideModal();
        }
    });

    // Click outside of Modal to hide Modal
    var $modalContainer = $('#modal-container');
    $modalContainer.click(function () {
        if ($modalContainer.hasClass("is-visible")) {
            hideModal();
        }
    });

    return {
        add,
        getAll,
        addListItem,
        loadList,
        loadDetails,
    };
})();

pokemonRepository.loadList().then(function () {
    pokemonRepository.getAll().forEach(function (pokemon) {
        pokemonRepository.addListItem(pokemon);
    });
});