
$(document).ready(function () {
	var availableTags = [
		"ActionScript",
		"AppleScript",
		"Asp",
		"BASIC",
		"C",
		"C",
		"C",
		"C",
		"C",
		"C",
		"C",
		"C",
		"C",
		"C",
		"C",
		"C",
		"C",
		"C",
		"C",
		"C",
		"C",
		"C",
		"C",
		"C",
		"C",
		"C",
		"C",
		"C++",
		"Clojure",
		"COBOL",
		"ColdFusion",
		"Erlang",
		"Fortran",
		"Groovy",
		"Haskell",
		"Java",
		"JavaScript",
		"Lisp",
		"Perl",
		"PHP",
		"Python",
		"Ruby",
		"Scala",
		"Scheme"
	];
	try{
	$("#start_s").autocomplete({
		source: availableTags
	});
	$("#end_s").autocomplete({
		source: availableTags
	});
	}
	catch(e)
	{
		alert(e);
	}
	jQuery.fn.shake = function (intShakes /*Amount of shakes*/, intDistance /*Shake distance*/, intDuration /*Time duration*/) {
		this.each(function () {
			var jqNode = $(this);
			jqNode.css({ position: 'relative' });
			for (var x = 1; x <= intShakes; x++) {
				jqNode.animate({ left: (intDistance * -1) }, (((intDuration / intShakes) / 4)))
					.animate({ left: intDistance }, ((intDuration / intShakes) / 2))
					.animate({ left: 0 }, (((intDuration / intShakes) / 4)));
			}
		});
		return this;
	};

$(window).scroll(function () {
	var pagename = $(".topnav").attr("pagename");
	var objtop;
	if (pagename == "home") {
		objtop = $(".welcome_block").height();
		objtop *= 0.3;
	}
	if (pagename == "search") {
		objtop = $(".web_name").height();
		objtop *= 0.5;
	}
	if ($(window).scrollTop() > objtop) {
		if (!$(".topnav").hasClass("top_float"))
			$(".topnav").addClass("top_float");
	}
	else {
		if ($(".topnav").hasClass("top_float"))
			$(".topnav").removeClass("top_float");
	}
});

function getByteLen(val) {
	var len = 0;
	for (var i = 0; i < val.length; i++) {
		var a = val.charAt(i);
		if (a.match(/[^\x00-\xff]/ig) !== null) {
			len += 2;
		}
		else {
			len += 1;
		}
	}
	return len;
}
function login_input_check_len() {
	if (getByteLen($("#login_input").val()) > 20) {
		$("#login_error_message").html("邮箱或UID过长");
		$("#login_input").shake(10, 10, 500);
		return 0;
	}
	if (getByteLen($("#password_input").val()) > 20) {
		$("#login_error_message").html("密码过长");
		$("#password_input").shake(10, 10, 500);
		return 0;
	}
	$("#login_error_message").html("");
	return 1;
}
function login_input_check_empty() {
	if (getByteLen($("#login_input").val()) == 0) {
		$("#login_error_message").html("邮箱或UID不能为空");
		$("#login_input").shake(10, 10, 500);
		return 0;
	}
	if (getByteLen($("#password_input").val()) == 0) {
		$("#login_error_message").html("密码不能为空");
		$("#password_input").shake(10, 10, 500);
		return 0;
	}
	$("#login_error_message").html("");
	return 1;
}
$(".my_checkbox").click(function () {
	var $tmp = $(".my_checkbox");
	if ($tmp.attr("value") == "0") {
		$(".checkbox_icon").html("check_box");
		$tmp.attr("value", "1");
	}
	else {
		$(".checkbox_icon").html("check_box_outline_blank");
		$tmp.attr("value", "0");
	}
})

function tag_init() {
	var $tmp = $(".tag");
	for (var i = 0; i < $tmp.length; ++i)
		if ($($tmp[i]).attr("value") == "1") {
			if (!$($tmp[i]).hasClass("glass_effect"))
				$($tmp[i]).addClass("glass_effect");
		}
		else
			if ($($tmp[i]).hasClass("glass_effect"))
				$($tmp[i]).removeClass("glass_effect");
}
tag_init();

function tag_click(obj) {
	var $tmp = $(obj);
	$tmp.toggleClass("glass_effect");
	if ($tmp.attr("value") == "0")
		$tmp.attr("value", "1");
	else
		$tmp.attr("value", "0");
}
$("#car_type [all]").click(function () {
	var $tmp = $(event.target);
	tag_click($tmp.get(0));
	if ($("#car_type .tag[all]").attr("value") == "1") {
		$("#car_type .tag[value='1']").attr("value", "0");
		$("#car_type .tag[all]").attr("value", "1");
		tag_init();
	}
	filter();
})

function tag_reset() {
	$("#car_type .tag:not([all])").remove();
	$("#car_type [all]").attr("value", "1");
	var $tmp = $(".search_result");
	var m = $tmp.length;
	if (m == 0) {
		if (!$("#empty_window").hasClass("search_window_disp"))
			$("#empty_window").addClass("search_window_disp");
		if ($("#tag_window").hasClass("search_window_disp"))
			$("#tag_window").removeClass("search_window_disp");
		return;
	}
	if ($("#empty_window").hasClass("search_window_disp"))
		$("#empty_window").removeClass("search_window_disp");
	if (!$("#tag_window").hasClass("search_window_disp"))
		$("#tag_window").addClass("search_window_disp");
	var list = new Array(m);
	for (var i = 0; i < m; ++i)
		list[i] = ($($tmp.get(i))).attr("kind_tag");
	$.unique(list.sort());
	m = list.length;
	for (var i = 0; i < m; ++i)
		$("#car_type").append('<div class="tag" value="0">' + list[i] + '</div>');
	tag_init();
	$("#car_type .tag:not([all])").click(function () {
		var $tmp = $(event.target);
		tag_click($tmp.get(0));
		if ($("#car_type .tag[all]").attr("value") == "1")
			tag_click($("#car_type .tag[all]").get(0));
		filter();
	})
	filter();
}


$("form[login] input").keypress(function () {
	if (event.which == 13) {
		var inputs = $("form[login]").find("input");
		var idx = inputs.index(this);
		if (idx != inputs.length - 1) {
			inputs[idx + 1].focus();
			inputs[idx + 1].select();
		}
		else
			$("#login_button").click();
	}
});
$("form[register] input").keypress(function (e) {
	if (e.which == 13) {
		var inputs = $("form[register]").find("input");
		var idx = inputs.index(this);
		if (idx != inputs.length - 1) {
			inputs[idx + 1].focus();
			inputs[idx + 1].select();
		}
		else
			$("#register_button2").click();
	}
});
$("#login_input, #password_input").blur(login_input_check_len);
$("#login_button").click(function () {
	if (login_input_check_len() && login_input_check_empty()) {
		$.post("/login", { name: $("#login_input").val(), password: $("#password_input").val() }, function (data) {
			if (!data.result) {
				$("#login_error_message").html(data.message);
				$("#login_input, #password_input").shake(10, 10, 500);
			}
			else {
				$("#user_name").html(data.message);
				$(".mask").fadeOut();
				$(".login_window").css("top", "-400px");
				$(".login_window").css("opacity", "0");
				$(".login_window").css("visibility", "hidden");
				$("#user_button").addClass("logged");
			}
		});
	}
});
$("#register_button").click(function () {
	$(".login_window").css("visibility", "hidden");
	$(".register_window").css("visibility", "visible");
	$(".login_window").addClass("rot180");
	$(".register_window").addClass("rot0");
});
$("#return_to_login_window").click(function () {
	$(".login_window").css("visibility", "visible");
	$(".login_window").removeClass("rot180");
	$(".register_window").removeClass("rot0");
	$(".register_window").css("visibility", "hidden");
})
$("#user_button").click(function () {
	if (!$("#user_button").hasClass("logged")) {
		$(".mask").fadeIn();
		$(".login_window").css("top", "0px");
		$(".login_window").css("visibility", "visible");
		$(".login_window").css("opacity", "1");
	}
	else
		$(".user_menu").toggleClass("user_menu_display");
});
$(".shrink_button").click(function () {
	$(".user_menu").toggleClass("user_menu_display");
})
$("#login_window_close").click(function () {
	$(".mask").fadeOut();
	$(".login_window").css("top", "-400px");
	$(".login_window").css("opacity", "0");
	$(".login_window").css("visibility", "hidden");
	$(".register_window").css("visibility", "hidden");
});
function find_avail(ob) {
	while (!$(ob).hasClass('available'))
		ob = ob.parentNode;
	return ob;
}
function buy_option_resp(ob) {
	if (!$(ob).hasClass('active')) {
		$(ob).addClass('active');
		$(ob).next().addClass('buy_option_slip_right');
		$(ob).next().removeClass('buy_option_slip_left');
	}
	else {
		$(ob).removeClass('active');
		$(ob).next().addClass('buy_option_slip_left');
		$(ob).next().removeClass('buy_option_slip_right');
	}
}
var ticket_html1 = [
	'<div class="w3-card glass_effect search_result">',
	' <div class="ticket_info" >',
	'   <div class="time_used_info"></div>',
	'   <div class="train_id_info">',
	'     <div class="train_id"></div>',
	'     <div class="train_id_2"></div>',
	'   </div>',
	'   <div class="time_info">',
	'     <div class="starting_station">',
	'       <time></time>',
	'       <div class="station_name"></div>',
	'     </div>',
	'     <div class="link_symbol">&rarr;</div>',
	'     <div class="ending_station">',
	'       <time></time>',
	'       <div class="station_name"></div>',
	'     </div>',
	'   </div>',
	'   <div class="seat_contain">',
	'     <div class="seat_contain_text">',
	'       <div class="buy_text_1">最低价</div>',
	'       <div class="buy_text_2"> <span class="buy_text_2_1">￥</span><span class="buy_text_2_2 pri"></span> </div>',
	'       <div class="buy_text_3"></div>',
	'     </div>',
	'   </div>',
	'   <div class="ver_line"></div>',
	'   <div class="seat_contain_list">',
	'   </div>',
	'   </div>',
	'  <div class="train_info">',
	'   <div class="time_used_info"></div>',
	'   <div style="overflow: hidden; display: inline-flex; background-color: rgba(236, 236, 236, 0.8); flex: 1 1 auto">',
	'    <div class="train_info_contain">',
	'     <div class="train_id_info_detail"> <img src="../static/icon/ic_directions_railway_black_48dp.png" align="middle" alt="train" height="20px"></div>',
	'     <div class="station_detail">',
	'       <div class="starting_station">',
	'         </div>',
	'       <div class="link_symbol">&rarr;</div>',
	'       <div class="ending_station">',
	'         </div>',
	'     </div>',
	'   </div>',
	'   <div class="ver_line"></div>',
	'   <div class="station_list">',
	'   </div>',
	'   </div>',
	'   </div>',
];
var ticket_html2 = [
	'     <div class="seat_contain">',
	'       <div class="seat_contain_text">',
	'         <div class="buy_text_1"></div>',
	'         <div class="buy_text_2"> <span class="buy_text_2_1"></span> <span class="buy_text_2_2"></span></div>',
	'         <div class="buy_text_3"></div>',
	'       </div>',
	'       <div class="buy_option">',
	'         <center>',
	'           <button class="w3-button buy_text_4">购买</button>',
	'           <br>',
	'           <input class="w3-input w3-hover-gray buy_text_5" type="tel" value="1" min="1" max="10" style="width:60%; border-style: none">',
	'           <hr style="width: 30%; position: relative;  top: -18px;">',
	'           <button type="button" class="buy_text_6">&#60;</button>',
	'         </center>',
	'       </div>',
	'     </div>'
];
var ticket_html3 = [
	'     <div class="station_contain">',
	'       <div class="station_text_1"></div>',
	'       <div class="station_text_2"><span style="font-size: 13px"></span></div>',
	'       <div class="station_text_3"></div>',
	'     </div>'
]

function get_minute(t) {
	var ans = 0;
	ans += (t.charAt(0) - '0') * 600;
	ans += (t.charAt(1) - '0') * 60;
	ans += (t.charAt(3) - '0') * 10;
	ans += (t.charAt(4) - '0') * 1;
	return ans;
}

function get_time(t1, t2) {
	var ans = get_minute(t2) - get_minute(t1);
	if (ans < 0)
		ans += 24 * 60;
	var re = '';
	re = re + Math.floor(ans / 600);
	ans %= 600;
	re = re + Math.floor(ans / 60) + ':';
	ans %= 60;
	re = re + Math.floor(ans / 10);
	ans %= 10;
	re = re + ans;
	return re;
}

function bind_click(s) {
	$(s + " .buy_option_slip_left").removeClass("buy_option_slip_left");
	$(s + " .buy_option_slip_right").removeClass("buy_option_slip_right");
	$(s + " .seat_contain .active").removeClass("active");
	$(s + " .available").hover(function () {
		ob = find_avail(event.target);
		$(ob).addClass('hover');
	}, function () {
		ob = find_avail(event.target);
		$(ob).removeClass('hover');
	});
	$(s + " .buy_text_6").click(function () {
		ob = event.target;
		while (!$(ob).hasClass('seat_contain'))
			ob = ob.parentNode;
		ob = ob.firstChild;
		while (!$(ob).hasClass('available'))
			ob = $(ob).next().get(0);
		buy_option_resp(ob);
	});
	$(s + " .available").click(function () {
		ob = find_avail(event.target);
		buy_option_resp(ob);
	});
	$(s + " .train_id_info").click(function () {
		ob = event.target;
		while (!$(ob).hasClass('ticket_info'))
			ob = ob.parentNode;
		$(ob).next().slideToggle(200);
	});
}

function ticket_sort() {
	var $sort_list = $("#display_container .search_result");
	$sort_list.sort(function (a, b) {
		$key_word = $(".sort_key .tag[value='1']");
		var ans;
		if ($key_word.attr("id") == "leaving_time") {
			if ($(a).find(".starting_station time").html() < $(b).find(".starting_station time").html())
				ans = 1;
			if ($(a).find(".starting_station time").html() == $(b).find(".starting_station time").html())
				ans = 0;
			if ($(a).find(".starting_station time").html() > $(b).find(".starting_station time").html())
				ans = -1;
		}
		if ($key_word.attr("id") == "arriving_time") {
			if ($(a).find(".ending_station time").html() < $(b).find(".ending_station time").html())
				ans = 1;
			if ($(a).find(".ending_station time").html() == $(b).find(".ending_station time").html())
				ans = 0;
			if ($(a).find(".ending_station time").html() > $(b).find(".ending_station time").html())
				ans = -1;
		}
		if ($key_word.attr("id") == "used_time") {
			var ta = get_time($(a).find(".starting_station time").html(), $(a).find(".ending_station time").html());
			var tb = get_time($(b).find(".starting_station time").html(), $(b).find(".ending_station time").html());
			if (ta < tb)
				ans = 1;
			if (ta == tb)
				ans = 0;
			if (ta > tb)
				ans = -1;
		}
		if ($key_word.attr("id") == "price") {
			if ($(a).find(".pri").html() < $(b).find(".pri").html())
				ans = 1;
			if ($(a).find(".pri").html() == $(b).find(".pri").html())
				ans = 0;
			if ($(a).find(".pri").html() > $(b).find(".pri").html())
				ans = -1;
		}
		if ($("#inc").attr("value") == '1')
			ans = -ans;
		return ans;
	});
	$("#display_container").append($sort_list);
}

var $all;
function filter() {
	var $tag = $("#car_type .tag[value='1']");
	var n = $tag.length;
	$("#display_container").empty();
	$("#result").empty();
	if (n == 1 && typeof ($tag.attr("all")) != "undefined") {
		$("#display_container").html($all);
		bind_click('#display_container');
		ticket_sort();
		return;
	}
	$("#result").html($all);
	for (var i = 0; i < n; ++i)
		$("#display_container").append($("#result").find("[kind_tag='" + $($tag.get(i)).html() + "']"));
	bind_click('#display_container');
	ticket_sort();
}

$("#dec").click(function () {
	tag_click($("#inc").get(0));
	tag_click($("#dec").get(0));
	filter();
})
$("#inc").click(function () {
	tag_click($("#inc").get(0));
	tag_click($("#dec").get(0));
	filter();
})

$(".sort_key .tag").click(function () {
	var $tmp = $(event.target);
	if ($tmp.attr("value") == '1')
		return;
	tag_click($(".sort_key .tag[value='1']").get(0));
	tag_click($tmp.get(0));
	filter();
})

var flag = 0;
$(".search_button").click(function () {
	$.post("/search", { flag: flag % 3 }, function (data) {
		++flag;
		var num = data.length;
		$(".search_result").remove();
		for (var i = 0; i < num; ++i) {
			$("#tmp").html(ticket_html1.join(''));
			$("#tmp .search_result").attr("kind_tag", data[i].kind_tag);
			$("#tmp .train_id").html(data[i].kind);
			$("#tmp .train_id_2").html(data[i].name);
			$("#tmp .starting_station time").html(data[i].dep_time);
			$("#tmp .ending_station time").html(data[i].des_time);
			$("#tmp .starting_station .station_name").html(data[i].dep);
			if (data[i].dep == data[i].station[0])
				$("#tmp .starting_station .station_name").prepend('始 ');
			$("#tmp .ending_station .station_name").html(data[i].des);
			if (data[i].des == data[i].station[data[i].station.length - 1])
				$("#tmp .ending_station .station_name").append(' 终');
			if (get_minute(data[i].dep_time) > get_minute(data[i].des_time))
				$("#tmp .ending_station time").append('<span style="font-size: 13px; letter-spacing: -3px">+1</span>');
			var min = 1000000000;
			var m = data[i].price.length;
			for (var j = 0; j < m; ++j) {
				$("#tmp .seat_contain_list").append(ticket_html2.join(''));
				if (typeof (data[i].price[j]) != 'string')
					min = Math.min(min, data[i].price[j]);
			}
			$("#tmp .buy_text_2_2").html('' + min);
			var $seats = $("#tmp .seat_contain_list").find(".seat_contain");
			for (var j = 0; j < m; ++j) {
				var $now = $($seats.get(j));
				$now.find(".buy_text_1").html(data[i].seat_name[j]);
				$now.find(".buy_text_2_2").html(data[i].price[j]);
				if (data[i].remain[j] != -1) {
					$now.find(".buy_text_2_1").html('￥');
					if (data[i].remain[j] > 0)
						$now.find(".seat_contain_text").addClass("available");
					if (data[i].remain[j] <= 20)
						$now.find(".buy_text_3").html('余' + data[i].remain[j] + '张');
				}
			}
			m = data[i].station.length;
			$("#tmp .train_id_info_detail").append(data[i].name + ' | 全程' + get_time(data[i].arr_time[0], data[i].arr_time[m - 1]) + ' | 此程' + get_time(data[i].dep_time, data[i].des_time));
			$("#tmp .station_detail .starting_station").html(data[i].station[0] + '<br>' + data[i].arr_time[0]);
			$("#tmp .station_detail .ending_station").html(data[i].station[m - 1] + '<br>' + data[i].arr_time[m - 1]);
			if (get_minute(data[i].arr_time[0]) > get_minute(data[i].arr_time[m - 1]))
				$("#tmp .station_detail .ending_station").append('<span style="font-size: 13px;">+1</span>');
			for (var j = 0; j < m; ++j)
				$("#tmp .station_list").append(ticket_html3.join(''));
			var $station = $("#tmp .station_contain");
			for (var j = 0; j < m; ++j) {
				var $now = $($station.get(j));
				$now.find(".station_text_1").html(data[i].station[j]);
				$now.find(".station_text_2").prepend(data[i].arr_time[j]);
				$now.find(".station_text_3").html(data[i].stan_time[j]);
				if (get_minute(data[i].arr_time[j]) < get_minute(data[i].arr_time[0]))
					$now.find("span").html('+1');
			}
			$("#result").append($("#tmp .search_result"));
		}
		$all = $(".search_result");
		$(".train_info").hide();
		tag_reset();
	});
})
});

/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function myFunction() {
	var x = document.getElementById("myTopnav");
	if (x.className === "topnav") {
		x.className += " responsive";
	} else {
		x.className = "topnav";
	}
} 
