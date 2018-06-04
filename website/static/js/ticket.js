
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
	/*
  $( "#tmp" ).autocomplete({
	  source: availableTags
	});
	*/
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
		if (typeof ($tmp.attr("all")) == "undefined") {
			if ($("#car_type .tag[all]").attr("value") == "1")
				tag_click($("#car_type .tag[all]").get(0));
		}
		else {
			if ($("#car_type .tag[all]").attr("value") == "1") {
				$("#car_type .tag[value='1']").attr("value", "0");
				$("#car_type .tag[all]").attr("value", "1");
				tag_init();
			}
		}
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
			if (typeof ($tmp.attr("all")) == "undefined") {
				if ($("#car_type .tag[all]").attr("value") == "1")
					tag_click($("#car_type .tag[all]").get(0));
			}
			else {
				if ($("#car_type .tag[all]").attr("value") == "1") {
					$("#car_type .tag[value='1']").attr("value", "0");
					$("#car_type .tag[all]").attr("value", "1");
					tag_init();
				}
			}
		})
	}

	$("#dec").click(function () {
		tag_click($("#inc").get(0));
		tag_click($("#dec").get(0));
	})
	$("#inc").click(function () {
		tag_click($("#inc").get(0));
		tag_click($("#dec").get(0));
	})

	$(".sort_key .tag").click(function () {
		var $tmp = $(event.target);
		if ($tmp.attr("value") == '1')
			return;
		tag_click($(".sort_key .tag[value='1']").get(0));
		tag_click($tmp.get(0));
	})

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
	});
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
		'       <div class="buy_text_2"> <span class="buy_text_2_1">￥</span><span class="buy_text_2_2"></span> </div>',
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

	function filter() {
		var $tag = $("#car_type");
		var $result = $(".search_result");
		$result = $result.find("[kind_tag=" + )
	}

	var flag = 0;
	$(".search_button").click(function () {
		$.post("/search", {flag: flag % 3}, function (data) {
			++flag;
			var num = data.length;
			$("#result .search_result").remove();
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
			$("#result .train_info").hide();
			$("#result .available").hover(function () {
				ob = find_avail(event.target);
				$(ob).addClass('hover');
			}, function () {
				ob = find_avail(event.target);
				$(ob).removeClass('hover');
			});
			$("#result .buy_text_6").click(function () {
				ob = event.target;
				while (!$(ob).hasClass('seat_contain'))
					ob = ob.parentNode;
				ob = ob.firstChild;
				while (!$(ob).hasClass('available'))
					ob = $(ob).next().get(0);
				buy_option_resp(ob);
			});
			$("#result .available").on("click", function () {
				try {
					ob = find_avail(event.target);
					buy_option_resp(ob);
				}
				catch (e) {
					alert(e.message);
				}
			});
			$("#result .train_id_info").click(function () {
				ob = event.target;
				while (!$(ob).hasClass('ticket_info'))
					ob = ob.parentNode;
				$(ob).next().slideToggle(200);
			});
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
