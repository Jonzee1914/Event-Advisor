// code from ticketmaster to display events --Needs update to match bulma version of IDs/Classes
var page = 2;
var key = "b8uIGZ1Kpi03x34hni2KAVVqshOjS6DS";
var btn = document.querySelector("#searchBtn");

var dateElement = document.querySelector("#datePicker");
// Future datepicker elements
// var startDate = dateElement.value;
//var endDate = startDate + 30day

// Datepicker
// $( function() {
//   $( "#datePicker" ).datepicker();
// });


// Get events function
function getEvents(page, city) {

  $('#events-panel').show();
  $('#attraction-panel').hide();

  if (page < 0) {
    page = 0;
    return;
  }
  if (page > 0) {
    if (page > getEvents.json.page.totalPages-1) {
      page=0;
    }
  }
  
  $.ajax({
    type:"GET",
    url:"https://app.ticketmaster.com/discovery/v2/events.json?apikey="+key+"&city="+city+"&sort=date,asc&size=4&page="+page,
    async:true,
    dataType: "json",
    success: function(json) {
          getEvents.json = json;
  			  showEvents(json);
  		   },
    error: function(xhr, status, err) {
  			  console.log(err);
  		   }
  });

  //buttons
  $('#prev').click(function() {
    getEvents(--page, city);
  });
  
  $('#next').click(function() {
    getEvents(++page, city);
  });
}

function showEvents(json) {
  var items = $('#events .list-group-item');
  items.hide();
  var events = json._embedded.events;
  var item = items.first();
  for (var i=0;i<events.length;i++) {
    item.children('.eventTitle').text(events[i].name);
    item.children('.list-group-item-text').text(events[i].dates.start.localDate);
    try {
      item.children('.venue').text(events[i]._embedded.venues[0].name + " in " + events[i]._embedded.venues[0].city.name);
    } catch (err) {
      console.log(err);
    }
    item.show();
    item.off("click");
    item.click(events[i], function(eventObject) {
      console.log(eventObject.data);
      try {
        getAttraction(eventObject.data._embedded.attractions[0].id);
      } catch (err) {
      console.log(err);
      }
    });
    item=item.next();
  }
}


//For Future release - events panel with event details
//function getAttraction(id) {
//   $.ajax({
//     type:"GET",
//     url:"https://app.ticketmaster.com/discovery/v2/attractions/"+id+".json?apikey="+key,
//     async:true,
//     dataType: "json",
//     success: function(json) {
//           showAttraction(json);
//   		   },
//     error: function(xhr, status, err) {
//   			  console.log(err);
//   		   }
//   });
// }

// function showAttraction(json) {
//   $('#events-panel').hide();
//   $('#attraction-panel').show();
  
//   $('#attraction-panel').click(function() {
//     getEvents(page);
//   });
  
//   $('#attraction .list-group-item-heading').first().text(json.name);
//   $('#attraction img').first().attr('src',json.images[0].url);
//   $('#classification').text(json.classifications[0].segment.name + " - " + json.classifications[0].genre.name + " - " + json.classifications[0].subGenre.name);
// }

// Search bar city search
var search = function(event){
  event.preventDefault();

  //getting the value of the input
  var inputElement = document.querySelector("#searchCity");
  var city = inputElement.value.trim();
  var page = 0;
    
  getEvents(page, city);
  
};

// listener for search button click
btn.addEventListener("click", search);

// City search function on click
$(document).on("click", ".cityBtn", function(event) {
  event.preventDefault();

  var page = 0;
  var city = $(this).attr("attr");
  getEvents(page, city);
});
