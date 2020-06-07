var pokemonRepository = (function() {
    var repository = [];
    var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  
    var add =(pokemon) => {
      repository.push(pokemon);
    }
  
    var getAll = () => {
      return repository;
    }
  
    var addListItem = (pokemon) => {
      var $pokemonList = $('.pokemon-list');
      var $listItem = $('<li>');
      var $button = $('<button type="button" class=" btn btn-outline-dark btn-sm btn-block pkn-btn list-group-item" data-target="#exampleModal" data-toggle="modal">' + pokemon.name + '</button>');
      $listItem.append($button);
      $pokemonList.append($listItem);
      $button.on('click', function(e) {
        showDetails(pokemon);
      });
    }
  
    var showDetails = (item) => {
      pokemonRepository.loadDetails(item).then(function() {
        console.log(item);
        showModal(item);
      });
    }
  
    var loadList = () => {
      return $.ajax(apiUrl)
        .then(function(json) {
          json.results.forEach(function(item) {
            var pokemon = {
              name: item.name,
              detailsUrl: item.url
            };
            add(pokemon);
          });
        })
        .catch(function(e) {
          console.error(e);
        });
    }
  
    var loadDetails = (item) => {
      var url = item.detailsUrl;
      return $.ajax(url)
        .then(function(details) {
          // add the details to the item
          item.imageUrl = details.sprites.front_default;
          item.height = details.height;
          // loop for each of the pokemon types
          item.types = [];
          for (var i = 0; i < details.types.length; i++) {
            item.types.push(details.types[i].type.name);
          }
  
          item.abilities = [];
          for (var i = 0; i < details.abilities.length; i++) {
            item.abilities.push(details.abilities[i].ability.name);
          }

          item.weight = details.weight;
          return item;
        })
        .catch(function(e) {
          console.error(e);
        });
    }
    // Show modal content
    function showModal(item) {
        var modalBody = $('.modal-body');
        var modalTitle = $('.modal-title');
        modalBody.empty();
        modalTitle.empty();    
        var nameElement = $('<h1 class="poke-name-title"></h1>').text(item.name);
        var imageElement = $('<img class="imagen">').attr('src', item.imageUrl);
        var heightElement = $('<p></p>').text('Height: ' + item.height);
        var weightElement = $('<p></p>').text('Weight: ' + item.weight);
        var typesElement = $('<p></p>').text('Type: ' + item.types.join(', '));
        var abilitiesElement = $('<p></p>').text('Abilities: ' + item.abilities.join(', '));
        // appends
        modalTitle.append(nameElement);
        modalBody.append(imageElement);
        modalBody.append(heightElement);
        modalBody.append(weightElement);
        modalBody.append(typesElement);
        modalBody.append(abilitiesElement);
      }

  
    // hides modal when close button is clicked
    var hideModal = () => {
      var $modalContainer = $('#modal-container');
      $modalContainer.removeClass('is-visible');
    }
  
    // Hides model when ESC is clicked
    jQuery(window).on('keydown', e => {
      var $modalContainer = $('#modal-container');
      if (e.key === 'Escape' && $modalContainer.hasClass('is-visible')) {
        hideModal();
      }
    });
  
    // Hides modal if clicked outside of it
    var $modalContainer = document.querySelector('#modal-container');
    $modalContainer.addEventListener('click', e => {
      var target = e.target;
      if (target === $modalContainer) {
        hideModal();
      }
    });
  
    return {
      add: add,
      getAll: getAll,
      addListItem: addListItem,
      loadList: loadList,
      loadDetails: loadDetails,
      showModal: showModal,
      hideModal: hideModal
    };
  })();
  
  pokemonRepository.loadList().then(function() {
    // Now the data is loaded!
    pokemonRepository.getAll().forEach(function(pokemon) {
      pokemonRepository.addListItem(pokemon);
    });
  });