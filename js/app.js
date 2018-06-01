angular.module('myApp', [])

    .controller('mainCtrl', function($scope, $filter) {


        var showCalendar = new DayPilot.Calendar("showCalendar");
        var newDATE = new Date();
        var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        showCalendar.startDate = new DayPilot.Date(newDATE);
        showCalendar.viewType = "Day";
        showCalendar.durationBarVisible = true;
        showCalendar.events.list = [{
                "start": "2018-06-01T11:00:00",
                "end": new DayPilot.Date("2018-06-01T11:00:00").addHours(5),
                "id": "23ef6fcd-e12d-b085-e38a-a4e23d0bb61d",
                "text": "Umer BirthDay",
                "backColor": "#FFE599",
                "borderColor": "#000"
            },
            {
                "start": "2018-06-03T11:00:00",
                "end": "2018-06-03T14:00:00",
                "id": "fb62e2dd-267e-ec91-886b-73574d24e25a",
                "text": "Event 2",
                "backColor": "#9FC5E8",
                "borderColor": "#3D85C6"
            },
            {
                "start": "2016-06-07T10:00:00",
                "end": "2016-06-07T13:00:00",
                "id": "29b7a553-d44f-8f2c-11e1-a7d5f62eb123",
                "text": "Event 3",
                "backColor": "#B6D7A8",
                "borderColor": "#6AA84F"
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


        showCalendar.init();

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
    });