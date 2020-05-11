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
    var $button = $(
      '<button class="btn btn-outline-danger btn-lg btn-block" data-target="#pokemonModal" data-toggle="modal">' +
      pokemon.name.toUpperCase() +
      "</button>"
    );
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
        dataType: "json",
      })
      .then(function (item) {
        $.each(item.results, function (index, item) {
          var pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
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
        item.imageUrlBack = details.sprites.back_default;
        item.height = details.height;
        item.weight = details.weight;
        item.types = details.types.map(function (pokemon) {
          return pokemon.type.name;
        });
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  function showModal(pokemon) {
    var $modalBody = $(".modal-body");
    $modalBody.empty();
    var $modalTitle = $(".modal-title");
    $modalTitle.empty();
    var $titleElement = $("<h1>" + pokemon.name.toUpperCase() + "</h1>");
    var $imageElement = $('<img class="modal-img" style="width:40%">');
    $imageElement.attr("src", pokemon.imageUrl);
    var $imageElementBack = $('<img class="modal-img" style="width:40%">');
    $imageElementBack.attr("src", pokemon.imageUrlBack);
    var $heightElement = $("<p>" + "Height: " + pokemon.height + "</p>");
    var $weightElement = $("<p>" + "Weight: " + pokemon.weight + "</p>");
    var $typesElement = $("<p>" + "Types: " + pokemon.types + "</p>");
    $modalTitle.append($titleElement);
    $modalBody.append($imageElement);
    $modalBody.append($imageElementBack);
    $modalBody.append($heightElement);
    $modalBody.append($weightElement);
    $modalBody.append($typesElement);
  };

  return {
    add,
    getAll,
    addListItem,
    loadList,
    loadDetails,
    showModal,
  };
})();

pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});