 
$(document).ready(function(){
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
	$( "#tmp" ).autocomplete({
		source: availableTags
	  });
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
                 if (a.match(/[^\x00-\xff]/ig) !== null) 
                {
                    len += 2;
                }
                else
                {
                    len += 1;
                }
            }
            return len;
        }
	function login_input_check_len()
	{
		if(getByteLen($("#login_input").val()) > 20)
		{
			$("#login_error_message").html("邮箱或UID过长");
			$("#login_input").shake(10, 10, 500);
			return 0;
		}
		if(getByteLen($("#password_input").val()) > 20)
		{
			$("#login_error_message").html("密码过长");
			$("#password_input").shake(10, 10, 500);
			return 0;
		}
		$("#login_error_message").html("");
		return 1;
	}
	function login_input_check_empty()
	{
		if(getByteLen($("#login_input").val()) == 0)
		{
			$("#login_error_message").html("邮箱或UID不能为空");
			$("#login_input").shake(10, 10, 500);
			return 0;
		}
		if(getByteLen($("#password_input").val()) == 0)
		{
			$("#login_error_message").html("密码不能为空");
			$("#password_input").shake(10, 10, 500);
			return 0;
		}
		$("#login_error_message").html("");
		return 1;
	}
	$(".my_checkbox").click(function(){
		var $tmp = $(".my_checkbox");
		if($tmp.attr("value") == "0")
		{
			$(".checkbox_icon").html("check_box");
			$tmp.attr("value", "1");
		}
		else
		{
			$(".checkbox_icon").html("check_box_outline_blank");
			$tmp.attr("value", "0");
		}
	})

	function tag_re()
	{
		var $tmp = $(".tag");
		for(var i = 0; i < $tmp.length; ++i)
			if($($tmp[i]).attr("value") == "1")
			{
				if(! $($tmp[i]).hasClass("glass_effect"))
					$($tmp[i]).addClass("glass_effect");
			}
			else	
				if($($tmp[i]).hasClass("glass_effect"))
					$($tmp[i]).removeClass("glass_effect");
	}
	tag_re();

	function tag_click(obj)
	{
		var $tmp = $(obj);
		$tmp.toggleClass("glass_effect");
		if($tmp.attr("value") == "0")
			$tmp.attr("value", "1");
		else
			$tmp.attr("value", "0");
	}

//	$(".tag").click(function(){tag_click(event.target)});

	$("#car_type .tag").click(function(){
		var $tmp = $(event.target);
		tag_click($tmp.get(0));
		if(typeof($tmp.attr("all")) == "undefined")
		{
			if($("#car_type .tag[all]").attr("value") == "1")
				tag_click($("#car_type .tag[all]").get(0));
		}
		else
		{
			if($("#car_type .tag[all]").attr("value") == "1")
			{
				$("#car_type .tag[value='1']").attr("value", "0");
				$("#car_type .tag[all]").attr("value", "1");
				tag_re();
			}
		}
	})

	$("#dec").click(function(){
		tag_click($("#inc").get(0));
		tag_click($("#dec").get(0));
	})
	$("#inc").click(function(){
		tag_click($("#inc").get(0));
		tag_click($("#dec").get(0));
	})

	$(".sort_key .tag").click(function(){
		try{
		var $tmp = $(event.target);
		if($tmp.attr("value") == '1')
			return;
		tag_click($(".sort_key .tag[value='1']").get(0));
		tag_click($tmp.get(0));
		}
		catch(e)
		{alert(e.message);}
	})

	$("form[login] input").keypress(function() {  
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
	$("form[register] input").keypress(function(e) {  
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
	$("#login_button").click(function(){
		if(login_input_check_len() && login_input_check_empty())
		{
			$.post("/login", {name: $("#login_input").val(), password: $("#password_input").val()}, function(data){
				if(!data.result)
				{
					$("#login_error_message").html(data.message);
					$("#login_input, #password_input").shake(10, 10, 500);
				}
				else
				{
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
	$("#register_button").click(function(){
		$(".login_window").css("visibility", "hidden");
		$(".register_window").css("visibility", "visible");
		$(".login_window").addClass("rot180");
		$(".register_window").addClass("rot0");
	});
	$("#return_to_login_window").click(function(){
		$(".login_window").css("visibility", "visible");
		$(".login_window").removeClass("rot180");
		$(".register_window").removeClass("rot0");
		$(".register_window").css("visibility", "hidden");
	})
	$("#user_button").click(function(){
		if(! $("#user_button").hasClass("logged"))
		{
			$(".mask").fadeIn();
			$(".login_window").css("top", "0px");
			$(".login_window").css("visibility", "visible");
			$(".login_window").css("opacity", "1");
		}
	});
	$("#login_window_close").click(function(){
		$(".mask").fadeOut();
		$(".login_window").css("top", "-400px");
		$(".login_window").css("opacity", "0");
		$(".login_window").css("visibility", "hidden");
		$(".register_window").css("visibility", "hidden");
	});
	$(".train_info").hide();
	function find_avail(ob)
	{
		while(! $(ob).hasClass('available'))
			ob = ob.parentNode;
		return ob;
	}
  	$(".available").hover(function(){
		ob=find_avail(event.target);
		$(ob).addClass('hover');
	},function(){
		ob=find_avail(event.target);
		$(ob).removeClass('hover');
	});
	function buy_option_resp(ob)
	{
		if(! $(ob).hasClass('active'))
		{
			$(ob).addClass('active');
			$(ob).next().addClass('buy_option_slip_right');
			$(ob).next().removeClass('buy_option_slip_left');
		}
	  	else
		{
			$(ob).removeClass('active');
			$(ob).next().addClass('buy_option_slip_left');
			$(ob).next().removeClass('buy_option_slip_right');
		}
	}
	$(".buy_text_6").click(function(){
		ob=event.target;
		while(! $(ob).hasClass('seat_contain'))
			ob = ob.parentNode;
		ob=ob.firstChild;
		while(! $(ob).hasClass('available'))
			ob = $(ob).next().get(0);
		buy_option_resp(ob);
	});
  	$(".available").on("click",function(){
		ob=find_avail(event.target);
		buy_option_resp(ob);
  });
	$(".train_id_info").click(function(){
		ob=event.target;
		while(! $(ob).hasClass('ticket_info'))
			ob = ob.parentNode;
		$(ob).next().slideToggle(200);
	});
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
