angular.module('myApp', [])

    .controller('mainCtrl', function($scope, $filter) {

        $(document).ready(function() {
            eventsFunction('');
        });





        // Calendar


        var picker = new Pikaday({
            field: document.getElementById('datepicker'),
            minDate: new Date(1990, 01, 31),
            maxDate: new Date(2040, 12, 31),
            yearRange: [2000, 2040]
        });


        var set = document.getElementById('set-button');

        set.addEventListener('click', function() {
            var getDate = document.getElementById('datepicker').value;
            console.log(getDate);
            if (getDate != '') {
                console.log(new Date(getDate));
                var myDate = new Date(getDate);

                //add a day to the date
                myDate.setDate(myDate.getDate() + 1);
                eventsFunction(new Date(myDate));
            }

        }, false);



    });

function eventsFunction(value) {
    console.log(value);
    var showCalendar = new DayPilot.Calendar("showCalendar");
    showCalendar.businessBeginsHour = 9;
    showCalendar.businessEndsHour = 18;
    // showCalendar.showNonBusiness = false;

    var newDATE = new Date();
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    if (value == '') {
        showCalendar.startDate = new DayPilot.Date(newDATE);
    } else {

        showCalendar.startDate = new DayPilot.Date(value);
        // document.getElementById('datepicker').value = '';
    }

    showCalendar.viewType = "Day";
    //  showCalendar.durationBarVisible = true;
    showCalendar.events.list = [{
            "start": "2040-02-29T08:00:00",
            "end": new DayPilot.Date("2040-02-29T08:00:00").addHours(2),
            "id": "23ef6fcd-e12d-b085-e38a-a4e23d0bb61d",
            "text": "Event 1",
            "backColor": "#FFE599",
            "borderColor": "#000"
        },
        {
            "start": "2018-06-02T12:00:00",
            "end": "2018-06-02T14:00:00",
            "id": "fb62e2dd-267e-ec91-886b-73574d24e25a",
            "text": "S2 Reparing",
            "backColor": "#ccc",
            "borderColor": "#3D85C6"
        },
        {
            "start": "2018-06-03T11:00:00",
            "end": new DayPilot.Date("2018-06-03T11:00:00").addHours(5),
            "id": "fb62e2dd-267e-ec91-886b-73574d24e25a",
            "text": "Nokia Reparing",
            "backColor": "#9FC5E8",
            "borderColor": "#3D85C6"
        }
    ];
    showCalendar.onBeforeEventRender = function(args) {
        if (args.data.tags && args.data.tags.type === "important") {
            args.data.html = "<b>Important Event</b><br>" + args.data.text;
            args.data.fontColor = "#fff";
            args.data.backColor = "#E06666";
        }
    };
    showCalendar.eventDeleteHandling = "Update";

    showCalendar.onEventDelete = function(args) {
        if (!confirm("Do you really want to delete this event?")) {
            args.preventDefault();
        }
    };

    showCalendar.onEventDeleted = function(args) {
        $.post("/event/delete/" + args.e.id(), function(result) {
            showCalendar.message("Event deleted: " + args.e.text());
        });

    };
    showCalendar.onEventClicked = function(args) {
        console.log(args.e.cache.start.value);
        console.log(args.e.cache.end.value);
        var startDateGet = new Date(args.e.cache.start.value);
        var endDateGet = new Date(args.e.cache.end.value);
        $.alert({
            title: 'Event Detail',
            content: "<b style='color:green;font-size:17px;'>" + args.e.cache.text + "</b><br> <br>( " + startDateGet.getDate() + " " + months[startDateGet.getMonth()] + " " + formatAMPM(startDateGet) + " " + days[startDateGet.getDay()] + " to " + endDateGet.getDate() + " " + months[endDateGet.getMonth()] + " " + formatAMPM(endDateGet) + " " + days[endDateGet.getDay()] + " )",
            type: 'blue',
            animation: 'scale',
            draggable: true,
        });
    };

    // showCalendar.onTimeRangeSelected = function(args) {
    //     console.log(args);
    //     var name = prompt("New event name:", "Event");
    //     showCalendar.clearSelection();
    //     if (!name) return;
    //     var e = new DayPilot.Event({
    //         start: args.start,
    //         end: args.end,
    //         id: DayPilot.guid(),
    //         resource: args.resource,
    //         text: name
    //     });
    //     showCalendar.events.add(e);
    //     alert("Created");
    // };



    showCalendar.onIncludeTimeCell = function(args) {
        if (args.cell.start.getDayOfWeek() === 0 || args.cell.start.getDayOfWeek() === 6) { // hide Saturdays, Sundays
            args.cell.visible = false;
        }
    };
    showCalendar.init();
}


function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}