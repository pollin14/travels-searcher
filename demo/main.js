
$('form.dummy-travel-searcher-form').travelsSearcher({
    adjacencyListUlr: '/demo/adjacency-list.json',
    resultsAmount: 20
});


$(document).on('clickbus.travels-searcher-submit', function () {
   alert('The form is valid.');
});