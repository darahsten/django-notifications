var notify_badge_class;
var notify_menu_class;
var notify_menu_id = 'notifications-id';
var notify_api_url;
var notify_fetch_count;
var notify_unread_url;
var notify_mark_all_unread_url;
var notify_refresh_period = 15000;
var consecutive_misfires = 0;
var registered_functions = [];

function fill_notification_badge(data) {
    var badges = document.getElementsByClassName(notify_badge_class);
    if (badges) {
        for(var i = 0; i < badges.length; i++){
            badges[i].innerHTML = data.unread_count;
        }
    }
}


function mark_as_read(e){
    var slug = $(this).attr('id');
    var mark_read_url = '/inbox/notifications/mark-as-read/'+slug+ '/';
    var r = new XMLHttpRequest();
    r.addEventListener('readystatechange', function(event){
        if (this.readyState === 4){
            if (this.status === 200){
                   // console.log('Success')
                }else{
                    //console.log('Failed to post data to the API to mark as read.')
                }
            }
        });
        r.open("POST", mark_read_url, true);
        r.send();
}

function fill_notification_list(data) {
    var notify_list = document.getElementById(notify_menu_id);
    if (notify_list) {
        var messages = data.unread_list.map(function (item) {
            var message = "";
            if(typeof item.actor !== 'undefined'){
                message = item.actor;
            }
            if(typeof item.verb !== 'undefined'){
                message = message + " " + item.verb;
            }
            if(typeof item.target !== 'undefined'){
                message = message + " " + item.target;
            }
            if(typeof item.time_elapsed !== 'undefined'){
                message = message + "<br>" + item.time_elapsed;
            }
            // if(typeof item.slug !== 'undefined'){
            //     message = message + '<p hidden class=notifications-slug>' + item.slug + '</p>';
            // }
            return "<li class='notifications-list-item list-group-item'" + "id="+ item.slug+ ">" + message + "</li>";
        }).join('');

        notify_list.innerHTML = messages;
        var notifications = data.unread_list.map(function(item){
            $('#'+item.slug).mouseover(mark_as_read);
        });

        var badges = $('span.badge');
        if (badges){
        for(var i = 0; i < badges.length; i++){
                badges[i].innerHTML = data.unread_count;
            }
        }
    }
}

function register_notifier(func) {
    registered_functions.push(func);
}

function fetch_api_data() {
    if (registered_functions.length > 0) {
        //only fetch data if a function is setup
        var r = new XMLHttpRequest();
        r.addEventListener('readystatechange', function(event){
            if (this.readyState === 4){
                if (this.status === 200){
                    consecutive_misfires = 0;
                    var data = JSON.parse(r.responseText);
                    registered_functions.forEach(function (func) { func(data); });
                }else{
                    consecutive_misfires++;
                }
            }
        });
        r.open("GET", notify_api_url+'?max='+notify_fetch_count, true);
        r.send();
    }
    if (consecutive_misfires < 10) {
        setTimeout(fetch_api_data,notify_refresh_period);
    } else {
        var badges = document.getElementsByClassName(notify_badge_class);
        if (badges) {
            for (var i = 0; i < badges.length; i++){
                badges[i].innerHTML = "!";
                badges[i].title = "Connection lost!"
            }
        }
    }
}

setTimeout(fetch_api_data, 1000);
