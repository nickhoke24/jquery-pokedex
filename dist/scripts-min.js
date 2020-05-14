var pokemonRepository = function () {
    var t = [],
        e = "https://pokeapi.co/api/v2/pokemon/?limit=150";

    function n(e) {
        "object" == typeof e && "name" in e && "detailsUrl" in e && t.push(e)
    }

    function o(t) {
        var e = $(".modal-body");
        e.empty();
        var n = $(".modal-title");
        n.empty();
        var o = $("<h1>" + t.name.toUpperCase() + "</h1>"),
            a = $('<img class="modal-img" style="width:40%">');
        a.attr("src", t.imageUrl);
        var i = $('<img class="modal-img" style="width:40%">');
        i.attr("src", t.imageUrlBack);
        var p = $("<p>Height: " + t.height + "</p>"),
            r = $("<p>Weight: " + t.weight + "</p>"),
            l = $("<p>Types: " + t.types + "</p>");
        n.append(o), e.append(a), e.append(i), e.append(p), e.append(r), e.append(l)
    }
    return {
        add: n,
        getAll: function () {
            return t
        },
        addListItem: function (t) {
            var e = $(".pokemon-list"),
                n = $("<li>"),
                a = $('<button class="btn btn-outline-danger btn-lg btn-block" data-target="#pokemonModal" data-toggle="modal">' + t.name.toUpperCase() + "</button>");
            n.append(a), e.append(n), a.on("click", function (e) {
                ! function (t) {
                    pokemonRepository.loadDetails(t).then(function () {
                        console.log(t), o(t)
                    })
                }(t)
            })
        },
        loadList: function () {
            return $.ajax(e, {
                dataType: "json"
            }).then(function (t) {
                $.each(t.results, function (t, e) {
                    n({
                        name: e.name,
                        detailsUrl: e.url
                    })
                })
            }).catch(function (t) {
                console.error(t)
            })
        },
        loadDetails: function (t) {
            var e = t.detailsUrl;
            return $.ajax(e).then(function (e) {
                t.imageUrl = e.sprites.front_default, t.imageUrlBack = e.sprites.back_default, t.height = e.height, t.weight = e.weight, t.types = e.types.map(function (t) {
                    return t.type.name
                })
            }).catch(function (t) {
                console.error(t)
            })
        },
        showModal: o
    }
}();
pokemonRepository.loadList().then(function () {
    pokemonRepository.getAll().forEach(function (t) {
        pokemonRepository.addListItem(t)
    })
});